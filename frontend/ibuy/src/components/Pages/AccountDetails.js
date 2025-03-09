import React from 'react'
import { UserContext } from '../UserContext';
import '../Pages/PagesCSS/AccountDetails.css'

class AccountDetails extends React.Component {

    static contextType = UserContext;

    constructor() {
        super();
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            referralCode: '',
        }
    }

    async componentDidMount() {
        try {
            const { token } = this.context;
            // Set first name & last name end point
            var url = new URL("http://localhost:8181/user/details"),
                params = { token: String(token) };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            await fetch(url)
                .then(resp => {
                    if (resp.status === 200) return resp.json();
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                    this.setState({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        referralCode: data.referralCode,
                    })

                })
        } catch (error) {
            console.error("There is an Error!", error);
        }
    }

    render() {
        return (
            <div>

                <h1> Your Account Details </h1>
                <div>
                    <ul>Email: {this.state.email}</ul>
                    <ul>First Name: {this.state.firstName}</ul>
                    <ul>Last Name: {this.state.lastName}</ul>
                    <ul>Personal Referral Code: {this.state.referralCode}</ul>
                </div>



            </div>


        )
    }
}

AccountDetails.contextType = UserContext;

export default AccountDetails
