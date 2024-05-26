module airdnb::airdnb {
    use sui::package;
    use sui::display;
    use sui::event;
    use std::string::{utf8, String};

    // Structure representing a Booking NFT
    public struct BookingNFT has key, store {
        id: UID,
        room: String,
        nights: u64,
        check_out_time_ms: u64,
        recipient: address,
    }

    // Structure representing the admin capability
    public struct AdminCap has key {
        id: UID,
    }

    // Structure representing a Proposal
    public struct Proposal has key, store {
        id: UID,
        title: String,
        description: String,
        votes_for: u64,
        votes_against: u64,
        voters: vector<ID>,
    }

    // Witness
    public struct AIRDNB has drop {}

    // Event: BookingNFTMinted
    public struct BookingNFTMinted has drop, copy {
        id: ID,
        room: String,
        nights: u64,
        check_out_time_ms: u64,
        recipient: address,
        minter: address,
    }

    // Event: ProposalCreated
    public struct ProposalCreated has drop, copy {
        id: ID,
        title: String,
        description: String,
        creator: address,
    }

    // Event: VoteCast
    public struct VoteCast has drop, copy {
        proposal_id: ID,
        voter: address,
        vote_for: bool,
        vote_weight: u64,
    }

    // Event: ProposalUpdated
    public struct ProposalUpdated has drop, copy {
        id: ID,
        votes_for: u64,
        votes_against: u64,
    }

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
    public fun mint(_: &AdminCap, room: vector<u8>, recipient: address, nights: u64, check_out_time_ms: u64, ctx: &mut TxContext): BookingNFT {
        let nft = BookingNFT {
            id: object::new(ctx),
            room: utf8(room),
            nights,
            check_out_time_ms,
            recipient,
        };
        event::emit(BookingNFTMinted {
            id: object::id(&nft),
            room: nft.room,
            nights: nft.nights,
            check_out_time_ms: nft.check_out_time_ms,
            recipient,
            minter: tx_context::sender(ctx),
        });
        nft
    }

    // Function to create a proposal
    public entry fun create_proposal(_: &BookingNFT, title: vector<u8>, description: vector<u8>, ctx: &mut TxContext) {
        let proposal = Proposal {
            id: object::new(ctx),
            title: utf8(title),
            description: utf8(description),
            votes_for: 0,
            votes_against: 0,
            voters: vector::empty(),
        };
        event::emit(ProposalCreated {
            id: object::id(&proposal),
            title: proposal.title,
            description: proposal.description,
            creator: tx_context::sender(ctx),
        });
        transfer::transfer(proposal, tx_context::sender(ctx));
    }

    // Helper function to calculate remaining nights
    public fun remaining_nights(nft: &BookingNFT, current_time_ms: u64): u64 {
        if (current_time_ms < nft.check_out_time_ms) {
            (nft.check_out_time_ms - current_time_ms) / 86400000 // Convert milliseconds to days
        } else {
            0
        }
    }

    // Function to vote on a proposal
    public entry fun vote_on_proposal(proposal: &mut Proposal, nft: &mut BookingNFT, vote_for: bool, ctx: &mut TxContext) {
        assert!(!vector::contains(&proposal.voters, &object::id(nft)), 0);

        let current_time_ms = tx_context::epoch_timestamp_ms(ctx);
        let remaining = remaining_nights(nft, current_time_ms);
        let vote_weight = if (remaining < nft.nights) { remaining } else { nft.nights };
        // Record the vote
        if (vote_for) {
            proposal.votes_for = proposal.votes_for + vote_weight;
        } else {
            proposal.votes_against = proposal.votes_against + vote_weight;
        };

        vector::push_back(&mut proposal.voters, object::id(nft));

        event::emit(VoteCast {
            proposal_id: object::id(proposal),
            voter: tx_context::sender(ctx),
            vote_for,
            vote_weight,
        });

        event::emit(ProposalUpdated {
            id: object::id(proposal),
            votes_for: proposal.votes_for,
            votes_against: proposal.votes_against,
        });
    }

    // Function to get the voting results (for simplicity)
    public fun get_proposal_votes(proposal: &Proposal): (u64, u64) {
        (proposal.votes_for, proposal.votes_against)
    }
}
