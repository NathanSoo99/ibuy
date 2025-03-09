import React, { useState, useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';

import FreeQuantity from './FreeQuantity';
import DropdownQuantity from './DropdownQuantity';

import { UserContext } from "../../UserContext"

import "./PageComponentsCSS/CartItem.css"

const CartItem = ({ id, quantity, quantitySetter, onDelete, increaseSubtotal }) => {
    const { token } = useContext(UserContext);

    const MaxDropdown = 10;
    const Extra = "10+";
    const ToggleText = "Save";

    const [quantityToggle, setQuantityToggle] = useState(false);
    const [seriesArray, setSeriesArray] = useState([]);

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
            // Dropdown Quantity Selector Setup
            // Display up to Maximum Stock up to 10, Otherwise Include Field for 10+
            const dropdownLength = json.stock > MaxDropdown ? MaxDropdown - 1 : json.stock;
            const tempArray = Array(dropdownLength).fill(1).map((v, index) => index + v);
            if (json.stock > MaxDropdown) {
                tempArray.push(Extra);
            }
            if (quantity > MaxDropdown) {
                tempArray.push(quantity);
            }
            setSeriesArray(tempArray);
        }));

    }, [])

    

    // Dropdown Menu Quantity Selector Handler Update for Frontend and Backend
    const changeHandler = (value) => {
        // Remove Unnecessary Elements from Dropdown Quantity Selector
        const newSeriesArray = seriesArray.filter(
            value => (
                (
                    (value > 0) &&
                    (details.stock === MaxDropdown ? value <= MaxDropdown : value < MaxDropdown)
                )
                || (value === Extra)
            )
        );
        setSeriesArray(newSeriesArray);

        // Toggle Input State if Necessary Otherwise Only Set Quantity
        if (value === "10+") {
            quantitySetter(10, details.price);
            setQuantityToggle(!quantityToggle);
        } else {
            quantitySetter(value, details.price);
            console.log(id);
            fetch("http://localhost:8181/cart",{
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    "token": token,
                    "itemId": id,
                    "quantity": value
                })
            });
        }
    }

    // Toggle Free Quantity to Dropdown Quantity Save Free Quantity Value to Backend
    const quantitySave = () => {
        // Allow Custom Quantity to be Displayed by Dropdown Quantity Selector
        const newSeriesArray = [...seriesArray];
        newSeriesArray.push(quantity);
        setSeriesArray(newSeriesArray);

        // Change Input State
        setQuantityToggle(!quantityToggle);

        fetch("http://localhost:8181/cart",{
            method: 'PUT',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "token": token,
                "itemId": id,
                "quantity": quantity
            })
        });
    }

    return (
        <div className="cart-item">
            <Link to={"/product/" + id} className="item-name">{ details !== null ? details.name : null }</Link>
            <img src={ details !== null ? details.image : null } alt="product image" className="product-image"/>
            <div className="item-price">{ "$" + (details !== null ? details.price : null) }</div>
            <div className="quantity-selector">
                <span className="quantity-label">qty:</span>
                {quantityToggle ?
                    <FreeQuantity
                        name="qty"
                        quantity={ quantity }
                        setQuantity={ quantitySetter }
                        quantitySave={ quantitySave }
                        toggleText={ ToggleText }
                        price={ details.price }
                    />
                :
                    <DropdownQuantity
                        quantity={ quantity }
                        changeHandler={ changeHandler }
                        seriesArray={ seriesArray }
                    />
                }
                <button onClick={() => onDelete(id, details.price, quantity)} className="delete-button">delete</button>
            </div>
            
        </div>
    );
}

export default CartItem;
