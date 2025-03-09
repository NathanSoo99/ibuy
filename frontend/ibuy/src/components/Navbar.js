import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaBars } from 'react-icons/fa'
import './Navbar.css';
import SearchBar from './Pages/PageComponents/SearchBar';

function Navbar() {

    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const { token } = useContext(UserContext);

    // ADMIN VIEW
    if ((token) && (token !== "") && (token !== undefined) && 
    token === "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjowLCJ2ZXIiOjF9.CzB0g4cIIs2Ii5RQmsvpEQjqInX-3L028ru_JEtP-Hw")   {
        return (
            <nav className = 'navbar'>
                <div className = 'navbar-container'>
                    <Link to = '/' className = 'navbar-logo'>
                    iBuy
                    </Link>
                <div className =' menu-icon' onClick = {handleClick}>

                </div>
                    <ul className = {click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to = '/auth/logout' className='nav-links'>
                                Log Out
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to = '/admin' className='nav-links'>
                                Admin Account
                            </Link>
                        </li>
                        <li>
                            <Link to='/cart' className='nav-links'>
                                Shopping Cart
                            </Link>
                        </li>
                    </ul>
                </div>
                <SearchBar />
            </nav>
        )
    
    // USER VIEW
    } else if ((token) && (token !== "") && (token !== undefined))    {
        return (
            <nav className = 'navbar'>
                <div className = 'navbar-container'>
                    <Link to = '/' className = 'navbar-logo'>
                    iBuy
                    </Link>
                <div className =' menu-icon' onClick = {handleClick}>

                </div>
                    <ul className = {click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to = '/auth/logout' className='nav-links'>
                                Log Out
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to = '/user' className='nav-links'>
                                My Account
                            </Link>
                        </li>
                        <li>
                            <Link to='/cart' className='nav-links'>
                                Shopping Cart
                            </Link>
                        </li>
                    </ul>
                </div>
                <SearchBar />
            </nav>
        )
    
    // LOGGED OUT VIEW
    } else {
        return  (
            <nav className = 'navbar'>
                <div className = 'navbar-container'>
                    <Link to = '/' className = 'navbar-logo'>
                    iBuy
                    </Link>
                <div className =' menu-icon' onClick = {handleClick}>

                </div>
                    <ul className = {click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to = '/auth/login' className='nav-links'>
                                Log In
                            </Link>
                        </li>
                        <li className = 'nav-item'>
                            <Link to = '/auth/register' className='nav-links'>
                                Sign Up
                            </Link>
                        </li>
                        <li>
                            <Link to='/cart' className='nav-links'>
                                Shopping Cart
                            </Link>
                        </li>
                    </ul>
                </div>
                <SearchBar />
            </nav>
        )
    }    
}

export default Navbar;
