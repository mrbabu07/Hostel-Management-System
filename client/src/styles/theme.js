import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#667eea",
      light: "#8b9cff",
      dark: "#4c63d2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#a47bcf",
      dark: "#5a3a7d",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.05)",
    "0 4px 6px rgba(0,0,0,0.05)",
    "0 10px 15px rgba(0,0,0,0.08)",
    "0 20px 25px rgba(0,0,0,0.1)",
    "0 25px 50px rgba(0,0,0,0.12)",
    "0 2px 4px rgba(0,0,0,0.06)",
    "0 4px 8px rgba(0,0,0,0.08)",
    "0 8px 16px rgba(0,0,0,0.1)",
    "0 12px 24px rgba(0,0,0,0.12)",
    "0 16px 32px rgba(0,0,0,0.14)",
    "0 20px 40px rgba(0,0,0,0.16)",
    "0 24px 48px rgba(0,0,0,0.18)",
    "0 28px 56px rgba(0,0,0,0.2)",
    "0 32px 64px rgba(0,0,0,0.22)",
    "0 36px 72px rgba(0,0,0,0.24)",
    "0 40px 80px rgba(0,0,0,0.26)",
    "0 44px 88px rgba(0,0,0,0.28)",
    "0 48px 96px rgba(0,0,0,0.3)",
    "0 52px 104px rgba(0,0,0,0.32)",
    "0 56px 112px rgba(0,0,0,0.34)",
    "0 60px 120px rgba(0,0,0,0.36)",
    "0 64px 128px rgba(0,0,0,0.38)",
    "0 68px 136px rgba(0,0,0,0.4)",
    "0 72px 144px rgba(0,0,0,0.42)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "1rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #5568d3 30%, #63408a 90%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b9cff",
      light: "#a5b4ff",
      dark: "#667eea",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a47bcf",
      light: "#c19ee0",
      dark: "#764ba2",
      contrastText: "#ffffff",
    },
    success: {
      main: "#34D399",
      light: "#6EE7B7",
      dark: "#10B981",
    },
    warning: {
      main: "#FBBF24",
      light: "#FCD34D",
      dark: "#F59E0B",
    },
    error: {
      main: "#F87171",
      light: "#FCA5A5",
      dark: "#EF4444",
    },
    info: {
      main: "#60A5FA",
      light: "#93C5FD",
      dark: "#3B82F6",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#CBD5E1",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "1rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #8b9cff 30%, #a47bcf 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #7a8bef 30%, #9368bf 90%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});
