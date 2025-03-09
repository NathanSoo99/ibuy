import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../UserContext';
import { HomeImages } from './PageComponents/HomeImages';
import HomeSlider from './PageComponents/HomeSlider';
import RecommendedSlider from './PageComponents/RecommendedSlider';
import { Link } from "react-scroll"
import '../Pages/PagesCSS/Home.css'
import './PageComponents/PageComponentsCSS/RecommendedSlider.css'

const Home = () => {

    const { token } = useContext(UserContext)
    const [recImages, setRecImages] = useState('')
    const [adminRecProd, setAdminRecProd] = useState('')

    // View Recommended Products
    useEffect(() => {

        if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== null && sessionStorage.getItem("token") !== "" && sessionStorage.getItem("token") !== undefined) {
            //console.log("Token is " + token)
            //console.log("Token is: " + sessionStorage.getItem("token"))
            var url1 = new URL("http://localhost:8181/recommender"),
                params = { token: sessionStorage.getItem("token") };
            Object.keys(params).forEach(key => url1.searchParams.append(key, params[key]))
            fetch(url1).then(
                response => response.json().then(json => {
                    //console.log(json);
                    setRecImages(json);
                })
            );

            var url2 = new URL("http://localhost:8181/admin/recommend/display"),
                params = { token: sessionStorage.getItem("token") };
            Object.keys(params).forEach(key => url2.searchParams.append(key, params[key]))
            fetch(url2).then(
                response => response.json().then(json => {
                    //console.log(json);
                    setAdminRecProd(json);
                })
            );
        }

    }, []);

    return (
        <div className='hcontainer'>
            {token ? (
                <div>
                    <h2>You are logged in</h2>
                    <section className="adminRec" id="adminRec">
                        <div className = 'rectitle'>Recommended by admin!</div>
                        <RecommendedSlider slides={adminRecProd} />
                    </section>
                    <section className="userRec" id="userRec">
                        <div className = 'rectitle'>For You</div>
                        <RecommendedSlider slides={recImages} />
                    </section>
                </div>

            ) : (
                <div >
                    <h2>You are not logged in</h2>
                    <HomeSlider slides={HomeImages} />
                </div>
            )}
        </div>
    )
}

export default Home
