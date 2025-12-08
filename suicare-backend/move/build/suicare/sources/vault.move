module suicare::vault {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{String};
    use sui::event;
    use sui::clock::{Self, Clock};

    // --- Structs ---

    // This represents a single secure document in your vault
    struct VaultItem has key, store {
        id: UID,
        title: String,
        category: String,
        ipfs_cid: String, // The encrypted file reference
        file_type: String,
        file_size: String,
        date_added: u64
    }

    // --- Events ---
    // Emitted when a new item is added, helpful for the frontend to update
    struct VaultItemAdded has copy, drop {
        id: address,
        owner: address,
        title: String
    }

    // --- Functions ---

    // Function to create a new vault item
    public entry fun create_item(
        title: String,
        category: String,
        ipfs_cid: String,
        file_type: String,
        file_size: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Create the object
        let item = VaultItem {
            id: object::new(ctx),
            title,
            category,
            ipfs_cid,
            file_type,
            file_size,
            date_added: clock::timestamp_ms(clock)
        };

        // Emit an event so we can track it
        event::emit(VaultItemAdded {
            id: object::uid_to_address(&item.id),
            owner: sender,
            title: item.title
        });

        // Transfer ownership to the user (sender)
        transfer::transfer(item, sender);
    }
}