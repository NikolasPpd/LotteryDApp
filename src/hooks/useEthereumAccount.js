import { useEffect, useState } from "react";

const useEthereumAccount = () => {
    const [currentAccount, setCurrentAccount] = useState("");

    useEffect(() => {
        const fetchAccount = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    setCurrentAccount(accounts[0]);

                    // MetaMask account change event listener
                    window.ethereum.on("accountsChanged", (accounts) => {
                        setCurrentAccount(accounts[0]);
                    });
                } catch (error) {
                    console.error("Error accessing MetaMask accounts:", error);
                }
            } else {
                console.log(
                    "Ethereum object not found, you need to install MetaMask!"
                );
            }
        };

        fetchAccount();
    }, []);

    return currentAccount;
};

export default useEthereumAccount;
