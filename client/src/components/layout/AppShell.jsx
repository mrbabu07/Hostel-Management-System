import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import DrawerSidebar from "./DrawerSidebar";
import { useAuth } from "../../context/AuthContext";

const AppShell = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Global Navbar */}
      <Navbar onDrawerToggle={handleDrawerToggle} />

      {/* Slide-in Drawer Sidebar */}
      {user && (
        <DrawerSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
        }}
      >
        {/* Toolbar spacer to push content below navbar */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AppShell;
