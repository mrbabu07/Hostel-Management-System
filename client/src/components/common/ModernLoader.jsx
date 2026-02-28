import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const ModernLoader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              mb: 2,
            }}
          >
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: "primary.main",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    background:
                      "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                  }}
                >
                  H
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 500,
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <CircularProgress
        size={40}
        sx={{
          color: "primary.main",
        }}
      />
      {text && (
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default ModernLoader;
