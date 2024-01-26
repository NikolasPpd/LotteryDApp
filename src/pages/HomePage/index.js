import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import web3 from "../../web3";
import TransferOwnershipModal from "../../components/TransferOwnershipModal";
import ItemCardGroup from "../../components/ItemCardGroup";
import InfoBlock from "../../components/InfoBlock";
import getInfoBlocksConfig from "../../config/infoBlockConfig";
import * as BlockchainService from "../../services/blockchainService";
import useEventListeners from "../../hooks/useEventListeners";
import { concatAddress, handleLotteryTransaction } from "../../utils/helpers";
import "./styles.css";

const HomePage = ({ currentAccount }) => {
    const [owner, setOwner] = useState("");
    const [lottery, setLottery] = useState(null);
    const additionalOwner = "0x153dfef4355E823dCB0FCc76Efe942BefCa86477";
    const [isOwner, setIsOwner] = useState(false);
    const [contractBalance, setContractBalance] = useState(0); // In wei
    const [currentRaffle, setCurrentRaffle] = useState(0n);
    const [currentStage, setCurrentStage] = useState(-1n); // 0: Bid, 1: Done
    const [item0Bids, setItem0Bids] = useState(0);
    const [item1Bids, setItem1Bids] = useState(0);
    const [item2Bids, setItem2Bids] = useState(0);
    const itemNames = ["Car", "Phone", "PS5"];
    const itemEmojis = ["🚗", "📱", "🎮"];
    const currentAccountRef = useRef(currentAccount);

    useEffect(() => {
        const loadLotteryContract = async () => {
            try {
                const { getLotteryContract } = await import("../../lottery");
                const lotteryInstance = getLotteryContract();
                setLottery(lotteryInstance);
            } catch (error) {
                console.error("Error loading lottery contract:", error);
            }
        };

        loadLotteryContract();
    }, []);

    useEffect(() => {
        function checkIsOwner() {
            const currAcc = currentAccountRef.current.toLowerCase();
            if (
                currAcc === owner.toLowerCase() ||
                currAcc === additionalOwner.toLowerCase()
            ) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        }

        currentAccountRef.current = currentAccount;
        checkIsOwner();
    }, [currentAccount]);

    useEffect(() => {
        const initializeOwner = async () => {
            const ownerAddress = await BlockchainService.fetchOwner();
            setOwner(ownerAddress);
        };

        initializeOwner();
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            setCurrentRaffle(await BlockchainService.fetchCurrentRaffle());
            setCurrentStage(await BlockchainService.fetchCurrentStage());
        };
        initializeData();
    }, []);

    useEffect(() => {
        const updateContractBalance = async () => {
            setContractBalance(await BlockchainService.fetchContractBalance());
        };

        updateContractBalance();
    }, [item0Bids, item1Bids, item2Bids, currentRaffle]);

    const handleBidCounts = (obj) => {
        const idIndex = Number(obj.itemId);
        switch (idIndex) {
            case 0:
                setItem0Bids((prevState) => prevState + 1);
                break;
            case 1:
                setItem1Bids((prevState) => prevState + 1);
                break;
            case 2:
                setItem2Bids((prevState) => prevState + 1);
                break;
            default:
                break;
        }
    };

    useEventListeners(
        currentAccount,
        handleBidCounts,
        itemNames,
        itemEmojis,
        concatAddress
    );

    function resetBidCounts() {
        setItem0Bids(0);
        setItem1Bids(0);
        setItem2Bids(0);
    }

    async function getBidPlacedEvents() {
        console.log("Current raffle in bid event listener is: ", currentRaffle);

        resetBidCounts();

        // Fetch past events
        const pastEvents = await lottery.getPastEvents("BidPlaced", {
            fromBlock: 0,
            toBlock: "latest",
            filter: { raffleNumber: currentRaffle },
        });

        if (pastEvents.length) {
            pastEvents.forEach((event) => {
                handleBidCounts(event.returnValues);
            });
        } else {
            console.log(
                "No past BidPlaced events found for the current raffle"
            );
        }
    }

    async function getWinnerEvents() {
        console.log("GETTING WINNER EVENTS");
        // If stage is 1, the winners have been revealed
        // but the next raffle hasn't started yet
        // Fetch winner reveal events from the current raffle
        let checkRaffle = currentRaffle;
        let word = "this";
        // If stage is 0, there might be winners from the previous raffle
        if (currentStage === 0n) {
            checkRaffle = currentRaffle - 1n;
            word = "the previous";
        }
        console.log("Latest winners from raffle: ", checkRaffle);

        if (checkRaffle >= 0) {
            const pastEvents = await lottery.getPastEvents("Winner", {
                fromBlock: 0,
                toBlock: "latest",
                filter: {
                    raffleNumber: checkRaffle,
                    winnerAddress: currentAccountRef.current,
                },
            });

            if (pastEvents.length) {
                pastEvents.forEach((event) => {
                    const address = event.returnValues.winnerAddress;
                    const itemName =
                        itemNames[Number(event.returnValues.itemId)];
                    if (
                        address.toLowerCase() ===
                        currentAccountRef.current.toLowerCase()
                    ) {
                        toast(`You won the ${itemName} in ${word} round!`, {
                            icon: itemEmojis[Number(event.returnValues.itemId)],
                            duration: 5000,
                        });
                    }
                });
            } else {
                toast(
                    `Unfortunately you didn't win anything in ${word} round. Better luck next time!`,
                    {
                        icon: "😭",
                        duration: 5000,
                    }
                );
            }
        } else {
            console.log("No previous raffle found.");
        }
    }

    useEffect(() => {
        if (currentRaffle > 0n) {
            getBidPlacedEvents();
        }
    }, [currentStage]);

    useEffect(() => {
        if (currentRaffle > 0n && !isOwner) {
            getWinnerEvents();
        }
    }, [currentStage, isOwner]);

    const bidClickHandler = async (itemId) => {
        await handleLotteryTransaction(async () => {
            await lottery.methods.buyEntry(itemId).send({
                from: currentAccount,
                value: 10000000000000000n,
            });
        });
    };

    const revealWinners = async () => {
        await handleLotteryTransaction(async () => {
            await lottery.methods.revealWinners().send({
                from: currentAccount,
            });
        });
    };

    const resetLottery = async () => {
        await handleLotteryTransaction(async () => {
            await lottery.methods.reset().send({
                from: currentAccount,
            });

            setCurrentRaffle(await BlockchainService.fetchCurrentRaffle());
            resetBidCounts();

            toast("A new lottery round just started!", {
                icon: "🍀",
            });
        });
    };

    const withdrawFunds = async () => {
        await handleLotteryTransaction(async () => {
            await lottery.methods.withdraw().send({
                from: currentAccount,
            });
        });
    };

    const transferOwnership = async (newOwner) => {
        await handleLotteryTransaction(async () => {
            await lottery.methods.transferOwnership(newOwner).send({
                from: currentAccount,
            });
            setOwner(newOwner);
            toast.success(`Transferred ownership to ${newOwner}!`, {
                duration: 3500,
            });
        });
    };

    const destroyContract = async () => {
        await handleLotteryTransaction(async () => {
            await lottery.methods.destroyContract().send({
                from: currentAccount,
            });
            setContractBalance(await BlockchainService.fetchContractBalance());
        });
    };

    const infoBlocks = getInfoBlocksConfig({
        currentAccount,
        owner,
        contractBalance,
        web3,
    });

    return (
        <div>
            <Toaster
                position='bottom-right'
                toastOptions={{
                    style: {
                        maxWidth: 700,
                    },
                }}
            />

            <h1 className='title'>Lottery #{currentRaffle.toString()}</h1>
            <hr className='title-line' />

            {/* Control buttons row (visible only to owner) */}
            {isOwner && (
                <div className='container mb-3'>
                    <div className='d-flex justify-content-center flex-wrap'>
                        <button
                            className='btn btn-primary custom-bid-btn m-1'
                            onClick={revealWinners}
                        >
                            Declare Winners
                        </button>
                        <button
                            className='btn btn-outline-primary custom-bid-btn m-1'
                            onClick={withdrawFunds}
                        >
                            Withdraw Funds
                        </button>

                        {/* Grouped Icon Buttons */}
                        <div className='d-flex'>
                            <button
                                className={`btn btn-primary custom-bid-btn m-1 ${
                                    currentStage !== 1n ? "disabled" : ""
                                }`}
                                title='Reset the lottery and start a new round'
                                onClick={resetLottery}
                            >
                                <GrPowerReset />
                            </button>
                            {owner !== "" && (
                                <TransferOwnershipModal
                                    owner={owner}
                                    isOwner={isOwner}
                                    transferOwnership={transferOwnership}
                                />
                            )}
                            <button
                                className='btn btn-danger custom-bid-btn m-1'
                                onClick={destroyContract}
                                title="Destroy the contract and withdraw all funds to the owner's account"
                            >
                                <FaRegTrashAlt />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ItemCardGroup
                item0Bids={item0Bids}
                item1Bids={item1Bids}
                item2Bids={item2Bids}
                bidClickHandler={bidClickHandler}
                isDisabled={isOwner || currentStage === 1n}
            />

            {/* InfoBlock elements */}
            <div className='container'>
                <div className='row'>
                    {infoBlocks.map((block, index) => (
                        <div
                            key={index}
                            className={`col-md-6 d-flex justify-content-start ${
                                index === 0 ? "justify-content-md-start" : ""
                            } ${
                                index === 1 ? "justify-content-md-end" : ""
                            } mb-3`}
                        >
                            <InfoBlock
                                title={block.title}
                                text={block.text}
                                colorCode={block.colorCode}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
