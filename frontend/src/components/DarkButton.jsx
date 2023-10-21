import { Button, useColorMode, IconButton, Text } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Container } from '@chakra-ui/react';

const DarkButton = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Container m="10px 10px" display={'flex'} justifyContent={'space-between'}>
            <IconButton
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                aria-label="Toggle Color Mode"
                variant="ghost"
                size="md"
            />
            <Text fontSize="2xl" fontWeight="bold">
                Chit Chat Apps
            </Text>
        </Container>
    );
};

export default DarkButton;
