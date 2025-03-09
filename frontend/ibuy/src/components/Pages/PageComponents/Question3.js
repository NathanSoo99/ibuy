import React, { useState } from 'react'

const Question3 = ( { token, changeQuestion } ) => {
    const next_question = 5

    const [done, setDone] = useState(false);

    const submitAnswer = (answer) => {
        // submit to backend
        fetch("http://localhost:8181/helper/stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "token": token,
                "stock": answer
            })
        });
        changeQuestion(next_question, answer ? "Yes" : "No");
        setDone(true);
    }

    return (
        <div>
            <div>Do you need the product soon</div>
            <div>{ done ?
                <></>
            :
                <div>
                    <button onClick={ () => submitAnswer(true) }>Yes</button>
                    <button onClick={ () => submitAnswer(false) }>No</button>                 
                </div>
            }</div>

        </div>
    )
}

export default Question3
