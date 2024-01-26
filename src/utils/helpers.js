import { toast } from "react-hot-toast";

export function concatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function handleLotteryTransaction(transactionCallback) {
    try {
        // Execute the passed lottery method call
        await transactionCallback();
    } catch (error) {
        if (error.message.includes("User denied transaction signature")) {
            toast.error("You cancelled the transaction.", {
                duration: 3500,
            });
        } else if (error.message.includes(`must pass "address" validation`)) {
            toast.error("You must enter a valid Ethereum address.", {
                duration: 3500,
            });
        } else {
            toast.error("Something went wrong. Please try again.", {
                duration: 3500,
            });
            console.error(error);
        }
    }
}
