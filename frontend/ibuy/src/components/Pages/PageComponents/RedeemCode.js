import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../UserContext';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import '../PagesCSS/RedeemCode.css'

const RedeemCode = () => {

    const [giftCode, setGiftCode] = useState('');
    const [giftCodeValue, setGiftCodeValue] = useState('');
    const [giftCodeEmail, setGiftCodeEmail] = useState('');
    const { token } = useContext(UserContext)
    const { walletBalance, setWalletBalance } = useContext(UserContext)

    // View Wallet Balance
    useEffect(() => {
        var url = new URL("http://localhost:8181/user/wallet"),
            params = { token: sessionStorage.getItem("token") };
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
            .then(
                response => response.json()
                    .then(json => {
                        setWalletBalance(parseFloat(json.balance.toFixed(0)))

                    })
            );
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const opts = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "giftCode": giftCode,
                "token": token,
            })
        };
        //console.log("Gift Code is" + giftCode)
        if (giftCode === null || giftCode === '') {
            alert("Enter a Gift Code")
        } else {
            fetch("http://localhost:8181/user/redeemcode", opts)
                .then(resp => {
                    if (resp.status === 200) {
                        alert("Code Redeemed!")
                        return resp.json();
                    }
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                    if (data !== "" && data !== undefined && data !== null && data !== "no such code" && data !== "This code has been used") {
                        sessionStorage.setItem("walletBalance", data);
                    }
                })
                .catch(error => {
                    console.error("There is an Error!", error);
                })
        }
    }

    const buyCode = (e) => {
        e.preventDefault();
        console.log(giftCodeEmail)
        const opts = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "value": parseInt(giftCodeValue),
                "email": giftCodeEmail,
            })
        };
        if (giftCodeEmail === null || giftCodeValue === '' || giftCodeEmail === '' || giftCodeValue === null) {
            alert("Please ensure all details are filled in")
        } else {
            fetch("http://localhost:8181/user/buycode", opts)
                .then(resp => {
                    if (resp.status === 200) {
                        alert("Purchase successful! Please check your email.")
                        window.location.reload(true);
                        return resp.json();
                    }
                    if (resp.status === 500) {
                        alert("Please check your inputs.")
                    }
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                })
                .catch(error => {
                    console.error("There is an Error!", error);
                })
        }
    }

    return (

        <div>
            <div>
                <h2>Your Wallet Balance: ${walletBalance}</h2>
            </div>

            <Form>
                <Row>
                    <Form.Label column="lg" lg={4}>Redeem Code</Form.Label>
                    <Col xs={4}>
                        <InputGroup className="mb-3">
                            <Form.Control size="lg" required="required" value={giftCode} type="name" placeholder="Enter your code here" onChange={e => setGiftCode(e.target.value)} />
                            <Button onClick={handleSubmit} required="required" value="Redeem Code" name="code" variant="primary" type="submit">
                                Redeem Code
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Form>

            <Form className='rseparation'>
                <Row>
                    <Form.Label column="lg" lg={4}>Gift Code Amount</Form.Label>
                    <Col xs={5}>
                        <InputGroup className="mb-3">
                            <Form.Control size="lg" required="required" value={giftCodeValue} type="name" placeholder="Enter amount" onChange={e => setGiftCodeValue(e.target.value)} />
                            <Form.Control size="lg" required="required" value={giftCodeEmail} type="name" placeholder="Enter your email" onChange={e => setGiftCodeEmail(e.target.value)} />
                            <Button onClick={buyCode} value="Buy Gift Code" name="code" variant="primary" type="submit">
                                Buy Gift Code Code
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Form>


        </div>

    )
}

export default RedeemCode
