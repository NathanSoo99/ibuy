import React, { useState } from 'react'

const Question2 = ( { token, changeQuestion } ) => {
    const next_question = 4;
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1);

    const [done, setDone] = useState(false);

    const submitAnswer = (e) => {
        e.preventDefault();
        changeQuestion(next_question, "$" + min + " - $" + max);
        setDone(true);

        // submit to backend
        fetch("http://localhost:8181/helper/price", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "token": token,
                "maxPrice": max,
                "minPrice": min
            })
        });
    }

    return (
        <div>
            <div>What is your price range?</div>
            <div>{ done ?
                <></>
            :
                <form onSubmit={(e) => submitAnswer(e)}>
                    <label for="min">Minimum $</label>
                    <input min="0" max={ max - 1 } onChange={ e => setMin(parseInt(e.target.value)) } value={ min } name="min" type="number"/>
                    <label for="max">Maximum $</label>
                    <input min={ min + 1 } onChange={ e => setMax(parseInt(e.target.value)) } value={ max } name="max" type="number"/>
                    <input value="OK" type="submit"/>
                </form>
            }</div>
        </div>
    )
}

export default Question2
