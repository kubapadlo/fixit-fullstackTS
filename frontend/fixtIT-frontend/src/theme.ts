import { createTheme, alpha } from '@mui/material/styles';

// Używamy "as const", aby TypeScript wiedział, że to konkretne stałe wartości
const sharedSettings = {
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { 
      textTransform: 'none' as const, // <--- TUTAJ DODANO "as const"
      fontWeight: 600 
    },
  },
} as const; // Dodanie "as const" tutaj również pomaga zachować precyzyjne typy

export const lightTheme = createTheme({
  ...sharedSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#99c1e9ff',
      paper: '#c0e4f0ff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.2)' },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...sharedSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8', // Jaśniejszy fiolet dla lepszej widoczności
      light: '#a5b4fc',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f472b6',
    },
    background: {
      default: '#0f172a', // Bardzo ciemny granat
      paper: '#1e293b',   // Nieco jaśniejszy granat dla kart i dialogów
    },
    text: {
      primary: '#f8fafc',   // Prawie biały
      secondary: '#94a3b8', // Stonowany szary
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: '#94a3b8',
      hover: 'rgba(255, 255, 255, 0.08)',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid rgba(255, 255, 255, 0.05)`, // Subtelna ramka zamiast cienia
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#818cf8',
          },
        },
      },
    },
  },
});