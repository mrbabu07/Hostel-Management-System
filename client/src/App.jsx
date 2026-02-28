import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "12px",
                  padding: "16px",
                  fontWeight: 500,
                },
                success: {
                  style: {
                    background: "#10B981",
                    color: "white",
                  },
                  iconTheme: {
                    primary: "white",
                    secondary: "#10B981",
                  },
                },
                error: {
                  style: {
                    background: "#EF4444",
                    color: "white",
                  },
                  iconTheme: {
                    primary: "white",
                    secondary: "#EF4444",
                  },
                },
              }}
            />
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
