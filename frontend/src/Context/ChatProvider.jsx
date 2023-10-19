import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatState = () => {
    return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [notification, setNotification] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
        if (!userInfo) navigate('/');
    }, [navigate]);
    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
