import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
                const response = await axios.post(recieveMessageRoute, {
                    from: data._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentChat]);

    useEffect(() => {
        const getCurrentChat = async () => {
            if (currentChat) {
                await JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY))._id;
            }
        };
        getCurrentChat();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));

        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: data._id,
            msg,
        });

        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div
                        key={uuidv4()}
                        className={`message ${message.fromSelf ? "sended" : "received"}`}
                    >
                        {!message.fromSelf && (
                            <div className="avatar">
                                <i class="material-icons">person</i>
                            </div>
                        )}
                        <div className="content">
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;

        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;

            .username {
                h3 {
                    color: white;
                }
            }
        }
    }

    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;

        .message {
            display: flex;
            align-items: flex-start;

            .avatar {
                i {
                    height: 3rem;
                    color: #fff;
                    margin-right: 1rem;
                }
            }

            .content {
                max-width: 70%; // Adjust as needed
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #000;
                background: #fff;

                p {
                  margin: 0;
                }
            }
        }

        .sended {
            justify-content: flex-end;
            align-items: flex-end;
        }

        .received {
            justify-content: flex-start;
            align-items: flex-start;
        }
    }
`;

export default ChatContainer;
