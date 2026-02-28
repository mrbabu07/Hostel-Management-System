import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { Download, Payment } from "@mui/icons-material";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const BillView = ({ bill }) => {
  const {
    month = "January",
    year = 2024,
    totalAmount = 2250,
    status = "Due",
    meals = [
      {
        date: "2024-01-01",
        breakfast: true,
        lunch: true,
        dinner: true,
        total: 150,
      },
      {
        date: "2024-01-02",
        breakfast: true,
        lunch: true,
        dinner: false,
        total: 100,
      },
    ],
    totalMeals = 45,
    costPerMeal = 50,
  } = bill || {};

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 3,
            mb: 3,
            borderRadius: 2,
            mx: -2,
            mt: -2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {month} {year}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Monthly Mess Bill
              </Typography>
            </Box>
            <Chip
              label={status}
              color={status === "Paid" ? "success" : "warning"}
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                px: 2,
                py: 2.5,
              }}
            />
          </Box>
        </Box>

        {/* Total Amount */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Amount
            </Typography>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ₹<CountUp end={totalAmount} duration={2} separator="," />
            </Typography>
          </Box>
        </motion.div>

        <Divider sx={{ my: 2 }} />

        {/* Breakdown Table */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Meal Breakdown
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell>Date</TableCell>
                <TableCell align="center">Breakfast</TableCell>
                <TableCell align="center">Lunch</TableCell>
                <TableCell align="center">Dinner</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meals.map((meal, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(meal.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {meal.breakfast ? "✓" : "-"}
                  </TableCell>
                  <TableCell align="center">{meal.lunch ? "✓" : "-"}</TableCell>
                  <TableCell align="center">
                    {meal.dinner ? "✓" : "-"}
                  </TableCell>
                  <TableCell align="right">₹{meal.total}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell colSpan={4}>
                  <Typography fontWeight={600}>Total</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700}>₹{totalAmount}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Box
          sx={{ mt: 3, p: 2, backgroundColor: "action.hover", borderRadius: 2 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Total Meals:</Typography>
            <Typography variant="body2" fontWeight={600}>
              {totalMeals}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Cost per Meal:</Typography>
            <Typography variant="body2" fontWeight={600}>
              ₹{costPerMeal}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" fontWeight={600}>
              Total Amount:
            </Typography>
            <Typography variant="body1" fontWeight={700} color="primary">
              ₹{totalAmount}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button fullWidth variant="outlined" startIcon={<Download />}>
            Download PDF
          </Button>
          {status !== "Paid" && (
            <Button fullWidth variant="contained" startIcon={<Payment />}>
              Pay Now
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BillView;
