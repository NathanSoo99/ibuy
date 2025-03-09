import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router';

import CheckoutItem from './PageComponents/CheckoutItem'
import ModalWindow from './PageComponents/ModalWindow';
import AddressList from './PageComponents/AddressList';
import CardList from './PageComponents/CardList';

import { UserContext } from "../UserContext";

import "./PagesCSS/Checkout.css";
import "./PageComponents/PageComponentsCSS/General.css"

const Checkout = () => {
    const history = useHistory();
    const { token } = useContext(UserContext);

    const [hideDeliveryModal, setHideDeliveryModal] = useState(true);
    const [hideBillingModal, setHideBillingModal] = useState(true);
    const [hideCardModal, setHideCardModal] = useState(true);

    const [deliveryIndex, setDeliveryIndex] = useState(0);
    const [billingIndex, setBillingIndex] = useState(0);
    const [cardIndex, setCardIndex] = useState(0);

    const [useWallet, setUseWallet] = useState(false);
    const [subtotal, setSubtotal] = useState(0);

    const [cart, setCart] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);
    const [walletBalance, setWalletBalance] = useState("?");

    const [detailsCart, setDetailsCart] = useState([]);

    let tempSubtotal = 0;

    // Get View of Shopping Cart, Addresses and Cards from Backend
    useEffect(() => {
        if (token != null) {
            getCart();
            getAddresses();
            getCards();
            getWallet();
        }
    }, [token]);

    const getCart = () => {
        // Get Shopping Cart
        var url = new URL(
            "http://localhost:8181/cart"),
            params = {"token": token}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        })
        .then(
            response => response.json().then(json => {
                if (token != null && response.status === 200 && json !== "something wrong when show product" && json !== null) {
                    setCart(json);
                }
            })
        );
    }

    const getAddresses = () => {
        // Get Stored Addresses
        var url = new URL(
            "http://localhost:8181/user/addresses"),
            params = {"token": token}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        })
        .then(
            response => response.json().then(json => {
                if (token != null && response.status === 200) {
                    setAddresses(json);
                }
            })
        );
    }

    const getCards = () => {
        // Get Stored Cards
        var url = new URL(
            "http://localhost:8181/user/paymentmethods"),
            params = {"token": token}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        })
        .then(
            response => response.json().then(json => {
                if (token != null && response.status === 200) {
                    setCards(json);
                }
            })
        );
    }

    const getWallet = () => {
        // Get Wallet Credit
        var url = new URL(
            "http://localhost:8181/user/wallet"),
            params = {"token": token}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        })
        .then(
            response => response.json().then(json => {
                if (token != null && response.status === 200) {
                    setWalletBalance(json.balance);
                }
            })
        );
    }

    // Functions for Cart

    // Increase Subtotal By Amount
    const increaseSubtotal = (amount) => {
        tempSubtotal += amount
        setSubtotal(tempSubtotal);
    }

    /**
     * Update Cart Item Quantity in Frontend in real time while quantity is being edited
     * @param index - Frontend cart index
     * @param newQuantity - Updated Quantity
     */
    const updateQuantity = index => (newQuantity) => {
        let newCart = [...cart];
        newCart[index].quantity = newQuantity;
        setCart(newCart);
    }

    /**
     * Update Cart Item Quantity in Backend after save button is pressed
     * @param index - Frontend cart index
     */
    const saveQuantity = index => (oldQuantity, newQuantity, price) => {
        setSubtotal(subtotal + price * (newQuantity - oldQuantity));
        fetch("http://localhost:8181/cart",{
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "token": token,
                "itemId": cart[index].productId,
                "quantity": cart[index].quantity
            })
        }).then(response => {
            if (response.status === 200) {
            }
        });
    }

    /**
     * Delete Cart Item from Frontend and Backend after delete button is pressed
     * @param  id - Frontend cart index
     */
    const removeItem = (id, price, quantity) => {
        let newCart = [...cart];
        setSubtotal(subtotal -  price * quantity);
        newCart = newCart.filter((item) => item.productId !== id);
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

    // Functions for both addresses

    /**
     * Add new address to front and backend after saving new address form
     * @param fullName
     * @param phoneNumber 
     * @param address 
     * @param postCode 
     * @param country 
     * @param state 
     * @param suburb 
     */
    const newAddress = (fullName, phoneNumber, address, postCode, country, state, suburb) => {
        fetch("http://localhost:8181/user/addresses",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "token": token,
                "fullName": fullName,
                "phoneNumber": phoneNumber,
                "address": address,
                "postCode": postCode,
                "country": country,
                "state": state,
                "suburb": suburb,
                "postalDefault": false,
                "billingDefault": false
            })
        }).then(
            response => response.json().then(json => {
                if (response.status === 200) {
                    let newAddresses = [...addresses];
                    newAddresses.push({
                        id: json.id,
                        full_name: fullName,
                        number: phoneNumber,
                        address: address,
                        postcode: postCode,
                        country: country,
                        state: state,
                        suburb: suburb
                    });
                    setAddresses(newAddresses);
                }
            })
        );
    }

    /**
     * Edit address on backend and frontend 
     * @param index Frontend address index
     */
    const updateAddress = index => (fullName, phoneNumber, address, postCode, country, state, suburb) => {
        fetch("http://localhost:8181/user/addresses",{
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "token": token,
                "id": addresses[index].id,
                "fullName": fullName,
                "phoneNumber": phoneNumber,
                "address": address,
                "postCode": postCode,
                "country": country,
                "state": state,
                "suburb": suburb,
                "postalDefault": false,
                "billingDefault": false
            })
        }).then((response) => {
            if (response.status === 200) {
                let newAddresses = [...addresses];
                newAddresses[index].full_name = fullName;
                newAddresses[index].number = phoneNumber;
                newAddresses[index].address = address;
                newAddresses[index].postcode = postCode;
                newAddresses[index].country = country;
                newAddresses[index].state = state;
                newAddresses[index].suburb = suburb;
                setAddresses(newAddresses);
            }
        });
    }

    /**
     * Remove address from backend and frontend after delete button is clicked
     * @param index - Frontend Cart Index
     */
    const deleteAddress = index => () => {
        var url = new URL(
            "http://localhost:8181/user/addresses")
            /* params = {
                "token": token,
                "id": addresses[index].id
            } */
            // Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        
        fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            body:   JSON.stringify({
                "token": token,
                "id": addresses[index].id
            })
            /* headers: {
                Accept: "application/json"
            } */
        }).then((response) => {
            if (response.status === 200) {
                if (deliveryIndex === index || addresses.length - 1 <= deliveryIndex) {
                    setDeliveryIndex(0);
                }
                if (billingIndex === index || addresses.length - 1 <= billingIndex) {
                    setBillingIndex(0);
                }
                let newAddresses = [...addresses];
                newAddresses.splice(index, 1);
                setAddresses(newAddresses);
            }
        });
    }

    // Functions for delivery address

    /**
     * Update the currently selected deliver address
     * @param index - the index of the address to be selected
     */
    const selectDeliveryAddress = (index) => () => {
        setDeliveryIndex(index);
        setHideDeliveryModal(!hideDeliveryModal);
    }

    // Functions for billing address
    /**
     * Update the currently selected deliver address
     * @param index - the index of the address to be selected
     */
    const selectBillingAddress = (index) => () => {
        setBillingIndex(index);
        setHideBillingModal(!hideBillingModal);
    }

    // Functions for credit cards
    
    /**
     * Add New Card to Backend and Frontend
     * @param cardNumber 
     * @param expiryDate 
     * @param name 
     * @param cvv 
     */
    const newCard = (cardNumber, expiryDate, name, cvc) => {
        fetch("http://localhost:8181/user/paymentmethods",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "token": token,
                "cardNumber": cardNumber,
                "expiryDate": expiryDate,
                "name": name,
                "cvc": cvc
            })
        }).then(
            response => response.json().then(json => {
                if (response.status === 200) {
                    let newCards = [...cards];
                    newCards.push({
                        id: json.id,
                        card_suffix: cardNumber,
                        expiry_date: expiryDate,
                        name: name
                    });
                    setCards(newCards);
                }
            })
        );
    }

    /**
     * Delete Saved Card from Backend and Frontend
     * @param index - card frontend index
     */
    const deleteCard = (index) => () => {
        var url = new URL(
            "http://localhost:8181/user/paymentmethods")
            /* params = {
                "token": token,
                "id": cards[index].id
            } */
            //Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        
        fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "token": token,
                "id": cards[index].id
            })
            /* headers: {
                Accept: "application/json"
            } */
        }).then((response) => {
            if (response.status === 200) {
                if (cardIndex === index || cards.length - 1 <= cardIndex) {
                    setCardIndex(0);
                }
                let newCards = [...cards];
                newCards.splice(index, 1);
                setCards(newCards);
            }
        });
    }

    /**
     * Select Card
     * @param index - card frontend index
     */
    const selectCard = (index) => () => {
        setCardIndex(index);
        setHideCardModal(!hideCardModal);
    }

    const placeOrder = () => {
        if (cart.length > 0 && cards.length > 0 && addresses.length > 0 && (!useWallet || walletBalance > subtotal)) {
            fetch("http://localhost:8181/orders",{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    "token": token,
                    "billingAddressId": addresses[billingIndex].id,
                    "deliveryAddressId": addresses[deliveryIndex].id,
                    "useWallet": useWallet,
                    "cardId": cards[cardIndex].id,
                    "cvv": 123
                })
            }).then(response => {
                if (response.status === 200) {
                    history.push("/ordersuccess");
                }
            })
        }
    }

    return (
        <div className="checkoutPage">
            <h1 className="checkout-page-label">Checkout</h1>

            <div className="cart-window">
                <h2>Items</h2>
                <div>{ cart.map((item, index) => (
                    <CheckoutItem
                        id={ item.productId }
                        quantity={ item.quantity }
                        onDelete={ removeItem }
                        quantitySetter={ updateQuantity(index) }
                        quantitySaver={ saveQuantity(index) }
                        increaseSubtotal={ increaseSubtotal }
                    />
                ))}</div>
            </div>

            <div className="delivery-window">
                <h2>Delivery Address</h2>
                <div>{addresses.length > 0 ?
                    <>
                        <div>{ addresses[deliveryIndex].full_name }</div>
                        <div>{ addresses[deliveryIndex].address }</div>
                        <div>{ addresses[deliveryIndex].suburb }</div>
                        <div>{ addresses[deliveryIndex].postcode }</div>
                        <div>{ addresses[deliveryIndex].state }</div>
                        <div>{ addresses[deliveryIndex].country }</div>
                        <div>{ addresses[deliveryIndex].number }</div>
                    </>
                :
                    <></>
                }</div>

                <ModalWindow
                    hidden={ hideDeliveryModal }
                    toggle={ setHideDeliveryModal }
                    Subcomponent={ AddressList }
                    subcomponentProps={{
                        addresses: addresses,
                        selectAddress: selectDeliveryAddress,
                        addAddress: newAddress,
                        editAddress: updateAddress,
                        deleteAddress: deleteAddress
                    }}
                />
                <button onClick={() => setHideDeliveryModal(!hideDeliveryModal)} className="functional-button">{addresses.length > 0 ?
                    "Change Delivery Address"
                :
                    "Add Delivery Address"
                }</button>
            </div>

            <div className="payment-window">
                <h2>Payment Details</h2>
                <label for="payment-type">Payment Type</label>
                <select
                    name="payment-type"
                    value={ useWallet }
                    onChange={() => setUseWallet(!useWallet) }
                    className="payment-selector"
                >
                    <option value={ false }>Credit/Debit Card</option>
                    <option value={ true }>Ibuy Credits</option>
                </select>
                <div>{useWallet ?
                    <>{"You have $" + walletBalance + " store credit remaining"}</>
                :
                    <>
                        <div>{cards.length > 0 ?
                            <>
                                <div>{ cards[cardIndex].name }</div>
                                <div>{ "Card Ending With " + cards[cardIndex].card_suffix }</div>
                                <div>{ "Expiring " + cards[cardIndex].expiry_date }</div>
                            </>
                        :
                            <></>
                        }</div>
                        <ModalWindow
                            hidden={ hideCardModal }
                            toggle={ setHideCardModal }
                            Subcomponent={ CardList }
                            subcomponentProps={{
                                cards: cards,
                                selectCard: selectCard,
                                addCard: newCard,
                                deleteCard: deleteCard
                            }}
                        />
                        <button onClick={() => setHideCardModal(!hideCardModal)} className="functional-button">{cards.length > 0 ?
                            "Use Another Credit Card"
                        :
                            "Add Credit Card"
                        }</button>
                    </>
                }</div>

            </div>

            <div className="billing-window">
                <h2>Billing Address</h2>
                <div>{addresses.length > 0 ?
                    <>
                        <div>{ addresses[billingIndex].full_name }</div>
                        <div>{ addresses[billingIndex].address }</div>
                        <div>{ addresses[billingIndex].suburb }</div>
                        <div>{ addresses[billingIndex].postcode }</div>
                        <div>{ addresses[billingIndex].state }</div>
                        <div>{ addresses[billingIndex].country }</div>
                        <div>{ addresses[billingIndex].number }</div>
                    </>
                :
                    <></>
                }</div>

                <ModalWindow
                    hidden={ hideBillingModal }
                    toggle={ setHideBillingModal }
                    Subcomponent={ AddressList }
                    subcomponentProps={{
                        addresses: addresses,
                        selectAddress: selectBillingAddress,
                        addAddress: newAddress,
                        editAddress: updateAddress,
                        deleteAddress: deleteAddress
                    }}
                />
                <button onClick={() => setHideBillingModal(!hideBillingModal)} className="functional-button">{addresses.length > 0 ?
                    "Change Billing Address"
                :
                    "Add Billing Address"
                }</button>
            </div>
            
            <div className="order-panel">
                <h2>Order Details</h2>
                <div className="subtotal">{"Total: $" + subtotal}</div>
                <button onClick={() => placeOrder()} className="functional-button">Place Order</button>
            </div>
            
        </div>
    );
}

export default Checkout;