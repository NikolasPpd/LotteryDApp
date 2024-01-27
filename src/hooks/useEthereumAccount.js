import { useEffect, useState } from "react";
import Web3 from "web3";

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
                    // Convert to checksum address
                    const checksumAddress = Web3.utils.toChecksumAddress(
                        accounts[0]
                    );
                    setCurrentAccount(checksumAddress);
                    setError(""); // Clear any previous errors

                    // MetaMask account change event listener
                    window.ethereum.on("accountsChanged", (accounts) => {
                        if (accounts.length > 0) {
                            // Convert to checksum address
                            const updatedChecksumAddress =
                                Web3.utils.toChecksumAddress(accounts[0]);
                            setCurrentAccount(updatedChecksumAddress);
                        } else {
                            setCurrentAccount("");
                        }
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
