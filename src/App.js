import React, { useState, useEffect, useRef } from "react";
// import web3 from "./web3";
import toast, { Toaster } from "react-hot-toast";
import lottery from "./lottery";
import ItemCardGroup from "./components/ItemCardGroup";
import InfoBlock from "./components/InfoBlock";
import "./App.css";

const App = () => {
    const [owner, setOwner] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    const [currentRaffle, setCurrentRaffle] = useState("");
    const eventListenersSet = useRef(false);
    const [item0Bids, setItem0Bids] = useState(0);
    const [item1Bids, setItem1Bids] = useState(0);
    const [item2Bids, setItem2Bids] = useState(0);
    const itemNames = ["Car", "Phone", "PS5"];

    useEffect(() => {
        const fetchOwner = async () => {
            const ownerAddress = await lottery.methods.beneficiary().call();
            setOwner(ownerAddress);
        };

        fetchOwner();
    }, []); // The empty array ensures this effect runs only once on mount

    useEffect(() => {
        const fetchCurrentRaffle = async () => {
            const raffleNumber = await lottery.methods.currentRaffle().call();
            setCurrentRaffle(raffleNumber.toString());
        };

        fetchCurrentRaffle();
    }, []);

    useEffect(() => {
        const fetchAccount = async () => {
            // Request account access if needed
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    setCurrentAccount(accounts[0]);
                } catch (error) {
                    console.error("Error accessing MetaMask accounts:", error);
                }

                // MetaMask account change event listener
                window.ethereum.on("accountsChanged", (accounts) => {
                    setCurrentAccount(accounts[0]);
                });
            } else {
                console.log(
                    "Ethereum object not found, you need to install MetaMask!"
                );
            }
        };

        fetchAccount();
    }, []);

    function setupEventListeners() {
        lottery.events.BidPlaced().on("data", async (data) => {
            handleBidCounts(data.returnValues);
            const address = data.returnValues.bidder;
            const shortAddress = `${address.slice(0, 6)}...${address.slice(
                -4
            )}`;
            const itemName = itemNames[Number(data.returnValues.itemId)];

            toast(`${shortAddress} just bid on ${itemName}!`, {
                icon: "💸",
            });
            // console.log(
            //     `New Bid: Bidder ${data.returnValues.bidder}, Item ID ${data.returnValues.itemId}, Raffle Number ${data.returnValues.raffleNumber}`
            // );
            console.log("BidPlaced event:", data);
            // toast.success("Bid placed!");
        });
    }

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

    useEffect(() => {
        if (!eventListenersSet.current) {
            eventListenersSet.current = true;

            async function getBidPlacedEvents() {
                // Fetch past events
                const pastEvents = await lottery.getPastEvents("BidPlaced", {
                    fromBlock: 0,
                    toBlock: "latest",
                    filter: {},
                });

                if (pastEvents.length) {
                    pastEvents.forEach((event) => {
                        // console.log("Adding past event to state:", event);
                        handleBidCounts(event.returnValues);
                    });
                    // for (const event of pastEvents) {
                    //     console.log(
                    //         `Past Bid: Bidder ${event.returnValues.bidder}, Item ID ${event.returnValues.itemId}, Raffle Number ${event.returnValues.raffleNumber}`
                    //     );
                    //     // console.log("Past Bid:", event);
                    // }
                } else {
                    console.log("No past BidPlaced events found");
                }
            }

            getBidPlacedEvents();

            setupEventListeners();
        }

        return () => {};
    }, []);

    return (
        <div>
            <Toaster position="bottom-right"/>

            <h1 className='title'>Lottery #{currentRaffle}</h1>
            <hr className='title-line' />

            <ItemCardGroup
                item0Bids={item0Bids}
                item1Bids={item1Bids}
                item2Bids={item2Bids}
            />

            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 d-flex justify-content-start'>
                        <InfoBlock
                            title='Current Account'
                            text={currentAccount}
                            colorCode='#caffbf'
                        />
                    </div>
                    <div className='col-md-6 d-flex justify-content-end'>
                        <InfoBlock
                            title='Contract Owner'
                            text={owner}
                            colorCode='#ffadad'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
