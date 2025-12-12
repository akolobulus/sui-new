module suicare::drugs {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{String};
    use sui::dynamic_field;

    // --- Structs ---

    struct DrugRegistry has key {
        id: UID,
    }

    struct DrugInfo has store, drop {
        product_name: String,
        manufacturer: String,
        expiry_date: String,
        is_valid: bool,
        producer: address // ✅ NEW: Stores the wallet address of the creator
    }

    // --- Init ---
    fun init(ctx: &mut TxContext) {
        let registry = DrugRegistry {
            id: object::new(ctx),
        };
        transfer::share_object(registry);
    }

    // --- Functions ---

    public entry fun register_drug(
        registry: &mut DrugRegistry,
        batch_number: String,
        product_name: String,
        manufacturer: String,
        expiry_date: String,
        ctx: &mut TxContext // We need ctx to get the sender
    ) {
        let sender = tx_context::sender(ctx);

        let info = DrugInfo { 
            product_name, 
            manufacturer, 
            expiry_date, 
            is_valid: true,
            producer: sender // ✅ Automatically record who is registering this
        };
        
        // Add to registry (Key: BatchNum, Value: Info)
        dynamic_field::add(&mut registry.id, batch_number, info);
    }
}