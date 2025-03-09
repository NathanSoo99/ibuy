import React from 'react';

import { Link } from "react-router-dom";

import "./PageComponentsCSS/Result.css"

const Result = ({ id, name, price }) => {
    return (
        <div className="result">
            <Link to={"/product/" + id} className="nameLink">{name}</Link>
            <div className="priceTag">${price}</div>
        </div>
    )
}

export default Result;