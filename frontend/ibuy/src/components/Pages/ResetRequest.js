import React, { useState } from 'react';
import { useHistory } from 'react-router';

const ResetRequest = () => {
    const [email, setEmail] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();

        const opts = {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "email": email,
                })
        };

        fetch("http://localhost:8181/auth/passwordreset/request",opts)
        .then(resp =>   {
            if (resp.status === 200) return resp.json();
            else alert ("There is an error!");
        })
        .then(data => {
            console.log("From Backend", data);
            history.push("/auth/passwordreset/reset");
        })
    }

    return (
        <div>
            <h1>Enter Account Email Address</h1>

            <form onSubmit = {handleSubmit}>
                <input onChange = {(e) => setEmail(e.target.value)} value = {email} placeholder = "email" type = "text" />
                <input type="submit" name="reset" value="Submit" />
            </form>
        </div>
    )
}

export default ResetRequest