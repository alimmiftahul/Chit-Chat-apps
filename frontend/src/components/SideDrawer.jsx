import { Box } from '@chakra-ui/layout';
import {
    Tooltip,
    Button,
    Text,
    useColorMode,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Flex,
    Avatar,
    Input,
    useToast,
} from '@chakra-ui/react';
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from '@chakra-ui/modal';
import ProfileModal from './User/ProfileModal';
import ChatLoading from './ChatItem/ChatLoading';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { ChatState } from '../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import UserListItem from './User/UserListItem';
import axios from 'axios';

import { Spinner } from '@chakra-ui/spinner';

const SideDrawer = () => {
    const { colorMode } = useColorMode();
    const bgColor = colorMode === 'dark' ? 'mirage.900' : 'slate.200';
    const textColor = colorMode === 'dark' ? 'white' : 'black';
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();
    const toast = useToast();

    const { setSelectedChat, user, notification, setNotification, chats, setChats } =
        ChatState();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
            console.log(data);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoadingChat(false);
        }
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to Load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            console.log(error);
        }
    };
    return (
        <Box
            display={'flex'}
            justifyContent="space-between"
            alignItems="center"
            bg={bgColor}
            textColor={textColor}
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
            borderColor={bgColor}
        >
            <Tooltip
                label="Search Users to chat"
                hasArrow
                placement="bottom-end"
                display="flex"
            >
                <Button
                    variant="ghost"
                    onClick={onOpen}
                    fontSize={{ base: 'sm', md: 'md' }}
                    px={{ base: 2, md: 4 }}
                >
                    <i className="fas fa-search"></i>
                    <Text display={{ base: 'none', md: 'flex' }} px={4}>
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Flex alignItems="center" d="flex">
                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize="2xl" m={2} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && 'No New Messages'}
                        {notification.map((notif) => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(
                                        notification.filter((n) => n !== notif)
                                    );
                                }}
                            >
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(
                                          user,
                                          notif.chat.users
                                      )}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton
                        as={Button}
                        bg="white"
                        textColor={'gray.900'}
                        rightIcon={<ChevronDownIcon />}
                    >
                        <Avatar
                            size="sm"
                            cursor="pointer"
                            name={user.name}
                            src={user.pic}
                        />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box d="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default SideDrawer;
