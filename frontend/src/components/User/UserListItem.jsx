import { Avatar } from '@chakra-ui/avatar';
import { Box, Text } from '@chakra-ui/layout';
import { ChatState } from '../../Context/ChatProvider';
import { useColorMode } from '@chakra-ui/react';
import { useState } from 'react';

const UserListItem = ({ user, handleFunction }) => {
    const { colorMode } = useColorMode();
    const bgColor = colorMode === 'dark' ? 'slate.200' : 'gray.100';
    const textColor = colorMode === 'dark' ? 'white' : 'black';

    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg={bgColor}
            _hover={{
                background: 'mirage.600',
                color: 'white',
            }}
            w="100%"
            d="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.pic} />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;
