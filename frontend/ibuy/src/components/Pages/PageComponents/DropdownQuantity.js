import React from 'react';

import "../PagesCSS/Product.css"
import "./PageComponentsCSS/General.css"

const DropdownQuantity = ( { quantity, changeHandler, seriesArray} ) => {
    return (
        <select
            className="dropdown-quantity"
            value={ quantity }
            onChange={ e => changeHandler(e.target.value) }
        >
            {seriesArray.map(value => <option value={ value }>{ value }</option>)}
        </select>
    );
}

export default DropdownQuantity;
