import React, { useState, useContext } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import EditAccount from './PageComponents/EditAccount';
import AddProducts from './PageComponents/AddProducts';
import ViewSales from './PageComponents/ViewSales';
import RedeemCode from './PageComponents/RedeemCode';
import { UserContext } from '../UserContext';
import { Button, Row } from 'react-bootstrap'
import '../Pages/PagesCSS/AdminAccount.css'

const AdminAccount = () => {

    const [editMode, setEditMode] = useState(false);
    const { token } = useContext(UserContext);
    let renderTemplate;

    const editFalse = () => {
        setEditMode(false);
    }

    function editType(key) {

        switch (key) {
            case "EDIT DETAILS":
                setEditMode(true);
                setEditMode("EDIT DETAILS")
                break;
            case "ADD PRODUCTS":
                setEditMode(true);
                setEditMode("ADD PRODUCTS")
                break;
            case "VIEW SALES":
                setEditMode(true);
                setEditMode("VIEW SALES")
                break;
            case "REDEEM CODES":
                setEditMode(true);
                setEditMode("REDEEM CODES")
                break;
            default:
                setEditMode(false);
                break;
        }
    }

    if (editMode === "EDIT DETAILS") {
        console.log("Editing Details...")
        renderTemplate = <EditAccount token={token} />;
    } else if (editMode === "ADD PRODUCTS") {
        console.log("Adding Products...")
        renderTemplate = <AddProducts />;
    } else if (editMode === "VIEW SALES") {
        console.log("Viewing Sales...")
        renderTemplate = <ViewSales />
    } else if (editMode === "REDEEM CODES") {
        console.log("Redeem Code")
        renderTemplate = <RedeemCode />
    }

    if (!token || (token === undefined) || (token === "")) {
        return <Redirect to="/" />
    }

    return (
        <div>
            <div>
                <div className='title'>
                    <h4>Admin Account</h4>
                </div>

                <div className='aleftcontainer'>
                    <Row>
                        <Button className='separation' variant="outline-dark" onClick={() => editType("EDIT DETAILS")}>Edit Details</Button>
                        <Button className='separation' variant="outline-dark" onClick={() => editType("ADD PRODUCTS")}>Add Products</Button>
                        <Button className='separation' variant="outline-dark" onClick={() => editType("VIEW SALES")}>View Sales</Button>
                        <Button className='separation' variant="outline-dark" onClick={() => editType("REDEEM CODES")}>Redeem Codes</Button>
                    </Row>
                </div>

                <div className='arightcontainer'>
                    {renderTemplate}
                </div>



            </div>
        </div>
    )
}

export default AdminAccount