import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import "./PageComponentsCSS/CartItem.css"

const CheckoutItem = ({ id, quantity, onDelete, quantitySetter, quantitySaver, increaseSubtotal }) => {
    const [editState, editSet] = useState(false);

    const [originalQuantity, setOriginalQuantity] = useState(quantity);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        var url = new URL(
            "http://localhost:8181/items/" + id),
            params = {"token": null}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        }).then(response => response.json().then(json => {
            setDetails({
                name: json.name,
                price: json.price,
                stock: json.stock,
                image: json.image
            });
            increaseSubtotal(json.price * quantity);
        }));
    }, [])

    // Toggle Edit and Push Quantity to Backend if Necessary
    const toggleEdit = () => {
        if ( editState === true ) {
            quantitySaver(originalQuantity, quantity, details.price);
            setOriginalQuantity(quantity);

        }
        
        editSet(!editState);
    }

    return (
        <div className="cart-item">
            <Link to={"/product/" + id} className="item-name">{ details !== null ? details.name : null }</Link>
            <img src={ details !== null ? details.image : null } alt="product image" className="product-image"/>
            <div className="item-price">{ "$" + (details !== null ? details.price : null) }</div>
            <div className="quantity-selector">
                <label className="quantity-label">{ "qty:" }</label>
                <span>
                    {
                        editState ?
                            <input
                                type="number"
                                name="checkout-quantity-form"
                                value={ quantity }
                                min={ 0 }
                                onChange={ (e) => quantitySetter(e.target.value) }
                                className="free-quantity"
                            />
                        :
                            <span className="quantity-display">{quantity}</span>
                    }
                </span>
                <button onClick={ () => toggleEdit() } className="delete-button">{editState ? "Save" : "Edit"}</button>
                <button onClick={ () => onDelete(id) } className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default CheckoutItem;
