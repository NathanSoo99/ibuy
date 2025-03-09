import { React, useState, useEffect } from 'react'

import { UserContext } from "../../UserContext";

const Question1 = ( { token, changeQuestion } ) => {
    const next_question = 3;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Hello");
    const [done, setDone] = useState(false);

    useEffect(() => {
        var url = new URL("http://localhost:8181/helper/categories"),
            params = { "token": token }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }).then(response => response.json().then(json => {
            setCategories(json);
            if (json.length > 0) {
            setSelectedCategory(json[0]);
            }
            
        }));
    }, [])

    const submitAnswer = () => {
        changeQuestion(next_question, selectedCategory);
        setDone(true);

        // submit to backend
        fetch("http://localhost:8181/helper/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "token": token,
                "specificity": "any",
                "categoryChoice": [selectedCategory]
            })
        });
    }

    return (
        <div>
            <div>What sort of product are you looking for?</div>
            <div>{done ?
                <></>
            :
                <>
                    <select
                        value={ selectedCategory }
                        onChange={ e => setSelectedCategory(e.target.value) }
                    >{categories.map(category => 
                        <option value={ category }>{category}</option>
                    )}</select>
                    <button onClick={ () => submitAnswer() }>Choose</button>
                </>
            }</div>

        </div>
    )
}

export default Question1
