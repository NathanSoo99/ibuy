import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router';

import Result from './PageComponents/Result';
import SearchBar from './PageComponents/SearchBar';

import "./PagesCSS/Search.css";

const Search = () => {
    const { search } = useParams();

    const [results, resultUpdate] = useState([]);

    // Get View of Shopping Cart from Backend
    useEffect(() => {
        var url = new URL(
            "http://localhost:8181/items/search"
            /* params = {"term": search}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]) */
        );
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body:   JSON.stringify({
                "term": search
            })
        })
        .then(
            response => response.json().then(json => {
                if (response.status === 200) {
                    resultUpdate(json);
                }
            })
        );
    }, [search]);

    return (
        <div className="searchPage">
            <h1>Search Page</h1>
            <div>{search}</div>
            <SearchBar />
    
            <div className="searchPanel">{results.map((result) => (
                    <Result id={result.id} name={result.name} price={result.price}/>
            ))}</div>
        </div>
    );
}

export default Search;