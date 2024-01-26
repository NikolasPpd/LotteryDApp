import React, { useState, useEffect } from "react";
import { TbTransfer } from "react-icons/tb";
import "./styles.css";

const TransferOwnershipModal = ({ owner, isOwner, transferOwnership }) => {
    const [newOwner, setNewOwner] = useState(owner);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden"; // Prevent scrolling
        } else {
            document.body.style.overflow = "unset"; // Enable scrolling
        }
    }, [showModal]);

    const handleTransferOwnership = () => {
        transferOwnership(newOwner);
        setShowModal(false);
    };

    const resetInputText = () => {
        setNewOwner(owner);
        setShowModal(false);
    };

    return (
        <>
            <button
                className={`btn btn-primary m-1 custom-bid-btn ${
                    !isOwner ? "disabled" : ""
                }`}
                onClick={() => setShowModal(true)}
                title="Transfer ownership to a different address"
            >
                <TbTransfer />
            </button>

            {showModal && (
                <div className='custom-modal-backdrop'>
                    <div
                        className='modal show custom-modal'
                        style={{ display: "block" }}
                        tabIndex='-1'
                    >
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className='modal-title'>
                                        Transfer Ownership
                                    </h5>
                                    <button
                                        type='button'
                                        className='btn-close'
                                        onClick={resetInputText}
                                    ></button>
                                </div>
                                <div className='modal-body'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={newOwner}
                                        onChange={(e) =>
                                            setNewOwner(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='modal-footer'>
                                    <button
                                        type='button'
                                        className='btn btn-secondary'
                                        onClick={resetInputText}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        onClick={handleTransferOwnership}
                                    >
                                        Transfer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransferOwnershipModal;
