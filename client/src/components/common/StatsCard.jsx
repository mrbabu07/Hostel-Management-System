import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "primary",
  trend,
  trendValue,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const gradients = {
    primary: {
      bg: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0.3) 100%)",
      icon: "linear-gradient(135deg, #667eea 0%, #667eeaCC 100%)",
    },
    success: {
      bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.3) 100%)",
      icon: "linear-gradient(135deg, #10B981 0%, #10B981CC 100%)",
    },
    warning: {
      bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.3) 100%)",
      icon: "linear-gradient(135deg, #F59E0B 0%, #F59E0BCC 100%)",
    },
    error: {
      bg: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.3) 100%)",
      icon: "linear-gradient(135deg, #EF4444 0%, #EF4444CC 100%)",
    },
    info: {
      bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.3) 100%)",
      icon: "linear-gradient(135deg, #3B82F6 0%, #3B82F6CC 100%)",
    },
  };

  const gradient = gradients[color] || gradients.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      <Card
        sx={{
          background: gradient.bg,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box flex={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: gradient.icon,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {prefix}
                <CountUp
                  end={
                    typeof value === "number" ? value : parseFloat(value) || 0
                  }
                  duration={2}
                  decimals={decimals}
                  separator=","
                />
                {suffix}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  {trend === "up" ? (
                    <TrendingUp size={16} color="#10B981" />
                  ) : (
                    <TrendingDown size={16} color="#EF4444" />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: trend === "up" ? "success.main" : "error.main",
                      fontWeight: 600,
                    }}
                  >
                    {trendValue}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: gradient.icon,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Icon size={28} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
