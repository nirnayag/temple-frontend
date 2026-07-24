import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useEffect, useState } from "react";
import {
  useAddDevotee,
  useEditDevotee,
} from "tanstack/Queries/devotees_tanstack";
import { toast } from "react-toastify";

export default function DevoteeDialogForm({
  open,
  onClose,
  onSubmit,
  devoteeDataforEdit,
}) {
  const { mutate: addDevotee } = useAddDevotee();
  const { mutate: editDevotee } = useEditDevotee();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState({
    mobileNumber: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10); // allow only digits, max 10
      setFormData((prev) => ({ ...prev, [name]: numericValue }));

      if (numericValue.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "Mobile number must be exactly 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      }
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value }));

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddDevoteeForm = async (e) => {
    e.preventDefault();

    if (
      formData.mobileNumber.length !== 10 ||
      errors.mobileNumber ||
      errors.email
    ) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    const finalPayload = { data: formData };

    if (!devoteeDataforEdit) {
      addDevotee(finalPayload, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      editDevotee(
        { id: devoteeDataforEdit._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Devotee details updated successfully.");
            onClose();
          },
        }
      );
    }
  };

  useEffect(() => {
    if (devoteeDataforEdit) {
      setFormData({
        name: devoteeDataforEdit.name || "",
        email: devoteeDataforEdit.email || "",
        mobileNumber: devoteeDataforEdit.mobileNumber || "",
      });
    }
  }, [devoteeDataforEdit]);

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
          Add Devotee Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleAddDevoteeForm}>
        <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fff8ed" }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#b34700" }}
          >
            Devotee Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="mobileNumber"
                type="text"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                inputProps={{ maxLength: 10 }}
                sx={{ bgcolor: "#fff" }}
                InputLabelProps={{ sx: { fontWeight: "bold" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

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
