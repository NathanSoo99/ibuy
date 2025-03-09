import React from 'react';
import "./PageComponentsCSS/SalesData.css"

const Sales = (index) => {

    console.log(index)

    return (
        <div className='salesPanel'>
            <div className='salesData'>
            <div className='revenue'>
                <ul>Total Revenue: ${index.id.price*index.id.quantity}</ul>
                <ul>Individual Cost: ${index.id.price}</ul>
                <ul>Quantity Sold: {index.id.quantity}</ul>
            </div>
            </div>
        </div>

    )
}

export default Sales;

{/* <div className='salesData'>
            <div className='productName'>{id.name}</div>
            <div className='revenue'>
                <ul>Total Revenue: ${id.history[0].price*id.history[0].quantity}</ul>
                <ul>Individual Cost: ${id.history[0].price}</ul>
                <ul>Quantity Sold: {id.history[0].quantity}</ul>
            </div>
        </div> */}