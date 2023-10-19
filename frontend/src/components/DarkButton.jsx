import { Button, useColorMode, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Container } from '@chakra-ui/react';

const DarkButton = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Container m="10px 10px">
            <IconButton
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                aria-label="Toggle Color Mode"
                variant="ghost"
                size="md"
            />
        </Container>
    );
};

export default DarkButton;
