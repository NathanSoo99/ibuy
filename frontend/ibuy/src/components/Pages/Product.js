import React, { useState, useContext, useEffect } from 'react';

import { useParams } from 'react-router';
import { Button } from 'react-bootstrap'
import DropdownQuantity from './PageComponents/DropdownQuantity';
import FreeQuantity from './PageComponents/FreeQuantity';
import EditProduct from './PageComponents/EditProduct';
import { UserContext } from "../UserContext";

import './PagesCSS/Product.css';

const Product = () => {
    const MaxDropdown = 10;
    const Extra = "10+";
    const ToggleText = "Back";

    const { token } = useContext(UserContext);
    const { id } = useParams();

    const [quantity, setQuantity] = useState(1);
    const [quantityToggle, setQuantityToggle] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [seriesArray, setSeriesArray] = useState([]);
    let renderTemplate;

    function editType(key) {

        switch (key) {
            case "EDIT PRODUCTS":
                setEditMode(true);
                setEditMode("EDIT PRODUCTS")
                break;
            default:
                setEditMode(false);
                break;
        }
    }

    const [data, setData] = useState({});

    // View Product Details from Backend
    useEffect(() => {
        var url = new URL(
            "http://localhost:8181/items/" + id),
            params = { "token": sessionStorage.getItem("token") }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "POST",
            headers: {
                credentials: 'include',
                Accept: "application/json"
            }
        })
            .then(
                response => response.json()
                    .then(json => {
                        console.log(json);
                        setData({
                            product_id: json.product_id,
                            name: json.name,
                            description: json.description,
                            price: json.price,
                            stock: json.stock,
                            categories: json.categories,
                            image: json.image,
                        });

                        // Dropdown Quantity Selector Setup
                        // Display up to Maximum Stock up to 10, Otherwise Include Field for 10+
                        const dropdownLength = json.stock > MaxDropdown ? MaxDropdown - 1 : json.stock;
                        const tempArray = Array(parseInt(dropdownLength)).fill(1).map((v, index) => index + v);
                        if (json.stock > MaxDropdown) {
                            tempArray.push(Extra);
                        }
                        setSeriesArray(tempArray);
                    })
            );
    }, [id]);


    // Dropdown Menu Quantity Selector Handler
    const changeHandler = (value) => {
        // Remove Unnecessary Elements from Dropdown Quantity Selector
        const newSeriesArray = seriesArray.filter(
            value => (
                (
                    (value > 0) &&
                    (data.stock === MaxDropdown ? value <= MaxDropdown : value < MaxDropdown)
                )
                || (value === Extra)
            )
        );
        setSeriesArray(newSeriesArray);

        // Toggle Input State if Necessary Otherwise Only Set Quantity
        if (value === "10+") {
            setQuantity(10);
            setQuantityToggle(!quantityToggle);
        } else {
            setQuantity(value);
        }
    }

    // Toggle Free Quantity to Dropdown Quantity
    const quantitySave = () => {
        // Allow Custom Quantity to be Displayed by Dropdown Quantity Selector
        const newSeriesArray = [...seriesArray];
        newSeriesArray.push(quantity);
        setSeriesArray(newSeriesArray);

        // Change Input State
        setQuantityToggle(!quantityToggle);
    }

    const addToCart = () => {
        fetch("http://localhost:8181/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "token": token,
                "itemId": id,
                "quantity": quantity
            })
        });
    }

    const addToRecList = () => {
        fetch("http://localhost:8181/admin/recommend/" + id, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
        .then(resp => resp.json()
            .then(data =>   {
                if (resp.status === 200)    {
                    if (data === "already recommended") {
                        alert("Product is already recommended")
                    } else {
                        alert("Product added to recommended list")
                    }
                    return data;
                } else {
                    alert("There is an error!")
                }
            })
        )
    }

    const remFromRecList = () => {
        fetch("http://localhost:8181/admin/recommend/" + id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(resp => resp.json()
            .then(data =>   {
                if (resp.status === 200)    {
                    if (data === "already removed") {
                        alert("Product is not in recommended list")
                    } else {
                        alert("Product removed from recommended list")
                    }
                    return data;
                } else {
                    alert("There is an error!")
                }
            })
        )
    }

    if (editMode === "EDIT PRODUCTS") {
        console.log("Editing Products...")
        renderTemplate = (
            <div>
                <EditProduct
                    product_id={data.product_id}
                    name={data.name}
                    description={data.description}
                    price={data.price}
                    stock={data.stock}
                    categories={data.categories}
                    image={data.image}
                />
            </div>
        )
    }

    // ADMIN VIEW
    if ((token) && (token !== "") && (token !== undefined) &&
        token === "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjowLCJ2ZXIiOjF9.CzB0g4cIIs2Ii5RQmsvpEQjqInX-3L028ru_JEtP-Hw") {
        return (
            <div className="purchasePage">
                <div className="itemInformation">
                    <h1>{data.name}</h1>
                    <h2>Details</h2>
                    <div>
                        <ul>Product ID: {data.product_id}</ul>
                        <ul>Product Description: {data.description}</ul>
                        <ul>Category: {data.categories}</ul>
                        <button onClick={() => editType("EDIT PRODUCTS")}>Edit Product Details</button>
                        {renderTemplate}
                        <div>
                            <img src={data.image} />
                        </div>

                    </div>

                </div>

                <div className="purchasePanel">
                    <h2>Purchase Panel</h2>
                    <div>Cost per item: {"$" + data.price}</div>
                    <div>{"Stock Remaining: " + data.stock}</div>
                    <div>{"Current Quantity: " + quantity}</div>

                    <label for="qty">Quantity:</label>
                    <div name="qty" className="quantitySelect">{quantityToggle ?
                        <FreeQuantity
                            quantity={quantity}
                            setQuantity={setQuantity}
                            quantitySave={quantitySave}
                            toggleText={ToggleText}
                        />
                        :
                        <DropdownQuantity
                            quantity={quantity}
                            changeHandler={changeHandler}
                            seriesArray={seriesArray}
                        />
                    }</div>

                    <button className="addButton" onClick={() => addToCart()}>Add to Cart</button>
                    <Button className="addButton" onClick={() => addToRecList()}>Add to Recommended List</Button>
                    <Button className="addButton" onClick={() => remFromRecList()}>Remove from Recommended List</Button>
                </div>
                
            </div>
        )

        // USER VIEW
    } else {
        return (
            <div className="purchasePage">
                <div className="itemInformation">
                    <h1>{data.name}</h1>
                    <h2>Details</h2>
                    <div>
                        <ul>Product ID: {data.product_id}</ul>
                        <ul>Product Description: {data.description}</ul>
                        <ul>Category: {data.categories}</ul>
                        <div>
                            <img src={data.image} alt="product image"/>
                        </div>
                    </div>
                </div>

                <div className="purchasePanel">
                    <h2>Purchase Panel</h2>
                    <div>Cost per item: {"$" + data.price}</div>
                    <div>{"Stock Remaining: " + data.stock}</div>
                    <div>{"Current Quantity: " + quantity}</div>

                    <label for="qty">Quantity:</label>
                    <div name="qty" className="quantitySelect">{quantityToggle ?
                        <FreeQuantity
                            quantity={quantity}
                            setQuantity={setQuantity}
                            quantitySave={quantitySave}
                            toggleText={ToggleText}
                        />
                        :
                        <DropdownQuantity
                            quantity={quantity}
                            changeHandler={changeHandler}
                            seriesArray={seriesArray}
                        />
                    }</div>

                    <button className="addButton" onClick={() => addToCart()}>Add to Cart</button>
                </div>
            </div>
        )
    }
}

export default Product;