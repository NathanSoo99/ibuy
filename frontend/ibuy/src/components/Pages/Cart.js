import { React, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';

import CartItem from './PageComponents/CartItem';

import { UserContext } from "../UserContext";

import "./PagesCSS/Cart.css"
import "./PageComponents/PageComponentsCSS/General.css"

function ShoppingCart() {
    const history = useHistory();
    const { token } = useContext(UserContext);

    const [cart, setCart] = useState([]);
    const [cartEmpty, setCartEmpty] = useState(false); 
    const [subtotal, setSubtotal] = useState(0);

    let tempSubtotal = 0;

    // Get View of Shopping Cart from Backend
    useEffect(() => {
        var url = new URL(
            "http://localhost:8181/cart"),
            params = { "token": token }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }).then(
            response => response.json().then(json => {
                if (token !== null && response.status === 200 && json !== "something wrong when show product" && json != null) {
                    setCart(json);
                    checkCartEmpty(json);
                }
            })
        );
    }, [token]);

    // Check if Cart is empty
    const checkCartEmpty = (json) => {
        if (json.length === 0) {
            setCartEmpty(true);
        } else {
            setCartEmpty(false);
        }
    }

    // Increase Subtotal By Amount
    const increaseSubtotal = (amount) => {
        tempSubtotal += amount
        setSubtotal(tempSubtotal);
    }

    // Update Frontend Quantity State of Cart Item
    const updateQuantity = index => (newQuantity, price) => {
        let newCart = [...cart];
        setSubtotal(subtotal + price * (newQuantity - newCart[index].quantity));
        newCart[index].quantity = newQuantity;
        setCart(newCart);
    }

    /**
     * Delete cart item from both frontend and backend
     * @param id - Product unique id number
     */
    const removeItem = (id, price, quantity) => {
        let newCart = [...cart];
        setSubtotal(subtotal -  price * quantity);
        newCart = newCart.filter((item) => item.productId !== id);
        checkCartEmpty(newCart);
        setCart(newCart);

        var url = new URL(
            "http://localhost:8181/cart"),
            params = {
                "token": token,
                "productId": id
            }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json"
            }
        });
    }

    // Change Page to Checkout
    const toCheckout = () => {
        if (!cartEmpty) {
            history.push("/checkout");
        }
    }

    return (
        <div className="cartPage">
            <h1 className="title">Welcome to your Shopping Cart!</h1>
            <div className="cart-panel">{cartEmpty ?
                "Cart Empty"
            :
                cart.map((item, index) => (
                    <CartItem
                        id={ item.productId }
                        quantity={ item.quantity }
                        quantitySetter={ updateQuantity(index) }
                        onDelete={ removeItem }
                        increaseSubtotal={ increaseSubtotal }
                    />
                ))
            }</div>
            <div className="checkout-panel">
                <div className="subtotal">{"Subtotal: $" + subtotal}</div>
                <button onClick={() => toCheckout()} className="functional-button" id="checkout-link">Proceed to Checkout</button>
            </div>

        </div>
    );
}

export default ShoppingCart;