module airdnb::airdnb {
    use sui::package;
    use sui::display;
    use std::string::{utf8, String};

    // Structure representing a Booking NFT
    public struct BookingNFT has key, store {
        id: UID,
        room: String,
        nights: u64,
        check_out_date: u64,
    }

    // Structure representing the admin capability
    public struct AdminCap has key {
        id: UID,
    }

    // Structure representing a Proposal
    public struct Proposal has key, store {
        id: UID,
        description: String,
        votes_for: u64,
        votes_against: u64,
        creator: address, // Address of the proposal creator
    }

    // Witness
    public struct AIRDNB has drop {}

    // Init function to initialize the contract and assign admin capability to the owner
    fun init(witness: AIRDNB, ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        
        let keys = vector[
            utf8(b"name"),
        ];

        let values = vector[
            utf8(b"{room}, {nights} nights"),
        ];

        let publisher = package::claim(witness, ctx);

        let mut display = display::new_with_fields<BookingNFT>(
            &publisher, keys, values, ctx
        );

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    // Function to mint a new Booking NFT
    public fun mint(_: &AdminCap, room: vector<u8>, nights: u64, check_out_date: u64, ctx: &mut TxContext): BookingNFT {
        BookingNFT {
            id: object::new(ctx),
            room: utf8(room),
            nights,
            check_out_date,
        }
    }

    // Function to create a proposal
    public entry fun create_proposal(description: vector<u8>, ctx: &mut TxContext) {
        let proposal = Proposal {
            id: object::new(ctx),
            description: utf8(description),
            votes_for: 0,
            votes_against: 0,
            creator: tx_context::sender(ctx),
        };
        transfer::transfer(proposal, tx_context::sender(ctx));
    }

    // Helper function to calculate remaining nights
    public fun remaining_nights(nft: &BookingNFT, current_time_ms: u64): u64 {
        let check_out_time_ms = nft.check_out_date * 1000;
        if (current_time_ms < check_out_time_ms) {
            (check_out_time_ms - current_time_ms) / 86400000 // Convert milliseconds to days
        } else {
            0
        }
    }

    // Function to vote on a proposal
    public entry fun vote_on_proposal(proposal: &mut Proposal, nft: &mut BookingNFT, vote_for: bool, ctx: &mut TxContext) {
        let current_time_ms = tx_context::epoch_timestamp_ms(ctx);
        let remaining = remaining_nights(nft, current_time_ms);
        let vote_weight = if (remaining < nft.nights) { remaining } else { nft.nights };
        // Record the vote
        if (vote_for) {
            proposal.votes_for = proposal.votes_for + vote_weight;
        } else {
            proposal.votes_against = proposal.votes_against + vote_weight;
        }
    }

    // Function to get the voting results (for simplicity)
    public fun get_proposal_votes(proposal: &Proposal): (u64, u64) {
        (proposal.votes_for, proposal.votes_against)
    }
}
