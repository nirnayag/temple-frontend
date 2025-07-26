import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Notes";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useCreateEvent, useEditEvent } from "tanstack/Queries/events_tanstack";

export default function EventDialogForm({ open, onClose, eventDataforEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const { mutate: createEvent, isPending: createEventIsPending } =
    useCreateEvent();
  const { mutate: EditEvent, isPending: EditEventIsPending } = useEditEvent(); // use This hook to handle event creation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // If eventDataforEdit is provided, populate the form with its data because we are using the same for both create and edit operations.
  // This is done using the useLocation hook to get the state passed from the previous component.
  useEffect(() => {
    // If eventDataforEdit is available, set the formData state with its values
    if (eventDataforEdit) {
      setFormData({
        title: eventDataforEdit.title || "",
        description: eventDataforEdit.description || "",
        startDate:
          new Date(eventDataforEdit.startDate).toISOString().split("T")[0] ||
          "",
        endDate:
          new Date(eventDataforEdit.endDate).toISOString().split("T")[0] || "",
        startTime: eventDataforEdit.startTime || "",
        endTime: eventDataforEdit.endTime || "",
        location: eventDataforEdit.location || "",
      });
    }
  }, [eventDataforEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventDataforEdit) {
      createEvent(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      EditEvent(
        { id: eventDataforEdit._id, data: formData },
        {
          onSuccess: () => {
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
      maxWidth="md"
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
        <Typography
          variant="h6"
          fontWeight="bold"
          fontSize={{ xs: "1.1rem", sm: "1.25rem" }}
        >
          Create New Event
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fff8ed" }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#b34700" }}
          >
            Event Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Submit Button */}
        <DialogActions sx={{ px: { xs: 2, sm: 4 }, pb: 3, pt: 0 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
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
            Create Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
