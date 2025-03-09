import React, { useState, useContext } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import EditAccount from './PageComponents/EditAccount'
import { UserContext } from '../UserContext';
import '../Pages/PagesCSS/UserAccount.css'
import AccountDetails from './AccountDetails';
import { Button, Row } from 'react-bootstrap'
import RedeemCode from './PageComponents/RedeemCode';

const UserAccount = () => {

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
                    <h4>My Account</h4>
                </div>

                <div className='uleftcontainer'>
                    <Row>
                        <Button className='separation' variant="outline-dark" onClick={() => editType("EDIT DETAILS")}>Edit Details</Button>
                        <Button className='separation' variant="outline-dark" onClick={() => editType("REDEEM CODES")}>Redeem Codes</Button>
                    </Row>
                </div>

                <div className='urightcontainer'>
                    <AccountDetails />
                    {renderTemplate}
                </div>
            </div>
        </div>
    )
}

export default UserAccount