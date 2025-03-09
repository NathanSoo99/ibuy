import React from 'react';

import "./PageComponentsCSS/CheckoutComponents.css"
import "./PageComponentsCSS/General.css"

const CardItem = ( { details, selectCard, deleteCard } ) => {
    return (
        <div className="checkout-modal-item">
            <h3>{ details.name }</h3>
            <div>{ "Card Ending With " + details.card_suffix }</div>
            <div>{ "Expiring on " + details.expiry_date }</div>
            <button onClick={() => deleteCard()} className="functional-button">Delete</button>
            <button onClick={() => selectCard()} className="functional-button">Select</button>
        </div>
    );
}

export default CardItem;
