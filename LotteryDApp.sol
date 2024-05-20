// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract LotteryDApp {
    // Structs
    enum Stage {Bid, Done}
    Stage public stage = Stage.Bid;

    struct Person {
        uint personId;
        address addr;
    }

    struct Item {
        uint itemId;
        uint[] itemTokens;
    }

    // Constants
    uint constant ITEM_COUNT = 3;
    address constant additionalOwner = 0x153dfef4355E823dCB0FCc76Efe942BefCa86477;

    // Variables
    mapping(address => uint) public bidderIndex; // Map a player's address to their index inside the 'bidders' array
    Person[] public bidders; // Players array
    Item[ITEM_COUNT] public items; // Items array, fixed size of 3
    address[] public winners; // Winners array
    bool public winnersRevealed = false; // Flag to allow revealWinners() to be called only once per raffle

    address public beneficiary; // Address of the club's president (owner of the smart contract)
    uint public currentRaffle = 0;

    // Events
    event BidPlaced(address indexed bidder, uint indexed itemId, uint indexed raffleNumber);
    event Winner(address indexed winnerAddress, uint indexed itemId, uint indexed raffleNumber);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == beneficiary || msg.sender == additionalOwner, "Only an owner can call this function.");
        _;
    }

    modifier inStage(Stage _stage) {
        require(stage == _stage, "Function cannot be called at this stage.");
        _;
    }

    modifier itemExists(uint _itemId) {
        require(_itemId < ITEM_COUNT, "Item does not exist.");
        _;
    }

    constructor() {
        beneficiary = msg.sender;
        stage = Stage.Bid;

        // Initialize items array with fixed item count
        for (uint i = 0; i < ITEM_COUNT; i++) {
            items[i] = Item({itemId: i, itemTokens: new uint[](0)});
        }
    }

    function buyEntry(uint itemId) public payable inStage(Stage.Bid) itemExists(itemId) {
        require(msg.value == 0.01 ether, "0.01 ETH required to buy an entry.");
        require(msg.sender != beneficiary && msg.sender != additionalOwner, "Owners cannot participate in the raffle.");
        
        uint bidderId;

        if (bidderIndex[msg.sender] == 0) {
            // Register the user if they are not already registered
            if (bidders.length == 0 || bidders[bidderIndex[msg.sender]].addr != msg.sender) {
                bidderId = bidders.length;
                bidders.push(Person({
                    personId: bidderId,
                    addr: msg.sender
                }));
                bidderIndex[msg.sender] = bidderId;
            }
        } else {
            // Use existing bidder ID
            bidderId = bidderIndex[msg.sender];
        }

        // Record the bid
        items[itemId].itemTokens.push(bidderId);

        // Emit the BidPlaced event
        emit BidPlaced(msg.sender, itemId, currentRaffle);
    }

    function revealWinners() public onlyOwner inStage(Stage.Bid) {
        require(!winnersRevealed, "Winners have already been revealed for the current raffle.");
        stage = Stage.Done;

        for (uint i = 0; i < ITEM_COUNT; i++) {
            uint[] memory indices = items[i].itemTokens;
            if (indices.length > 0 && winners.length <= i) {
                uint randomIndex = (block.timestamp % indices.length);
                uint bidderIdx = indices[randomIndex];
                address winnerAddress = bidders[bidderIdx].addr;
                winners.push(winnerAddress);

                // Emit the Winner event
                emit Winner(winnerAddress, i, currentRaffle);
            } else {
                winners.push(address(0));
            }
        }

        winnersRevealed = true;
    }

    function withdraw() public onlyOwner {
        address payable recipient;

        if (msg.sender == additionalOwner) {
            recipient = payable(additionalOwner);
        } else {
            recipient = payable(beneficiary);
        }

        recipient.transfer(address(this).balance);
    }

    function reset() public onlyOwner inStage(Stage.Done) {
        delete bidders;
        delete winners;

        for (uint i = 0; i < bidders.length; i++) {
            delete bidderIndex[bidders[i].addr];
        }

        for (uint i = 0; i < ITEM_COUNT; i++) {
            delete items[i].itemTokens;
        }

        winnersRevealed = false;
        currentRaffle++;
        stage = Stage.Bid;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address.");
        beneficiary = newOwner;
    }

    function destroyContract() public onlyOwner inStage(Stage.Done) {
        address payable recipient;

        if (msg.sender == additionalOwner) {
            recipient = payable(additionalOwner);
        } else {
            recipient = payable(beneficiary);
        }

        selfdestruct(recipient);
    }
}