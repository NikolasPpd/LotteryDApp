import React from "react";
import "./styles.css";

const ItemCard = ({
    itemId,
    itemName,
    imageUrl,
    bidCount,
    bidClickHandler,
    isDisabled,
}) => {
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
                        className={`btn btn-primary custom-bid-btn ${
                            isDisabled ? "disabled" : ""
                        }`}
                        onClick={() => bidClickHandler(itemId)}
                    >
                        Bid
                    </button>
                    <span className='custom-bid-badge'>{bidCount}</span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
