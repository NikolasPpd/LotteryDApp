import React from "react";
import ItemCard from "../ItemCard"; // Make sure to import your ItemCard component
import carImage from "../../images/car.jpg";
import phoneImage from "../../images/phone.jpg";
import ps5Image from "../../images/ps5.jpg";

const ItemCardGroup = ({ item0Bids, item1Bids, item2Bids }) => {
    const itemsData = [
        {
            itemName: "Car",
            imageUrl: carImage,
            bids: item0Bids,
        },
        {
            itemName: "Phone",
            imageUrl: phoneImage,
            bids: item1Bids,
        },
        {
            itemName: "PS5",
            imageUrl: ps5Image,
            bids: item2Bids,
        },
    ];

    return (
        <div className='container mt-5'>
            <div className='row justify-content-around'>
                {itemsData.map((item, index) => (
                    <div className='col-md-4 mb-4' key={index}>
                        <ItemCard
                            itemName={item.itemName}
                            imageUrl={item.imageUrl}
                            bids={item.bids}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemCardGroup;
