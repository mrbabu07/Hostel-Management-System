import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Inbox } from "@mui/icons-material";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no items to display",
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Icon sx={{ fontSize: 60, color: "primary.main", opacity: 0.5 }} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          {description}
        </Typography>
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </motion.div>
  );
};

export default EmptyState;
