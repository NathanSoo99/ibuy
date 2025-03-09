import React, { useState } from 'react'
import { useHistory } from 'react-router';

const ResetSubmit = () => {
    const [resetCode, setReset] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = {
            "resetCode": resetCode,
            "password": password
        };

        fetch("http://localhost:8181/auth/passwordreset/reset",{
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(form)
        }).then(() => {
            console.log('Form Submitted');
            history.push("/auth/login");
        })
    }

    return (
        <div>
            <h1>Enter Password Reset Code</h1>

            <form onSubmit = {handleSubmit}>
                <input onChange = {(e) => setReset(e.target.value)} value = {resetCode} placeholder = "reset code" type = "text" />
                <input onChange = {(e) => setPassword(e.target.value)} value = {password} placeholder = "new password" type = "password" />
                <input type="submit" name="reset" value="Submit" />
            </form>
        </div>
    )
}

export default ResetSubmit