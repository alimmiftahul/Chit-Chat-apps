import React, { useEffect } from 'react';
import {
    Container,
    Box,
    Text,
    useColorMode,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import SignUp from '../components/Authentication/SignUp';
import Login from '../components/Authentication/Login';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const { colorMode } = useColorMode();
    const bgColor = colorMode === 'dark' ? 'white' : 'mirage.900';
    const textColor = colorMode === 'dark' ? 'black' : 'white';

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) navigate('/chats');
    }, [navigate]);

    return (
        <Container maxW={'xl'} centerContent alignItems="flex-center">
            <Box
                d="flex"
                p={3}
                bg={'white'}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                textColor={textColor}
                bgColor={bgColor}
            >
                <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
                    Talk More
                </Text>
            </Box>
            <Box
                bgColor={bgColor}
                w={'100%'}
                p={4}
                borderRadius={'lg'}
                borderWidth={'1px'}
            >
                <Tabs variant="soft-rounded" textColor={textColor}>
                    <TabList mb="1em">
                        <Tab width="50%">Sign Up </Tab>
                        <Tab width="50%">Login</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}

export default HomePage;
