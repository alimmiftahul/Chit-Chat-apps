import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useColorMode,
    useToast,
} from '@chakra-ui/react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { colorMode } = useColorMode();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const borderColor = colorMode === 'dark' ? 'slate.100' : 'gray.600'; //colorMode === 'dark' ? 'white' : 'mirage.900';
    const iconColor = colorMode === 'dark' ? 'mirage.900' : 'white';

    const handleClick = () => setShow(!show);
    const toast = useToast();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please Fill all the Feilds',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        console.log(email, password);
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };
            const { data } = await axios.post(
                'http://localhost:8080/api/user/login',
                {
                    email,
                    password,
                },
                config
            );
            console.log(data);
            toast({
                title: 'Login Succesfull',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <VStack spacing={'5px'}>
            <FormControl id="first-name" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor={borderColor}
                    bg={colorMode === 'dark' ? 'slate.100' : 'gray.600'}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'} // Toggle input type
                        placeholder="Enter your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        borderColor={borderColor}
                        bg={colorMode === 'dark' ? 'slate.100' : 'gray.600'}
                    />
                    <InputRightElement>
                        <Button
                            bgColor={borderColor}
                            _hover={{ bgColor: borderColor }}
                            onClick={handleClick}
                            size={'sm'}
                        >
                            {show ? (
                                <ViewIcon color={iconColor} />
                            ) : (
                                <ViewOffIcon color={iconColor} />
                            )}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width={'100%'}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >
                Login
            </Button>

            <Button
                variant={'solid'}
                colorScheme="red"
                width={'100%'}
                style={{ marginTop: 15 }}
                onClick={() => {
                    setEmail('guest@mail.com');
                    setPassword('12345');
                }}
            >
                Get User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
