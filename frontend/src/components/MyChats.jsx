import { AddIcon } from '@chakra-ui/icons';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getSender } from '../config/Chatlogics';
import ChatLoading from './ChatItem/ChatLoading';
import GroupChatModal from './GroupChatModal';
import { Button, useColorMode } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';

const MyChats = ({ fetchAgain }) => {
    const { colorMode } = useColorMode();
    const bgColor = colorMode === 'dark' ? 'mirage.900' : 'slate.200';
    const textColor = colorMode === 'dark' ? 'white' : 'black';
    const [loggedUser, setLoggedUser] = useState();

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        console.log('selected');
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get('/api/chat', config);
            setChats(data);
        } catch (error) {
            console.log('unselected');
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
        // console.log(chats.users.map((user) => user.name));
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg={bgColor}
            textColor={textColor}
            height={{ base: '100%' }}
            width={{ base: '100%', md: '41%' }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        d="flex"
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                d="flex"
                bg={bgColor}
                textColor={textColor}
                flexDir="column"
                p={3}
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                onClick={() => {
                                    selectedChat === chat
                                        ? setSelectedChat(null)
                                        : setSelectedChat(chat);
                                }}
                                cursor="pointer"
                                bg={selectedChat === chat ? 'mirage.600' : 'white'}
                                color={selectedChat === chat ? 'white' : 'black'}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        {/* <b>{chat.users.name} : </b> */}
                                        {/* {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(
                                                  0,
                                                  51
                                              ) + '...'
                                            : chat.latestMessage.content} */}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
