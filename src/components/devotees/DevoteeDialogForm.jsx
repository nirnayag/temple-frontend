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
import { useLocation, useNavigate } from "react-router-dom";
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
  const { mutate: addDevotee, isPending: addDevoteeIsPending } =
    useAddDevotee();
  const { mutate: editDevotee, isPending: editDevoteeIsPending } =
    useEditDevotee();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDevoteeForm = async (e) => {
    e.preventDefault();
    if (!devoteeDataforEdit) {
      addDevotee(
        { data: formData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      editDevotee(
        { id: devoteeDataforEdit._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Event has been edited");
            onClose();
          },
        }
      );
    }
  };
  // If eventDataforEdit is provided, populate the form with its data because we are using the same for both create and edit operations.
  // This is done using the useLocation hook to get the state passed from the previous component.
  useEffect(() => {
    // If eventDataforEdit is available, set the formData state with its values
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
      {/* Dialog Header */}
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
                type="number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
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
