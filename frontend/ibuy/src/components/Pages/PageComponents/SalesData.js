import React from 'react';
import Sales from './Sales';
import "./PageComponentsCSS/SalesData.css"

const SalesData = ({ id }) => {

    //console.log(id.history)

    return (
        <div className='salesPanel'>
            <div className='productName'>{id.name}</div>
            {id.history.map((product) => (
                <Sales id={product} />
            ))}

        </div>

    )
}

export default SalesData;