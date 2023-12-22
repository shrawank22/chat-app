import React, { useState, useEffect } from "react";
import styled from "styled-components";
export default function Welcome() {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const data = await JSON.parse(
                    localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)
                );
                if (data) {
                    setUserName(data.username);
                }
            } catch (error) {
                console.error('Error fetching username from local storage:', error);
            }
        };

        fetchUserName();
    }, []);

    return (
        <Container>
            <img src="https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    background-color: #000;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    img {
        height: 20rem;
    }
    span {
        color: #4e0eff;
    }
`;
