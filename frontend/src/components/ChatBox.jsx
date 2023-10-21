import { Box } from '@chakra-ui/layout';
import SingleChat from './SingleChat';
import { ChatState } from '../Context/ChatProvider';
import { useColorMode } from '@chakra-ui/react';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    const { colorMode } = useColorMode();
    const bgColor = colorMode === 'dark' ? 'mirage.900' : 'slate.200';
    const textColor = colorMode === 'dark' ? 'white' : 'black';

    return (
        <Box
            display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg={bgColor}
            textColor={textColor}
            width={{ base: '100%', md: '68%' }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default Chatbox;
