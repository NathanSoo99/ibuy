import React, { useState } from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import '../PageComponents/PageComponentsCSS/EditAccount.css'


const EditAccount = ({ token }) => {

    const [newEmail, setNewEmail] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleEmail = (e) => {
        e.preventDefault();

        const opts = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": newEmail,
                "token": token,
            })
        };

        try {
            fetch("http://localhost:8181/user/details/setemail", opts)
                .then(resp => {
                    if (resp.status === 200) return resp.json();
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                    window.location.reload(true);
                })
        } catch (error) {
            console.error("There is an Error!", error);
        }
    }

    const handleName = (e) => {
        e.preventDefault();

        const opts = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "firstName": newFirstName,
                "lastName": newLastName,
                "token": token,
            })
        };

        try {
            // Set first name & last name end point
            fetch("http://localhost:8181/user/details/setname", opts)
                .then(resp => {
                    if (resp.status === 200) return resp.json();
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                    window.location.reload(true);
                })
        } catch (error) {
            console.error("There is an Error!", error);
        }
    }

    const handlePassword = (e) => {
        e.preventDefault();

        const opts = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "currentPassword": currentPassword,
                "newPassword": newPassword,
                "token": token,
            })
        };

        try {
            // Set password end point
            fetch("http://localhost:8181/user/details/setpassword", opts)
                .then(resp => {
                    if (resp.status === 200) return resp.json();
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                    window.location.reload(true);
                })
        } catch (error) {
            console.error("There is an Error!", error);
        }
    }

    return (
        <div>
            <h1>Edit your Profile</h1>
            <Form>
                <Row>
                    <Form.Label column="lg" lg={4}>Email</Form.Label>
                    <Col xs={5}>
                        <InputGroup className="mb-3">
                            <Form.Control size="lg" value={newEmail} type="email" placeholder="Enter email" onChange={(e) => setNewEmail(e.target.value)} />
                            <Button id="button-addon2" onClick={handleEmail} variant="primary" type="submit">
                                Edit Email
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={4}>Password</Form.Label>
                    <Col xs={5}>
                        <InputGroup className="mb-3">
                            <Form.Control value={currentPassword} type="currentPassword" placeholder="Enter your current password" onChange={(e) => setCurrentPassword(e.target.value)} />
                            <Form.Control value={newPassword} type="newPassword" placeholder="Enter your new Password" onChange={(e) => setNewPassword(e.target.value)} />
                            <Button onClick={handlePassword} variant="primary" type="submit">
                                Edit Password
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={4}>Name</Form.Label>
                    <Col xs={5}>
                    <InputGroup className="mb-3">
                        <Form.Control value={newFirstName} type="currentPassword" placeholder="Enter your new First Name" onChange={(e) => setNewFirstName(e.target.value)} />
                        <Form.Control value={newLastName} type="newPassword" placeholder="Enter your new Last Name" onChange={(e) => setNewLastName(e.target.value)} />
                        <Button onClick={handleName} variant="primary" type="submit">
                            Edit Name
                        </Button>
                        </InputGroup>
                    </Col>
                </Row>

            </Form>

        </div>
    )

}

export default EditAccount