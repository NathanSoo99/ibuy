import React, { useState } from 'react';

import "./PageComponentsCSS/CheckoutComponents.css"
import "./PageComponentsCSS/General.css";

const AddressItem = ( { details, selectAddress, editAddress, deleteAddress } ) => {
    const [editState, setEditState] = useState(false);

    const [nameState, setNameState] = useState(details.full_name);
    const [phoneState, setPhoneState] = useState(details.number);
    const [countryState, setCountryState] = useState(details.country);
    const [addressState, setAddressState] = useState(details.address);
    const [suburbState, setSuburbState] = useState(details.suburb);
    const [postCodeState, setPostCodeState] = useState(details.postcode);
    const [stateState, setStateState] = useState(details.state);
    // const [defaultState, setDefaultState] = useState(details.)

    const submitAddress = (e) => {
        e.preventDefault();
        editAddress(
            nameState,
            phoneState,
            addressState,
            postCodeState,
            countryState,
            stateState,
            suburbState
        );
        setEditState(!editState);
    }

    return (
        <div className="checkout-modal-item">
            {editState ?
                <form onSubmit={(e) => submitAddress(e)} className="checkout-edit-form">
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
                <div>
                    <h3>{details.full_name}</h3>
                    <div>{details.address}</div>
                    <div>{details.suburb}</div>
                    <div>{details.postcode}</div>
                    <div>{details.state}</div>
                    <div>{details.country}</div>
                    <div>{details.number}</div>
                    <button onClick={() => setEditState(!editState)} className="functional-button">Edit</button>
                    <button onClick={() => deleteAddress()} className="functional-button">Delete</button>
                    <button onClick={() => selectAddress()} className="functional-button">Select</button>
                </div>
            }
        </div>
    );
}

export default AddressItem;
