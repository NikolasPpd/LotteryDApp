const getInfoBlocksConfig = ({
    currentAccount,
    owner,
    contractBalance,
    web3,
}) => [
    {
        title: "Current Account",
        text: currentAccount,
        colorCode: "#bff6ff",
    },
    {
        title: "Contract Owner",
        text: owner,
        colorCode: "#ffadad",
    },
    {
        title: "Contract Balance",
        text: "ETH " + web3.utils.fromWei(contractBalance, "ether"),
        colorCode: "#caffbf",
    },
];

export default getInfoBlocksConfig;
