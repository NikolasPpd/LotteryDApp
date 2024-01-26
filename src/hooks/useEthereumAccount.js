import { useEffect, useState } from "react";

const useEthereumAccount = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAccount = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    setCurrentAccount(accounts[0]);
                    setError(""); // Clear any previous errors

                    // MetaMask account change event listener
                    window.ethereum.on("accountsChanged", (accounts) => {
                        setCurrentAccount(accounts[0] || "");
                    });
                } catch (error) {
                    setError("MetaMask connection denied.");
                }
            } else {
                setError(
                    "MetaMask is not installed. Please install MetaMask to use this app."
                );
            }
        };

        fetchAccount();
    }, []);

    return { currentAccount, error };
};

export default useEthereumAccount;
