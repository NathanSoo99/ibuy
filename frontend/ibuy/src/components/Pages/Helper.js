import React, { useState, useContext, useRef } from 'react';
import { FaWindowMinimize } from 'react-icons/fa';

import { UserContext } from "../UserContext";

import "./PagesCSS/Helper.css"

import Question1 from './PageComponents/Question1';
import Question2 from './PageComponents/Question2';
import Question3 from './PageComponents/Question3';
import { Link } from 'react-router-dom';

const Helper = () => {
    const { token } = useContext(UserContext);
    const [showHelper, setShowHelper] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentState, setCurrentState] = useState(1);
    const messages = useRef([
        {
            body: "Hello, I'm the IBuy AI helper. Send me a message to wake me up",
            incoming: true
        }
    ]);

    const sendMessage = (e) => {
        e.preventDefault();
        messages.current.push({
            body: currentMessage,
            incoming: false
        });
        if (currentState === 1) {
            messages.current.push({
                body: <Question1 token={ token } changeQuestion={ nextQuestion }/>,
                incoming: true
            });
            setCurrentState(2);
        } else {
            messages.current.push({
                body: "Sorry I don't quite understand",
                incoming: true
            });
        }
        console.log(messages.current);
        setCurrentMessage("");
    }

    const nextQuestion = (nextQuestionNumber, answer) => {
        console.log(messages);
        messages.current.push({
            body: answer,
            incoming: false
        });
        switch (nextQuestionNumber) {
            case 3:
                messages.current.push({
                    body: <Question2 token={ token } changeQuestion={ nextQuestion }/>,
                    incoming: true
                });
                break;
            case 4:
                messages.current.push({
                    body: <Question3 token={ token } changeQuestion={ nextQuestion }/>,
                    incoming: true
                });
                break;
            case 5:
                messages.current.push({
                    body: <button onClick={() => getResults()}>Get Results</button>,
                    incoming: true
                })
                break;
        }
        setCurrentState(nextQuestionNumber);
    }

    const getResults = () => {
        var url = new URL("http://localhost:8181/helper/final"),
            params = { "token": token }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key])
        );
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }).then(response => response.json().then(json => {
            messages.current.push({
                body: <div>
                    <Link to={ "/product/" + json.id }>{json.name}</Link>
                    <img src={ json.pic } className="recommended-image"/>
                </div>,
                incoming: true
            })
            setCurrentState(1);
        }));
        
    }

    return (
        <div>{showHelper ? 
            <div className="chat-window">
                <div className="chat-header">
                    <span className="chat-title">AI Staff Helper</span>
                    <FaWindowMinimize onClick={ () => setShowHelper(false) } className="exit-button"/>
                </div>
                <div className="chat-history">{messages.current.map(value => 
                    <div className={value.incoming ? "incoming-message" : "outgoing-message"} >{ value.body }</div>
                )}</div>
                <form onSubmit={ e => sendMessage(e) } className="chat-input">
                    <input type="text" onChange={ e => setCurrentMessage(e.target.value) } value={ currentMessage } className="message-input"/>
                    <input type="submit" value="submit" className="message-submit"/>
                </form>
            </div>
        :
            <button onClick={ () => setShowHelper(true) } className="open-button">AI Staff Helper</button>
        }</div>

    );
}

export default Helper;