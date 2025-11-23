
import { createTheme } from '@mui/material/styles';


// Modern light theme
export const lightTheme = createTheme({
    palette: {
    mode: 'light',
    primary: {
        main: '#4A68FF', // modern blue
    },
    secondary: {
        main: '#FF6B6B', // warm accent
    },
    background: {
        default: '#F7F8FA',
        paper: '#FFFFFF',
    },
},
    shape: {
        borderRadius: 12,
    },
        typography: {
        fontFamily: 'Inter, sans-serif',
    },
});


// Modern dark theme
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6C8BFF',
        },
        secondary: {
            main: '#FF7B7B',
        },
        background: {
            default: '#0F1116',
            paper: '#1A1C22',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});