import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";

export default function ChatInput({ handleSendMsg }) {
    const [msg, setMsg] = useState("");

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    return (
        <Container>
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <textarea
                    placeholder="Message"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit">
                    <IoMdSend />
                </button>
            </form>
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    align-items: center;
    background-color: #000;
    padding: 0 1rem;

    .input-container {
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        background-color: #ffffff34;
        textarea {
            height: 100%;  
            width: 100%;  
            background-color: transparent;
            color: white;
            border: none;
            padding-left: 1rem;
            padding-top: 1rem;
            font-size: 1.2rem;
            resize: none; 
    
            &::selection {
                background-color: #9a86f3;
            }
            &:focus {
                outline: none;
            }
        }

        button {
            padding: 0.3rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #9a86f3;
            border: none;
            @media screen and (min-width: 720px) and (max-width: 1080px) {
                padding: 0.3rem 1rem;
                svg {
                    font-size: 1rem;
                }
            }
            svg {
                font-size: 2rem;
                color: white;
            }
        }
    }
`;
