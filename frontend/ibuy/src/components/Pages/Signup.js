import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import '../Pages/PagesCSS/Signup.css'

const Signup = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [redirect, setRedirect] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (email !== "" && firstName !== "" && lastName !== "" && password !== "")   {

            const form = { email, firstName, lastName, password, referralCode };
            console.log(form)

            fetch("http://localhost:8181/auth/register", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        }).then(res => {
            if (res.status === 200) {
                alert("You have successfully signed up! Log in now!");
                setRedirect(true)
            }
            return res.json();
        }).then(data => {
            if (data.code === 400) {
                if (data.message === "<p>email is invalid</p>") {
                    alert("Invalid Email");
                }
                if (data.message === "<p>Email address already in use</p>") {
                    alert("Email already in use");
                }
            }
            console.log("From Backend", data);
            
        })
        } else {
            alert("Please ensure Email, First Name, Last Name and Password are filled in");
        }

    }

    if (redirect) {
        return <Redirect to="/auth/login" />
    }

    return (
        <div className='scontainer'>
            <div className='sformWrap'>
                <div className='sformContent'>

                    <form className='sform' onSubmit={handleSubmit}>
                        <h2 className='sformHeader'>Sign Up Here!</h2>
                        <input className='sformInput' required="required" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" type="text"></input>
                        <input className='sformInput' required="required" onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="First Name" type="text"></input>
                        <input className='sformInput' required="required" onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="Last Name" type="text"></input>
                        <input className='sformInput' required="required" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" type="password"></input>
                        <input className='sformInput' required="required" onChange={(e) => setReferralCode(e.target.value)} value={referralCode} placeholder="Referral Code (Optional)" maxlength="8" type="number" ></input>

                        <button onClick={handleSubmit} className='sformButton'>Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup