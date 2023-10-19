import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import theme from './utils/chakra-theme.js';
import ChatProvider from './Context/ChatProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Router>
        <ChatProvider>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </ChatProvider>
    </Router>
    // </React.StrictMode>
);
