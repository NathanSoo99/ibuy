import React from 'react';

import "./PageComponentsCSS/General.css"

const FreeQuantity = ( { quantity, setQuantity, quantitySave, toggleText, price } ) => {
    return (
        <form name="qty"  className="free-quantity-form" onSubmit={e => {
            e.preventDefault();
            quantitySave();
        }}>
            <input onChange={e => setQuantity(e.target.value, price)} value={quantity} className="free-quantity" type="number"/>
            <input value={toggleText} type="submit" className="functional-button" id="save-button"/>
        </form>
    )
}

export default FreeQuantity;