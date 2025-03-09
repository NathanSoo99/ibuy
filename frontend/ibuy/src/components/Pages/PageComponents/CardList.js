import React, { useState } from 'react';

import CardItem from './CardItem';

import "./PageComponentsCSS/CheckoutComponents.css"
import "./PageComponentsCSS/General.css";

const CardList = ( { props } ) => {
    const [editState, setEditState] = useState(props.cards.length > 0 ? false : true);

    const [nameState, setNameState] = useState("");
    const [cardNumberState, setCardNumberState] = useState("");
    const [expiryState, setExpiryState] = useState("");
    const [cvvState, setCvvState] = useState("");

    const submitCard = (e) => {
        e.preventDefault();
        props.addCard(
            cardNumberState,
            expiryState,
            nameState,
            cvvState
        );
        setNameState("");
        setCardNumberState("");
        setExpiryState("");
        setCvvState("");
        setEditState(!editState);
    }

    return (
        <div>
            <div>{props.cards.map((item, index) => <CardItem
                details={ item }
                selectCard={ props.selectCard(index) }
                deleteCard={ props.deleteCard(index) }
            />)}</div>
            <div>{editState ?
                <form onSubmit={ (e) => submitCard(e) } className="checkout-edit-form">
                    <label for="card holder">Name on Card</label>
                    <input
                        type="text"
                        required="required"
                        onChange={(e) => setNameState(e.target.value)}
                        name="card holder"
                        placeholder="e.g. John Smith"
                        className="details-input"
                    />
                    <label for="card number">Card Number</label>
                    <input
                        type="text"
                        required="required"
                        pattern="[0-9]{16}"
                        onChange={(e) => setCardNumberState(e.target.value)}
                        name="card number"
                        placeholder="XXXXXXXXXXXXXXXX"
                        className="details-input"
                    />
                    <label for="expiry date">Expiry Date</label>
                    <input
                        type="text"
                        required="required"
                        pattern="[0-9]{2}[/][0-9]{2}"
                        onChange={(e) => setExpiryState(e.target.value)}
                        name="expiry date"
                        placeholder="mm/yy"
                        className="details-input"
                    />
                    <label for="cvv">cvv</label>
                    <input
                        type="text"
                        onChange={(e) => setCvvState(e.target.value)}
                        required="required"
                        pattern="[0-9]{3}"
                        name="cvv"
                        placeholder="cvv"
                        className="details-input"
                    />
                    <input type="submit" value="confirm" className="functional-button" id="edit-save"/>
                </form>
            :
                <button onClick={() => setEditState(!editState)}>Add New Card</button>
            }</div>
        </div>
    );
}



export default CardList;
