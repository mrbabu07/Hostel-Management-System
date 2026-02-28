import { TextField } from "@mui/material";
import { motion } from "framer-motion";

const ModernInput = ({ label, error, helperText, success, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TextField
        fullWidth
        label={label}
        error={error}
        helperText={helperText}
        {...props}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "&.Mui-focused": {
              backgroundColor: "background.paper",
              boxShadow: (theme) =>
                error
                  ? `0 0 0 2px ${theme.palette.error.main}20`
                  : success
                    ? `0 0 0 2px ${theme.palette.success.main}20`
                    : `0 0 0 2px ${theme.palette.primary.main}20`,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: error
              ? "error.main"
              : success
                ? "success.main"
                : "divider",
          },
          ...props.sx,
        }}
      />
    </motion.div>
  );
};

export default ModernInput;
