import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { eventService, devoteeService } from "../../services/api";
import authService from "../../services/auth";
import PropTypes from "prop-types";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#E2DFD2",
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: "#d35400",
  color: "#E2DFD2",
  borderRadius: "15px 15px 0 0",
  "& .MuiCardHeader-title": {
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#d35400",
  color: "#E2DFD2",
  "&:hover": {
    backgroundColor: "#b34700",
  },
}));

const StyledOutlineButton = styled(Button)(({ theme }) => ({
  color: "#d35400",
  borderColor: "#d35400",
  "&:hover": {
    backgroundColor: "#d35400",
    color: "#E2DFD2",
  },
}));

const EventCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#f5e6d3",
  marginBottom: theme.spacing(2),
  borderRadius: "10px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

const UserDashboard = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [devotee, setDevotee] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsAuthenticated(authService.isLoggedIn());
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profileData = await authService.getProfile();
        setUser(profileData.user);
        setDevotee(profileData.devotee);
        const eventsResponse = await eventService.getUpcoming();
        setEvents(eventsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#E2DFD2",
        }}
      >
        <CircularProgress sx={{ color: "#d35400" }} />
        <Typography sx={{ mt: 2, color: "#4a4a4a" }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, minHeight: "100vh", bgcolor: "#E2DFD2" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error Loading Dashboard</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <StyledButton onClick={() => window.location.reload()}>
          Try Again
        </StyledButton>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ bgcolor: "#E2DFD2", minHeight: "100vh", py: 4 }}>
      <Container>
        {/* Header Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              sx={{ color: "#d35400", fontWeight: "bold" }}
            >
              Welcome, {devotee?.name || user?.username || "Devotee"}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#666666" }}>
              Dashboard |{" "}
              {user?.role === "admin" ? "Administrator" : "Temple Member"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <StyledOutlineButton
              component={Link}
              to="/profile/edit"
              startIcon={<EditIcon />}
            >
              Edit Profile
            </StyledOutlineButton>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Events Section */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <StyledCardHeader
                title="Upcoming Events"
                action={
                  <StyledOutlineButton
                    component={Link}
                    to="/events"
                    size="small"
                    startIcon={<EventIcon />}
                  >
                    View All
                  </StyledOutlineButton>
                }
              />
              <CardContent>
                {events?.length === 0 ? (
                  <Alert severity="info">No upcoming events found.</Alert>
                ) : (
                  <Stack spacing={2}>
                    {events?.slice(0, 5).map((event) => (
                      <EventCard key={event?._id}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography
                              variant="h6"
                              sx={{ color: "#4a4a4a", mb: 1 }}
                            >
                              {event?.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#666666", mb: 1 }}
                            >
                              {event?.description}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <TimeIcon
                                  sx={{
                                    color: "#d35400",
                                    mr: 0.5,
                                    fontSize: "1rem",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#666666" }}
                                >
                                  {event?.startTime} - {event?.endTime}
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <LocationIcon
                                  sx={{
                                    color: "#d35400",
                                    mr: 0.5,
                                    fontSize: "1rem",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#666666" }}
                                >
                                  {event?.location}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: { xs: "flex-start", sm: "flex-end" },
                            }}
                          >
                            <Chip
                              icon={<CalendarIcon />}
                              label={formatDate(event.date)}
                              sx={{
                                bgcolor:
                                  new Date(event.date) <
                                  new Date(
                                    new Date().setDate(new Date().getDate() + 3)
                                  )
                                    ? "#dc3545"
                                    : "#d35400",
                                color: "#E2DFD2",
                                mb: 1,
                              }}
                            />
                            <StyledOutlineButton
                              component={Link}
                              to={`/events/${event?._id}`}
                              size="small"
                              sx={{ mt: "auto" }}
                            >
                              Details
                            </StyledOutlineButton>
                          </Grid>
                        </Grid>
                      </EventCard>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <StyledCardHeader title="Your Profile" avatar={<PersonIcon />} />
              <CardContent>
                <Stack spacing={3}>
                  {/* Account Information */}
                  <Box>
                    <Typography variant="h6" sx={{ color: "#d35400", mb: 1 }}>
                      Account Information
                    </Typography>
                    <Divider sx={{ borderColor: "#d35400", mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ color: "#666666" }}>
                          Username
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">
                          {user?.username}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ color: "#666666" }}>
                          Email
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{user?.email}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ color: "#666666" }}>
                          Role
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Chip
                          icon={
                            user?.role === "admin" ? (
                              <AdminIcon />
                            ) : (
                              <PersonIcon />
                            )
                          }
                          label={
                            user?.role === "admin" ? "Administrator" : "Member"
                          }
                          sx={{
                            bgcolor:
                              user?.role === "admin" ? "#dc3545" : "#d35400",
                            color: "#E2DFD2",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Personal Information */}
                  {devotee && (
                    <Box>
                      <Typography variant="h6" sx={{ color: "#d35400", mb: 1 }}>
                        Personal Information
                      </Typography>
                      <Divider sx={{ borderColor: "#d35400", mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="body2" sx={{ color: "#666666" }}>
                            Name
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {devotee.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" sx={{ color: "#666666" }}>
                            Phone
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {devotee.phone || "Not provided"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" sx={{ color: "#666666" }}>
                            Address
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {devotee.address ? (
                              <>
                                {devotee.address}
                                {devotee.city && (
                                  <>
                                    <br />
                                    {devotee.city}
                                  </>
                                )}
                                {devotee.state && <>, {devotee.state}</>}
                                {devotee.country && <> {devotee.country}</>}
                              </>
                            ) : (
                              "Not provided"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" sx={{ color: "#666666" }}>
                            Member Since
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {formatDate(devotee.memberSince)}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" sx={{ color: "#666666" }}>
                            Membership
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Chip
                            label={
                              devotee.membershipType?.charAt(0).toUpperCase() +
                                devotee.membershipType?.slice(1) || "Regular"
                            }
                            sx={{ bgcolor: "#d35400", color: "#E2DFD2" }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Stack spacing={2}>
                    <StyledButton
                      component={Link}
                      to="/profile/edit"
                      startIcon={<EditIcon />}
                      fullWidth
                    >
                      Edit Profile
                    </StyledButton>
                    {user?.role === "admin" && (
                      <StyledOutlineButton
                        component={Link}
                        to="/admin/dashboard"
                        startIcon={<AdminIcon />}
                        fullWidth
                      >
                        Admin Dashboard
                      </StyledOutlineButton>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
UserDashboard.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default UserDashboard;
