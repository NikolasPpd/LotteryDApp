import web3 from "./web3";

const address = "0xC3C14870077F5F23A9752e1f68c7f2363298044E";

const abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "bidder",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "raffleNumber",
                type: "uint256",
            },
        ],
        name: "BidPlaced",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
            },
        ],
        name: "buyEntry",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "destroyContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "reset",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "revealWinners",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "winnerAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "raffleNumber",
                type: "uint256",
            },
        ],
        name: "Winner",
        type: "event",
    },
    {
        inputs: [],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "beneficiary",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "bidderIndex",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "bidders",
        outputs: [
            {
                internalType: "uint256",
                name: "personId",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "currentRaffle",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "items",
        outputs: [
            {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "stage",
        outputs: [
            {
                internalType: "enum LotteryDApp.Stage",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "winners",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "winnersRevealed",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

const getLotteryContract = () => {
    if (!web3) {
        throw new Error("No web3 instance available.");
    }
    return new web3.eth.Contract(abi, address);
};

export { getLotteryContract };
