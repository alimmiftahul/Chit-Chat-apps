import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import DarkButton from './components/DarkButton';

function App() {
    return (
        <div>
            <DarkButton />
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/chats" element={<ChatPage />} />
            </Routes>
        </div>
    );
}

export default App;
