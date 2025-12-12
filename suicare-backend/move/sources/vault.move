module suicare::vault {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String}; // Updated import to allow string operations
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};

    // --- Errors ---
    const EInsufficientFunds: u64 = 1;
    const ENotAuthorized: u64 = 2;
    const EAlreadyStaked: u64 = 3;

    // --- Structs ---

    // ✅ NEW FEATURE 4: Emergency Profile (Shared Object)
    struct EmergencyProfile has key {
        id: UID,
        owner: address,
        name: String,
        blood_type: String,
        allergies: String,
        medications: String,
        organ_donor: bool
    }

    // ✅ NEW FEATURE 4: Guardian Pass (Key for family members)
    struct GuardianPass has key, store {
        id: UID,
        patient: address,
        patient_name: String,
        granted_at: u64
    }

    // (Existing Structs)
    struct ResearchPool has key {
        id: UID,
        balance: Balance<SUI>,
        total_stakers: u64,
        reward_per_stake: u64 
    }

    struct DataStake has key, store {
        id: UID,
        record_id: address, 
        owner: address,
        staked_at: u64
    }

    struct HealthAvatar has key, store {
        id: UID, name: String, level: u64, xp: u64, image_url: String, owner: address
    }

    struct VaultItem has key, store {
        id: UID, title: String, category: String, ipfs_cid: String, file_type: String, file_size: String, date_added: u64
    }

    struct HealthRecord has key, store {
        id: UID, record_type: String, doctor: String, hospital: String, ipfs_cid: String, details_encrypted: String, date_added: u64, is_verified: bool
    }

    struct InsuranceVault has key {
        id: UID, balance: Balance<SUI>, admin: address
    }

    struct InsurancePolicy has key, store {
        id: UID, policy_type: String, coverage_amount: u64, premium: u64, expiry_date: u64, is_active: bool
    }

    struct Claim has key, store {
        id: UID, policy_id: address, amount: u64, reason: String, date_filed: u64, status: u8 
    }

    struct AccessRequest has key, store {
        id: UID, requester: address, requester_name: String, reason: String, status: u8, created_at: u64
    }

    struct Appointment has key, store {
        id: UID, patient: address, doctor: address, doctor_name: String, reason: String, duration: u64, escrow: Balance<SUI>, date_booked: u64, status: u8 
    }

    // --- Events ---
    struct ProfileCreated has copy, drop { id: address, owner: address }
    struct GuardianAdded has copy, drop { patient: address, guardian: address }

    struct PoolFunded has copy, drop { amount: u64, funder: address }
    struct DataStaked has copy, drop { staker: address, record_id: address }
    struct RewardsClaimed has copy, drop { staker: address, amount: u64 }
    
    struct AvatarMinted has copy, drop { id: address, owner: address, name: String }
    struct AvatarLeveledUp has copy, drop { id: address, new_level: u64 }
    struct VaultItemAdded has copy, drop { id: address, title: String }
    struct RecordAdded has copy, drop { id: address, record_type: String }
    struct PolicyPurchased has copy, drop { id: address, owner: address, amount: u64 }
    struct ClaimSubmitted has copy, drop { id: address, owner: address, amount: u64 }
    struct RequestSent has copy, drop { id: address, from: address, to: address }
    struct AppointmentBooked has copy, drop { id: address, patient: address, doctor: address, duration: u64 }
    struct AppointmentCancelled has copy, drop { id: address, by: address }
    struct FundsReleased has copy, drop { id: address, amount: u64, to: address }

    // --- Init ---
    fun init(ctx: &mut TxContext) {
        let vault = InsuranceVault { id: object::new(ctx), balance: balance::zero(), admin: tx_context::sender(ctx) };
        transfer::share_object(vault);

        let pool = ResearchPool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_stakers: 0,
            reward_per_stake: 100000000 // 0.1 SUI
        };
        transfer::share_object(pool);
    }

    // --- Functions ---

    // ✅ NEW: Create Emergency Profile
    public entry fun create_profile(
        name: String,
        blood_type: String,
        allergies: String,
        medications: String,
        organ_donor: bool,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let profile = EmergencyProfile {
            id: object::new(ctx),
            owner: sender,
            name,
            blood_type,
            allergies,
            medications,
            organ_donor
        };
        event::emit(ProfileCreated { id: object::uid_to_address(&profile.id), owner: sender });
        transfer::share_object(profile);
    }

    // ✅ NEW: Add Guardian (Sends Pass to Family)
    public entry fun add_guardian(
        guardian_addr: address,
        patient_name: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let pass = GuardianPass {
            id: object::new(ctx),
            patient: sender,
            patient_name,
            granted_at: clock::timestamp_ms(clock)
        };
        event::emit(GuardianAdded { patient: sender, guardian: guardian_addr });
        transfer::transfer(pass, guardian_addr);
    }

    // (All previous functions preserved)
    public entry fun fund_pool(pool: &mut ResearchPool, payment: Coin<SUI>, ctx: &mut TxContext) {
        let amount = coin::value(&payment);
        balance::join(&mut pool.balance, coin::into_balance(payment));
        event::emit(PoolFunded { amount, funder: tx_context::sender(ctx) });
    }
    public entry fun stake_record(pool: &mut ResearchPool, record_addr: address, clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let stake = DataStake {
            id: object::new(ctx),
            record_id: record_addr,
            owner: sender,
            staked_at: clock::timestamp_ms(clock)
        };
        pool.total_stakers = pool.total_stakers + 1;
        event::emit(DataStaked { staker: sender, record_id: record_addr });
        transfer::public_transfer(stake, sender);
    }
    public entry fun claim_rewards(pool: &mut ResearchPool, stake: DataStake, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let reward_amount = pool.reward_per_stake;
        assert!(balance::value(&pool.balance) >= reward_amount, EInsufficientFunds);
        let payment = coin::take(&mut pool.balance, reward_amount, ctx);
        transfer::public_transfer(payment, sender);
        let DataStake { id, record_id: _, owner: _, staked_at: _ } = stake;
        object::delete(id);
        pool.total_stakers = pool.total_stakers - 1;
        event::emit(RewardsClaimed { staker: sender, amount: reward_amount });
    }
    public entry fun mint_avatar(name: String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let avatar = HealthAvatar {
            id: object::new(ctx), name, level: 1, xp: 0, image_url: string::utf8(b"LION_CUB"), owner: sender
        };
        event::emit(AvatarMinted { id: object::uid_to_address(&avatar.id), owner: sender, name });
        transfer::transfer(avatar, sender);
    }
    public entry fun level_up(avatar: &mut HealthAvatar) {
        avatar.xp = avatar.xp + 100;
        if (avatar.xp >= 100) { avatar.level = avatar.level + 1; avatar.xp = 0; };
        event::emit(AvatarLeveledUp { id: object::uid_to_address(&avatar.id), new_level: avatar.level });
    }
    public entry fun create_item(title: String, category: String, ipfs_cid: String, file_type: String, file_size: String, clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let item = VaultItem { id: object::new(ctx), title, category, ipfs_cid, file_type, file_size, date_added: clock::timestamp_ms(clock) };
        transfer::transfer(item, sender);
    }
    public entry fun add_record(record_type: String, doctor: String, hospital: String, ipfs_cid: String, details_encrypted: String, clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let record = HealthRecord { id: object::new(ctx), record_type, doctor, hospital, ipfs_cid, details_encrypted, date_added: clock::timestamp_ms(clock), is_verified: false };
        transfer::transfer(record, sender);
    }
    public entry fun buy_policy(vault: &mut InsuranceVault, payment: Coin<SUI>, policy_type: String, premium: u64, coverage_amount: u64, duration_ms: u64, clock: &Clock, ctx: &mut TxContext) {
        let value = coin::value(&payment);
        assert!(value >= premium, EInsufficientFunds);
        balance::join(&mut vault.balance, coin::into_balance(payment));
        let sender = tx_context::sender(ctx);
        let policy = InsurancePolicy { id: object::new(ctx), policy_type, coverage_amount, premium, expiry_date: clock::timestamp_ms(clock) + duration_ms, is_active: true };
        transfer::transfer(policy, sender);
    }
    public entry fun submit_claim(policy_id: address, amount: u64, reason: String, clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let claim = Claim { id: object::new(ctx), policy_id, amount, reason, date_filed: clock::timestamp_ms(clock), status: 0 };
        transfer::transfer(claim, sender);
    }
    public entry fun request_access(patient_address: address, requester_name: String, reason: String, clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let request = AccessRequest { id: object::new(ctx), requester: sender, requester_name, reason, status: 0, created_at: clock::timestamp_ms(clock) };
        transfer::transfer(request, patient_address);
    }
    public entry fun resolve_request(request: &mut AccessRequest, status: u8, _ctx: &mut TxContext) {
        request.status = status;
    }
    public entry fun book_appointment(doctor_addr: address, doctor_name: String, reason: String, duration: u64, payment: Coin<SUI>, clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let escrow_balance = coin::into_balance(payment);
        let appointment = Appointment { id: object::new(ctx), patient: sender, doctor: doctor_addr, doctor_name, reason, duration, escrow: escrow_balance, date_booked: clock::timestamp_ms(clock), status: 0 };
        transfer::share_object(appointment);
    }
    public entry fun cancel_appointment(appt: &mut Appointment, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == appt.patient, ENotAuthorized);
        assert!(appt.status == 0, ENotAuthorized);
        let amount = balance::value(&appt.escrow);
        let refund = coin::take(&mut appt.escrow, amount, ctx);
        transfer::public_transfer(refund, appt.patient);
        appt.status = 2; 
    }
    public entry fun release_funds(appt: &mut Appointment, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == appt.patient, ENotAuthorized);
        assert!(appt.status == 0, ENotAuthorized);
        let amount = balance::value(&appt.escrow);
        let payment = coin::take(&mut appt.escrow, amount, ctx);
        transfer::public_transfer(payment, appt.doctor);
        appt.status = 1; 
    }
}