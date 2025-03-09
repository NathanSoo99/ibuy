import React, { useState, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../Pages/PagesCSS/Login.css'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const { token, setToken } = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault();

        const opts = {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "email": email,
                "password": password,
                })
        };

        fetch("http://localhost:8181/auth/login",opts)
            .then(resp =>   {
                if (resp.status === 200) return resp.json();
                else alert ("Invalid account details");
            })
            .then(data => {
                console.log("From Backend", data);
                sessionStorage.setItem("token", data.token);
                
                setToken(data.token);
                console.log("Your Token is = ", data.token);

                if (data.token !== "" && data.token !== undefined)  {
                    setRedirect(true)
                }
                
            })
            .catch(error => {
                console.error("There is an Error!", error);
            })
    }

    if (redirect)   {
        return <Redirect to = "/"/>
    }

    return (
        <div className = 'lcontainer'>
            <div className = 'lformWrap'>

                {token && (token !== "") && (token !== undefined) ? ("You are logged in!") : ( 
                    <div className = 'lformContent'>
                        <form className = 'lform' onSubmit = {handleSubmit}>
                            <div className = 'h1'>Log In Here!</div>
                            <input className = 'lformInput' onChange = {(e) => setEmail(e.target.value)} value = {email} placeholder = "Enter your email" type = "text"></input>
                            <input className = 'lformInput' onChange = {(e) => setPassword(e.target.value)} value = {password} placeholder = "Enter your password" type = "password"></input>
                            <input className = 'lformInput' type="submit" name="login" value="Log In" />   
                            <h4><Link to = "/auth/passwordreset/request">Forgot Password?</Link></h4>                        
                        </form>
                        </div>    
                )}  
           </div>
        </div>
    )
}

export default Login