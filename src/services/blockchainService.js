import { getLotteryContract } from "../lottery";
import web3 from "../web3";

let lottery;

try {
    lottery = getLotteryContract();
} catch (err) {
    console.log(
        "MetaMask is not installed. Please install MetaMask to use this app."
    );
}

export const fetchOwner = async () => {
    const ownerAddress = await lottery.methods.beneficiary().call();
    return ownerAddress;
};

export const fetchCurrentRaffle = async () => {
    const raffleNumber = await lottery.methods.currentRaffle().call();
    return raffleNumber;
};

export const fetchContractBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    return balance;
};

export const fetchCurrentStage = async () => {
    const stage = await lottery.methods.stage().call();
    return stage;
};
