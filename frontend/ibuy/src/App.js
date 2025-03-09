import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// iBuy Components
import Navbar from './components/Navbar'
import { UserContext } from './components/UserContext';

// iBuy Pages
import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
import NotFound from './components/Pages/NotFound';
import Signup from './components/Pages/Signup';
import ShoppingCart from './components/Pages/Cart';
import ResetRequest from './components/Pages/ResetRequest'
import ResetSubmit from './components/Pages/ResetSubmit'
import Checkout from './components/Pages/Checkout'
import Search from './components/Pages/Search';
import UserAccount from './components/Pages/UserAccount';
import Logout from './components/Pages/Logout';
import Product from './components/Pages/Product';
import AccountDetails from './components/Pages/AccountDetails';
import AdminAccount from './components/Pages/AdminAccount';
import Helper from './components/Pages/Helper';
import OrderSuccess from './components/Pages/OrderSuccess';

function App() {
    const [token, setToken] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);

    useEffect(() => {
        if (token !== '' && token !== undefined) {
            setToken(sessionStorage.getItem("token"))
        }
    }, [token])

    return (
        <div className="App">
            <Router>
                <Switch>
                    <UserContext.Provider value={{ token, setToken, walletBalance, setWalletBalance }}>
                        <Navbar />
                        <Route exact path='/' component={Home} />
                        <Route exact path='/auth/login' component={Login} />
                        <Route exact path='/auth/logout' component={Logout} />
                        <Route exact path='/auth/register' component={Signup} />
                        <Route path='/search/:search' component={Search} />
                        <Route path='/product/:id' component={Product} />
                        <Route exact path='/cart' component={ShoppingCart} />
                        <Route exact path='/checkout' component={Checkout} />
                        <Route exact path='/auth/passwordreset/request' component={ResetRequest} />
                        <Route exact path='/auth/passwordreset/reset' component={ResetSubmit} />
                        <Route exact path='/user' component={UserAccount} />
                        <Route exact path='/admin' component={AdminAccount} />
                        <Route exact path='/user/details' component={AccountDetails} />
                        <Route exact path='/NotFound' component={NotFound} />
                        <Route exact path='/ordersuccess' component={OrderSuccess} />
                        <div>{token === null ? <></> : <Helper />}</div>
                    </UserContext.Provider>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </div>
    )
}

export default App