import React from 'react'
import { Link } from 'react-router-dom'

const OrderSuccess = () => {
    return (
        <div>
            <h1>Order Successful</h1>
            <Link to="/">Home</Link>
        </div>
    )
}

export default OrderSuccess
