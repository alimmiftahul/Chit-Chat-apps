import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'mirage.950' : 'slate.50',
                color: props.colorMode === 'dark' ? 'white' : 'black',
            },
        }),
    },
    colors: {
        slate: {
            50: '#f7fafc',
            100: '#edf2f7',
            200: '#e2e8f0',
            300: '#cbd5e0',
            400: '#a0aec0',
            500: '#718096',
            600: '#4a5568',
            700: '#2d3748',
            800: '#1a202c',
            900: '#171923',
        },
        mirage: {
            50: '#f5f7fa',
            100: '#eaedf4',
            200: '#d1d9e6',
            300: '#a8b9d1',
            400: '#7993b7',
            500: '#58769f',
            600: '#455e84',
            700: '#394c6b',
            800: '#32415a',
            900: '#2d384d',
            950: '#1a202c',
        },
    },
});

export default theme;
