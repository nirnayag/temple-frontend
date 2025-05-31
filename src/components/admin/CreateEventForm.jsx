import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { eventService } from "services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCreateEvent } from "tanstack/Queries/events_tanstack";
function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const { mutate, isPending } = useCreateEvent(); // use This hook to handle event creation
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        navigate("/admin/dashboard");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={"Title"}
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            // label={t("puja.form.email")}
            label={"Description"}
            name="description"
            type="text"
            value={formData.description}
            onChange={handleInputChange}
            required
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            // label={t("puja.form.date")}
            label={"Start Date"}
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            // label={t("puja.form.date")}
            label={"End Date"}
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={"Start Time"}
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={"End Time"}
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="text"
            label={"Location"}
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            sx={{ bgcolor: "#fff" }}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            // disabled={!selectedPuja}
            sx={{
              bgcolor: "#d35400",
              "&:hover": {
                bgcolor: "#b34700",
              },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateEventForm;
