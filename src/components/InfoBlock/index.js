import React from "react";
import "./styles.css";

const InfoBlock = ({ title, text, colorCode = "#f0eaff" }) => {
    const textStyle = {
        backgroundColor: colorCode,
    };

    return (
        <div className='info-block'>
            <h3 className='info-title'>{title}</h3>
            <p className='info-text' style={textStyle}>
                {text}
            </p>
        </div>
    );
};

export default InfoBlock;
