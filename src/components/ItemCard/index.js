import React from "react";
import "./styles.css";

const ItemCard = ({ itemName, imageUrl, bids }) => {
    const handleBidClick = () => {
        // TODO: Implement bidding
    };

    return (
        <div className='custom-card text-center'>
            <div className='custom-card-header'>
                <h5 className='custom-card-title'>{itemName}</h5>
            </div>
            <div className='custom-card-image-container'>
                <img
                    src={imageUrl}
                    className='custom-card-img'
                    alt={itemName}
                />
                <div className='custom-card-overlay'>
                    <button
                        className='btn btn-primary custom-bid-btn'
                        onClick={handleBidClick}
                    >
                        Bid
                    </button>
                    <span className='custom-bid-badge'>{bids}</span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
