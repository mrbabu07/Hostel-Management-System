import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Receipt,
  Payment,
  Download,
  CheckCircle,
  Pending,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ModernLayout from "../../components/layout/ModernLayout";
import StripePaymentForm from "../../components/billing/StripePaymentForm";
import { billingService } from "../../services/billing.service";
import toast from "react-hot-toast";

// Initialize Stripe
console.log('Stripe Public Key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const ModernMyBill = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await billingService.getAllBills();
      setBills(response.data.bills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (bill) => {
    setSelectedBill(bill);
    setPaymentDialog(true);
  };

  const handlePaymentSuccess = async () => {
    setPaymentDialog(false);
    setSelectedBill(null);
    await fetchBills();
  };

  const handlePaymentCancel = () => {
    setPaymentDialog(false);
    setSelectedBill(null);
  };

  const handleDownloadPDF = async (billId) => {
    try {
      toast.success("Downloading bill...");
      // In real app: window.open(`/api/v1/billing/${billId}/pdf`, '_blank');
    } catch (error) {
      toast.error("Failed to download bill");
    }
  };

  return (
    <ModernLayout>
      <Box>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
            <div className="flex items-center gap-4">
              <Receipt sx={{ fontSize: 40 }} />
              <div>
                <h1 className="text-4xl font-bold mb-2">My Bills 💰</h1>
                <p className="text-purple-100">
                  View and pay your mess bills
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bills List */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : bills.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Receipt sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No bills found
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {bills.map((bill, index) => (
              <Grid item xs={12} md={6} key={bill._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      border: bill.status === "pending" ? "2px solid" : "none",
                      borderColor: "warning.main",
                    }}
                  >
                    <CardContent>
                      {/* Bill Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          {new Date(2024, bill.month - 1).toLocaleString(
                            "default",
                            { month: "long" },
                          )}{" "}
                          {bill.year}
                        </Typography>
                        <Chip
                          icon={
                            bill.status === "paid" ? (
                              <CheckCircle />
                            ) : (
                              <Pending />
                            )
                          }
                          label={bill.status}
                          color={bill.status === "paid" ? "success" : "warning"}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>

                      {/* Breakdown */}
                      <Box sx={{ mb: 2 }}>
                        {Object.entries(bill.breakdown).map(
                          ([mealType, data]) => (
                            <Box
                              key={mealType}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                py: 1,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {mealType}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {data.count} meals × ₹{data.rate}
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight={600}>
                                ₹{data.total}
                              </Typography>
                            </Box>
                          ),
                        )}
                      </Box>

                      {/* Total */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pt: 2,
                          borderTop: "2px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Total
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="primary"
                        >
                          ₹{bill.totalAmount}
                        </Typography>
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                        {bill.status === "pending" ? (
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Payment />}
                            onClick={() => handlePayNow(bill)}
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Download />}
                            onClick={() => handleDownloadPDF(bill._id)}
                          >
                            Download Receipt
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Payment Dialog */}
        <Dialog
          open={paymentDialog}
          onClose={handlePaymentCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Payment color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Complete Payment
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedBill && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  You are about to pay ₹{selectedBill.totalAmount} for{" "}
                  {new Date(2024, selectedBill.month - 1).toLocaleString(
                    "default",
                    { month: "long" },
                  )}{" "}
                  {selectedBill.year}
                </Alert>

                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    bill={selectedBill}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </Elements>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2 }}
                >
                  🔒 Secure payment powered by Stripe. Your payment information
                  is encrypted and secure.
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default ModernMyBill;
