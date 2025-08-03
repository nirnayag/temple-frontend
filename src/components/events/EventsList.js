import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Alert,
  Form,
  Badge,
  Spinner,
} from "react-bootstrap";
import { eventService } from "../../services/api";
import authService from "../../services/auth";
import {
  Container as MuiContainer,
  Typography,
  Box,
  Grid,
  Card as MuiCard,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaUserAlt,
  FaFilter,
} from "react-icons/fa";
import styled from "styled-components";

// Styled components for enhanced UI
const StyledCard = styled(Card)`
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  border: none;
  background-color: #f5e6d3;
  color: #4a4a4a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border-radius: 15px;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    border-bottom: none;
    padding: 1.25rem;
    background-color: #d35400 !important;
    color: #f5e6d3;
    border-radius: 15px 15px 0 0;
  }

  .card-body {
    padding: 1.5rem;
  }

  p {
    color: #5d4037;
    margin-bottom: 1.5rem;
  }
`;

const EventIcon = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #5d4037;

  svg {
    margin-right: 0.75rem;
    color: #d35400;
  }
`;

const FilterContainer = styled.div`
  background: #f5e6d3;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #4a4a4a;
  border: 1px solid #e0c9a6;

  h5 {
    color: #d35400;
    margin-bottom: 1rem;
  }

  select {
    background-color: #f5e6d3;
    color: #4a4a4a;
    border: 1px solid #e0c9a6;
    border-radius: 8px;
    padding: 0.5rem;

    &:focus {
      background-color: #f5e6d3;
      color: #4a4a4a;
      border-color: #d35400;
      box-shadow: 0 0 0 0.2rem rgba(211, 84, 0, 0.25);
    }

    option {
      background-color: #f5e6d3;
      color: #4a4a4a;
    }
  }
`;

const EventTypeBadge = styled(Badge)`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  background-color: #f5e6d3 !important;
  color: #d35400 !important;
  border: 1px solid #d35400;
  border-radius: 8px;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CardFooter = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0c9a6;
`;

const EventsList = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(t("events.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const getFilteredEvents = () => {
    if (filter === "all") return events;

    const now = new Date();

    if (filter === "upcoming") {
      return events.filter((event) => new Date(event.date) >= now);
    } else if (filter === "past") {
      return events.filter((event) => new Date(event.date) < now);
    }

    return events.filter((event) => event.eventType === filter);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "amavsya":
        return "primary";
      case "festival":
        return "success";
      case "discourse":
        return "info";
      case "community":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Sort events by date (upcoming first)
  const sortedEvents = getFilteredEvents().sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("common.loading")}</span>
        </div>
        <div className="mt-3">
          <div className="row">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="card">
                  <div 
                    className="card-img-top" 
                    style={{ 
                      height: "200px", 
                      backgroundColor: "#f0f0f0",
                      animation: "pulse 1.5s ease-in-out infinite"
                    }}
                  />
                  <div className="card-body">
                    <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "10px", borderRadius: "4px" }} />
                    <div style={{ height: "16px", backgroundColor: "#f0f0f0", marginBottom: "10px", borderRadius: "4px" }} />
                    <div style={{ height: "24px", backgroundColor: "#f0f0f0", marginBottom: "10px", borderRadius: "4px" }} />
                    <div style={{ height: "60px", backgroundColor: "#f0f0f0", borderRadius: "4px" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: "#" }}>
      <Card>
        <Card.Body>
          {error && (
            <Alert variant="danger">
              {error}
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-3"
                onClick={fetchEvents}
              >
                {t("common.tryAgain")}
              </Button>
            </Alert>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ margin: 0, fontWeight: "600", fontSize: "1.5rem" }}>
              <span
                style={{
                  color: "#e05a00",
                  borderBottom: "2px solid #e05a00",
                  paddingBottom: "2px",
                }}
              >
                Upcoming
              </span>{" "}
              Events
            </h4>

            <Form.Select
              value={filter}
              onChange={handleFilterChange}
              style={{
                width: "160px",
                fontSize: "0.9rem",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="amavsya">Amavsya</option>
              <option value="festival">Festival</option>
              <option value="discourse">Discourse</option>
              <option value="community">Community</option>
            </Form.Select>
          </div>

          {events.length === 0 ? (
            <Alert
              variant="info"
              style={{
                backgroundColor: "#f5e6d3",
                color: "#4a4a4a",
                borderColor: "#d35400",
                borderRadius: "10px",
              }}
            >
              {t("events.noEvents")}
            </Alert>
          ) : (
            <EventsGrid>
              {events.map((event) => {
                const isPast = new Date(event.date) < new Date();
                return (
                  <Grid item xs={8} md={4} key={event.id}>
                    <MuiCard
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onClick={() => navigate(`/events/${event._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <Box
                        sx={{
                          height: 200,
                          backgroundImage: `url(${
                            event.image ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNK7-n-r_w_qCEIjsnu8VXMBamUkSmLUr9Eg&s"
                          })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "4px 4px 0 0",
                        }}
                      />
                      <CardContent>
                        <Chip
                          label={event.tag}
                          color="warning"
                          size="small"
                          sx={{ textTransform: "capitalize", mb: 1 }}
                        />
                        <Typography variant="subtitle2" color="text.secondary">
                          {event.date} • {event.time}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <EventIcon fontSize="small" />
                          <Typography variant="body2">
                            {event.date} | {event.time}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <FaMapMarkerAlt />
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Box>
                        {/* <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <PeopleIcon fontSize="small" />
                      <Typography variant="body2">
                        {announcement.attendees}
                      </Typography>
                    </Box> */}
                        {/* <MuiButton
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        backgroundColor: "#f97316",
                        "&:hover": {
                          backgroundColor: "#ea580c",
                        },
                      }}
                    >
                      Register Now
                    </MuiButton> */}
                      </CardContent>
                    </MuiCard>
                  </Grid>
                );
              })}
            </EventsGrid>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventsList;
