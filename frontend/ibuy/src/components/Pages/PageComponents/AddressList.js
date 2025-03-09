import React, { useState } from 'react';

import AddressItem from './AddressItem';

import "./PageComponentsCSS/CheckoutComponents.css";
import "./PageComponentsCSS/General.css";

const AddressList = ( { props } ) => {
    const [editState, setEditState] = useState(props.addresses.length > 0 ? false : true);

    const [nameState, setNameState] = useState("");
    const [phoneState, setPhoneState] = useState("");
    const [countryState, setCountryState] = useState("");
    const [addressState, setAddressState] = useState("");
    const [suburbState, setSuburbState] = useState("");
    const [postCodeState, setPostCodeState] = useState("");
    const [stateState, setStateState] = useState("");

    const submitNewAddress = (e) => {
        e.preventDefault();
        props.addAddress(
            nameState,
            phoneState,
            addressState,
            postCodeState,
            countryState,
            stateState,
            suburbState
        )
        setNameState("");
        setPhoneState("");
        setCountryState("");
        setAddressState("");
        setSuburbState("");
        setPostCodeState("");
        setStateState("");
        setEditState(!editState);
    }

    return (
        <div>
            <div>{props.addresses.map((item, index) => <AddressItem
                details={ item }
                selectAddress={ props.selectAddress(index) }
                editAddress={ props.editAddress(index) }
                deleteAddress={ props.deleteAddress(index) }
            />)}</div>
            <div>{editState ?
                <form onSubmit={(e) => submitNewAddress(e)} className="checkout-edit-form">
                    <label for="fullName">Full Name</label>
                    <input
                        type="text"
                        required="required"
                        onChange={ e => setNameState(e.target.value) }
                        value={ nameState }
                        name="fullname"
                        placeholder="full name"
                        className="details-input"
                        id="checkout-input"
                    />
                    <label for="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        required="required"
                        pattern="^[0-9]*$"
                        onChange={ e => setPhoneState(e.target.value) }
                        value={ phoneState }
                        name="phoneNumber"
                        placeholder="phone number"
                        className="details-input"
                        id="checkout-input"
                    />
                    <label for="country">Country</label>
                    <input
                        type="text"
                        required="required"
                        onChange={ e => setCountryState(e.target.value) }
                        value={ countryState }
                        name="country"
                        placeholder="country"
                        className="details-input"
                        id="checkout-input"
                    />
                    <label for="address">Address</label>
                    <input
                        type="text"
                        required="required"
                        onChange={ e => setAddressState(e.target.value) }
                        value={ addressState }
                        name="address"
                        placeholder="address"
                        className="details-input"
                        id="checkout-input"
                    />
                    <label for="suburb">Suburb</label>
                    <input
                        type="text"
                        required="required"
                        onChange={ e => setSuburbState(e.target.value) }
                        value={ suburbState }
                        name="suburb"
                        placeholder="suburb"
                        className="details-input"
                        id="checkout-input"
                    />
                    <label for="postcode">Post Code</label>
                    <input
                        type="text"
                        required="required"
                        pattern="[0-9]{4}"
                        onChange={ e => setPostCodeState(e.target.value) }
                        value={ postCodeState }
                        name="postcode"
                        placeholder="post code"
                        className="details-input"
                        id="checkout-input"
                    />
                    <label for="state">State</label>
                    <input
                        type="text"
                        required="required"
                        onChange={ e => setStateState(e.target.value) }
                        value={ stateState }
                        name="state"
                        placeholder="state"
                        className="details-input"
                        id="checkout-input"
                    />
                    <input type="submit" value="Save" className="functional-button" id="edit-save"/>
                </form>
            :
                <button onClick={() => setEditState(!editState)} className="functional-button">Add New Address</button>
            }</div>
        </div>
    );
}

export default AddressList;
