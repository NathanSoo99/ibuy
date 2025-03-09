import React, { useContext } from 'react'
import { UserContext } from '../UserContext';
import { Redirect } from 'react-router-dom';
import '../Pages/PagesCSS/Logout.css'

const Logout = () => {

    const { token, setToken } = useContext(UserContext)

    const handleLogout = (e) => {
        e.preventDefault();

        const opts = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "token": sessionStorage.getItem("token")
            })
        };

        fetch("http://localhost:8181/auth/logout", opts)
            .then(resp => {
                if (resp.status === 200) return resp.json();
                else alert("There is an error!");
            })
            .then(data => {
                console.log("From Backend", data);
                if (data.is_success === true) {
                    setToken(null)
                    sessionStorage.removeItem("token")
                    sessionStorage.removeItem("walletBalance")
                }
            })
            .catch(error => {
                console.error("There is an Error!", error);
            })
    }

    if (!token || (token === undefined) || (token === "")) {
        return <Redirect to="/" />
    }

    return (
        <div className='lcontainer'>
            <div className = 'lformContent'>
                <div className='lform'>
                    <div className='h1'>Logout with the button below</div>
                    <button className = 'lformButton' onClick={handleLogout}>Log Out </button>
                </div>
            </div>
        </div>
    )

}

export default Logout