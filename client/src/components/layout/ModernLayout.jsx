import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ModernNavbar from "../common/ModernNavbar";
import ModernSidebar from "../common/ModernSidebar";

const ModernLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <ModernNavbar onMenuClick={handleDrawerToggle} />
      <ModernSidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { sm: "280px" },
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1400px" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ModernLayout;
