import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import useEthereumAccount from "./hooks/useEthereumAccount";
import web3 from "./web3";

const App = () => {
    const [error, setError] = useState("");
    const [lottery, setLottery] = useState(null);
    const { currentAccount, error: ethereumError } = useEthereumAccount();

    useEffect(() => {
        const init = async () => {
            if (!web3 && !ethereumError) {
                setError(
                    "MetaMask is not installed. Please install MetaMask to use this app."
                );
            } else if (ethereumError) {
                setError(ethereumError);
            } else {
                try {
                    const lotteryModule = await import("./lottery");
                    const lotteryInstance = lotteryModule.getLotteryContract();
                    setLottery(lotteryInstance);
                } catch (err) {
                    setError(
                        "Unable to initialize the contract. " + err.message
                    );
                }
            }
        };

        init();
    }, [ethereumError]);

    return (
        <div>
            {error ? (
                <ErrorPage message={error} />
            ) : (
                lottery && <HomePage currentAccount={currentAccount} />
            )}
        </div>
    );
};

export default App;
