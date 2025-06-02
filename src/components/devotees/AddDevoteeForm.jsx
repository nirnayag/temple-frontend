import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAddDevotee,
  useEditDevotee,
} from "tanstack/Queries/devotees_tanstack";
import { useLocation, useNavigate } from "react-router-dom";
function AddDevoteeForm() {
  const { mutate: addDevotee, isPending: addDevoteeIsPending } =
    useAddDevotee();
  const { mutate: editDevotee, isPending: editDevoteeIsPending } =
    useEditDevotee();
  const location = useLocation();
  const devoteeDataforEdit = location.state?.DevoteeData;
  const navigate = useNavigate();
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
            navigate("/admin/dashboard");
          },
        }
      );
    } else {
      editDevotee(
        { id: devoteeDataforEdit._id, data: formData },
        {
          onSuccess: () => {
            navigate("/admin/dashboard");
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
    <form onSubmit={handleAddDevoteeForm}>
      <p className="text-center mt-2">Add Details Of Devotee</p>
      <Grid container spacing={3} mb={2} mt={4}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={"name"}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            // label={t("puja.form.email")}
            label={"email"}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            // label={t("puja.form.email")}
            label={"Phone"}
            name="mobileNumber"
            type="number"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
            sx={{ bgcolor: "#fff" }}
          />
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
            {"submit"}
            {/* {eventDataforEdit ? " Update" : " Create"} */}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddDevoteeForm;
