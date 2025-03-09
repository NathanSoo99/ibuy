import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import SalesData from './SalesData';
import '../PageComponents/PageComponentsCSS/ViewSales.css'

const ViewSales = () => {

    const [salesData, setSalesData] = useState([]);
    const { sales } = useParams();

    // View Sales Data
    useEffect(() => {
        var url = new URL("http://localhost:8181/admin/sales")

        fetch(url)
            .then(response => response.json()
                .then(data => {
                    if (response.status === 200) {
                        setSalesData(data)
                        //console.log(data)
                    }
                })
            );
    }, [sales]);

    /* console.log(salesData[0].history) */
    return (
        <div>
            <h1>Sales Board</h1>

            {salesData.map((product) => (
                <SalesData id={product} />
            ))}
        </div>
    )
}

export default ViewSales