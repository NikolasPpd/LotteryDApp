import React, { useState, useEffect } from "react";
import { checkContractExists } from "./lottery";
import HomePage from "./pages/HomePage";

const App = () => {
    const [error, setError] = useState("");

    useEffect(() => {
        const init = async () => {
            const exists = await checkContractExists();
            if (!exists) {
                setError(
                    "The contract does not exist at the specified address."
                );
            }
        };

        init();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <HomePage />
        </div>
    );
};

export default App;
