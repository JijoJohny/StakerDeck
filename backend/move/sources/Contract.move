module HashSign::aptolize {
    use std::error;
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::randomness;
    use std::vector;

    // Resource for managing admin data
    struct AdminData has key {
        total_deposits: u64,
        current_winner: address,
        lottery_amount: u64
    }

    // Resource for managing user deposits
    struct UserData has key {
        total_deposits: u64
    }

    #[event]
    struct Deposited has drop, store {
        user: address,
        amount: u64
    }

    #[event]
    struct Withdrawn has drop, store {
        user: address,
        amount: u64
    }

    #[event]
    struct WinnerPicked has drop, store {
        user: address,
        amount: u64
    }

    #[event]
    struct Claimed has drop, store {
        user: address,
        amount: u64
    }

    const NO_ADMIN_DATA: u64 = 1;
    const NO_USER_DATA: u64 = 2;
    const INSUFFICIENT_FUNDS: u64 = 3;

    // Initialize the module with admin data
    fun init_module(admin: signer) {
        let admin_addr = signer::address_of(&admin);
        move_to(&admin, AdminData {
            total_deposits: 0,
            current_winner: admin_addr,
            lottery_amount: 0
        });
    }

    // Function to handle deposits
    public entry fun deposit(admin: signer, user: signer, amount: u64)
    acquires AdminData, UserData {
        let user_addr = signer::address_of(&user);

        // Create or update user data
        if (!exists<UserData>(user_addr)) {
            move_to(&user, UserData { total_deposits: amount });
        } else {
            let user_data = borrow_global_mut<UserData>(user_addr);
            user_data.total_deposits = user_data.total_deposits + amount;
        };

        // Update admin data
        let admin_addr = signer::address_of(&admin);
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));
        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        admin_data.total_deposits = admin_data.total_deposits + amount;

        // Emit deposit event
        event::emit(Deposited {
            user: user_addr,
            amount: amount
        });
    }

    // Function to handle withdrawals
    public entry fun withdraw(admin: signer, user: signer, amount: u64)
    acquires AdminData, UserData {
        let user_addr = signer::address_of(&user);
        assert!(exists<UserData>(user_addr), error::not_found(NO_USER_DATA));

        let user_data = borrow_global_mut<UserData>(user_addr);
        assert!(user_data.total_deposits >= amount, error::not_found(INSUFFICIENT_FUNDS));
        user_data.total_deposits = user_data.total_deposits - amount;

        let admin_addr = signer::address_of(&admin);
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));
        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        admin_data.total_deposits = admin_data.total_deposits - amount;

        event::emit(Withdrawn {
            user: user_addr,
            amount: amount
        });
    }

    // Function to pick a winner from eligible users
    #[randomness]
    entry fun pick_winner(admin: signer, eligible_users: vector<address>, amount: u64)
    acquires AdminData {
        let to: u64 = vector::length(&eligible_users) - 1;
        let winning_number: u64 = randomness::u64_range(0, to);

        let admin_addr = signer::address_of(&admin);
        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        let winner = vector::borrow(&eligible_users, winning_number);
        admin_data.current_winner = *winner;
        admin_data.lottery_amount = amount;

        event::emit(WinnerPicked {
            user: *winner,
            amount: amount
        });
    }

    // Function to claim lottery winnings
    public entry fun claim(admin: signer, user: signer)
    acquires AdminData {
        let user_addr = signer::address_of(&user);
        let admin_addr = signer::address_of(&admin);
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));

        let admin_data = borrow_global_mut<AdminData>(admin_addr);
        assert!(admin_data.current_winner == user_addr, error::not_found(NO_USER_DATA));

        event::emit(Claimed {
            user: admin_data.current_winner,
            amount: admin_data.lottery_amount
        });

        // Reset winner data
        admin_data.current_winner = admin_addr;
        admin_data.lottery_amount = 0;
    }

    // View functions
    #[view]
    public fun is_lottery_winner(admin_addr: address, user: address): bool
    acquires AdminData {
        assert!(exists<AdminData>(admin_addr), error::not_found(NO_ADMIN_DATA));
        borrow_global<AdminData>(admin_addr).current_winner == user
    }

    #[view]
    public fun lottery_winner(): address
    acquires AdminData {
        assert!(exists<AdminData>(@HashSign), error::not_found(NO_ADMIN_DATA));
        borrow_global<AdminData>(@HashSign).current_winner
    }

    #[view]
    public fun lottery_amount(): u64
    acquires AdminData {
        assert!(exists<AdminData>(@HashSign), error::not_found(NO_ADMIN_DATA));
        borrow_global<AdminData>(@HashSign).lottery_amount
    }
}
