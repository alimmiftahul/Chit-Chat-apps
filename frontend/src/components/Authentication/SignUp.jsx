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
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const { colorMode } = useColorMode();
    const [show, setShow] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const navigate = useNavigate();

    const borderColor = colorMode === 'dark' ? 'slate.100' : 'gray.600'; //colorMode === 'dark' ? 'white' : 'mirage.900';
    const iconColor = colorMode === 'dark' ? 'mirage.900' : 'white';

    const handleClick = () => setShow(!show);
    const handleClickShowPassword = () => setShowConfPassword(!showConfPassword);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'picture not found',
                description: 'please select an Image!',
                status: 'warning',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
            return;
        }
        console.log(pics);
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            console.log(data);
            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'alimmiftahul');
            fetch('https://api.cloudinary.com/v1_1/alimmiftahul/image/upload', {
                method: 'post',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                });
        } else {
            toast({
                title: 'picture not found',
                description: 'please select an Image!',
                status: 'warning',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confPassword) {
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
        if (password !== confPassword) {
            toast({
                title: 'Passwords Do Not Match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        console.log(name, email, password, pic);
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };
            const { data } = await axios.post(
                'http://localhost:8080/api/user/',
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            console.log(data);
            toast({
                title: 'Registration Successful',
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
                description: 'error.response.data.message',
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
            <FormControl id="name-input" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                    borderColor={borderColor}
                    bg={colorMode === 'dark' ? 'slate.100' : 'gray.600'}
                />
            </FormControl>

            <FormControl id="email-input" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor={borderColor}
                    bg={colorMode === 'dark' ? 'slate.100' : 'gray.600'}
                />
            </FormControl>

            <FormControl id="password-input" isRequired>
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

            <FormControl id="confpassword-input" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={showConfPassword ? 'text' : 'password'} // Toggle input type
                        placeholder="Enter your Password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        borderColor={borderColor}
                        bg={colorMode === 'dark' ? 'slate.100' : 'gray.600'}
                    />
                    <InputRightElement>
                        <Button
                            bgColor={borderColor}
                            _hover={{ bgColor: borderColor }}
                            onClick={handleClickShowPassword}
                            size={'sm'}
                        >
                            {showConfPassword ? (
                                <ViewIcon color={iconColor} />
                            ) : (
                                <ViewOffIcon color={iconColor} />
                            )}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="pic-input" isRequired>
                <FormLabel>Upload your profile picture</FormLabel>
                <Input
                    type="file" // Toggle input type
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                    bg={colorMode === 'dark' ? 'slate.100' : 'gray.600'}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                width={'100%'}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isloading={loading.toString()}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default SignUp;
