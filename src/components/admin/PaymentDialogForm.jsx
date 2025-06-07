import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  Box,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import DescriptionIcon from "@mui/icons-material/Description";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAddPayment,
  useEditPayment,
} from "tanstack/Queries/payment_tanstack";

export default function PaymentDialogForm({
  open,
  onClose,
  paymentDataForEdit,
}) {
  const { mutate: addPayment } = useAddPayment();
  const { mutate: editPayment } = useEditPayment();

  const [formData, setFormData] = useState({
    amount: "",
    paymentType: "online",
    status: "pending",
    description: "",
    mobileNumber: "", // ✅ Added
  });

  useEffect(() => {
    if (paymentDataForEdit) {
      setFormData({
        amount: paymentDataForEdit.amount || "",
        paymentType: paymentDataForEdit.paymentType || "online",
        status: paymentDataForEdit.status || "pending",
        description: paymentDataForEdit.description || "",
        mobileNumber: paymentDataForEdit.mobileNumber || "", // ✅ Populate if editing
      });
    }
  }, [paymentDataForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentDataForEdit) {
      addPayment(
        { data: formData },
        {
          onSuccess: () => {
            toast.success("Payment Added");
            onClose();
          },
        }
      );
    } else {
      editPayment(
        { id: paymentDataForEdit._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Payment Updated");
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#fffaf2",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(to right, #e67e22, #d35400)",
          color: "white",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {paymentDataForEdit ? "Edit Payment" : "Add Payment"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fff8ed" }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#b34700" }}
          >
            Payment Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* ✅ New Number Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  if (cleaned.length <= 10) {
                    setFormData((prev) => ({
                      ...prev,
                      mobileNumber: cleaned,
                    }));
                  }
                }}
                required
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]{10}",
                  title: "Please enter a valid 10-digit mobile number",
                }}
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="warning">+91</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                required
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Payment Type"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                required
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Submit Button */}
        <DialogActions sx={{ px: { xs: 2, sm: 4 }, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#e67e22",
              fontWeight: "bold",
              py: 1.5,
              fontSize: "1rem",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#d35400",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
