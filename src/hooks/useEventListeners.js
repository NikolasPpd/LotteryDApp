import { useEffect, useRef } from "react";
import { getLotteryContract } from "../lottery";
import { toast } from "react-hot-toast";

const useEventListeners = (
    currentAccount,
    handleBidCounts,
    itemNames,
    itemEmojis,
    concatAddress
) => {
    const currentAccountRef = useRef(currentAccount);

    useEffect(() => {
        currentAccountRef.current = currentAccount;
    }, [currentAccount]);

    useEffect(() => {
        let lottery;
        const setupEventListeners = async () => {
            try {
                lottery = getLotteryContract();

                // Event listener for players placing bids
                lottery.events.BidPlaced().on("data", async (data) => {
                    handleBidCounts(data.returnValues);
                    const address = data.returnValues.bidder;
                    if (
                        address.toLowerCase() ===
                        currentAccountRef.current.toLowerCase()
                    ) {
                        toast.success("Your bid was placed!");
                        return;
                    }
                    const itemName =
                        itemNames[Number(data.returnValues.itemId)];
                    toast(
                        `${concatAddress(address)} just bid on ${itemName}!`,
                        {
                            icon: "💸",
                        }
                    );
                });

                // Event listener for winners being revealed
                lottery.events.Winner().on("data", async (data) => {
                    const address = data.returnValues.winnerAddress;
                    const itemName =
                        itemNames[Number(data.returnValues.itemId)];
                    if (
                        address.toLowerCase() ===
                        currentAccountRef.current.toLowerCase()
                    ) {
                        toast.success(`You just won the ${itemName}!`, {
                            icon: itemEmojis[Number(data.returnValues.itemId)],
                            duration: 5000,
                        });
                    } else {
                        toast(
                            `Unfortunately you didn't win the ${itemName}. Better luck next time!`,
                            {
                                icon: itemEmojis[
                                    Number(data.returnValues.itemId)
                                ],
                                duration: 5000,
                            }
                        );
                    }
                });
            } catch (error) {
                console.error("Lottery contract not available:", error);
                return; // Exit if lottery contract is not available
            }
        };

        setupEventListeners();
    }, [handleBidCounts, itemNames, itemEmojis, concatAddress]);
};

export default useEventListeners;
