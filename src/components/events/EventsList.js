import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Alert,
  Form,
  Row,
  Col,
  Badge,
  Container,
} from "react-bootstrap";
import { eventService } from "../../services/api";
import authService from "../../services/auth";
import { useTranslation } from "react-i18next";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
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
      </Container>
    );
  }

  return (
    <Container fluid className="px-4">
      <Card
        className="border-0 shadow-sm mb-5"
        style={{ backgroundColor: "#f5e6d3", borderRadius: "15px" }}
      >
        <Card.Header
          className="bg-temple text-white"
          style={{ backgroundColor: "#d35400", borderRadius: "15px 15px 0 0" }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "red" }}
          >
            <h3 className="mb-0">{t("events.title")}</h3>
          </div>
        </Card.Header>
        <Card.Body
          style={{
            backgroundColor: "#f5e6d3",
            color: "#4a4a4a",
            padding: "2rem",
          }}
        >
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

          <FilterContainer>
            <div className="d-flex align-items-center mb-3">
              <FaFilter className="me-2" />
              <h5 className="mb-0">{t("events.filter")}</h5>
            </div>
            <Form.Select
              value={filter}
              onChange={handleFilterChange}
              className="shadow-sm"
            >
              <option value="all">{t("events.filters.all")}</option>
              <option value="upcoming">{t("events.filters.upcoming")}</option>
              <option value="past">{t("events.filters.past")}</option>
              <option value="amavsya">{t("events.filters.amavsya")}</option>
              <option value="festival">{t("events.filters.festival")}</option>
              <option value="discourse">{t("events.filters.discourse")}</option>
              <option value="community">{t("events.filters.community")}</option>
            </Form.Select>
          </FilterContainer>

          {sortedEvents.length === 0 ? (
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
              {sortedEvents.map((event) => {
                const isPast = new Date(event.date) < new Date();

                return (
                  <StyledCard
                    key={event._id}
                    className={isPast ? "bg-light" : ""}
                  >
                    <Card.Header
                      className={isPast ? "bg-secondary" : "bg-primary"}
                      style={{
                        backgroundColor: isPast ? "#e0c9a6" : "#d35400",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="mb-0">{event.title}</h5>
                        <EventTypeBadge bg={getEventTypeColor(event.eventType)}>
                          {t(`events.types.${event.eventType}`)}
                        </EventTypeBadge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <EventIcon>
                        <FaCalendarAlt />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </EventIcon>
                      <EventIcon>
                        <FaClock />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </EventIcon>
                      <EventIcon>
                        <FaMapMarkerAlt />
                        <span>{event.location}</span>
                      </EventIcon>
                      {event.priest && (
                        <EventIcon>
                          <FaUserAlt />
                          <span>{event.priest}</span>
                        </EventIcon>
                      )}
                      <p className="mt-3">{event.description}</p>

                      <CardFooter>
                        <div className="d-flex justify-content-between align-items-center">
                          {!isPast && isLoggedIn && (
                            <Button
                              variant="primary"
                              size="sm"
                              style={{
                                backgroundColor: "#d35400",
                                borderColor: "#d35400",
                                borderRadius: "8px",
                                padding: "0.5rem 1rem",
                              }}
                            >
                              {t("events.register")}
                            </Button>
                          )}

                          {isPast && (
                            <Badge
                              bg="secondary"
                              style={{
                                backgroundColor: "#f5e6d3",
                                color: "#d35400",
                                borderRadius: "8px",
                                padding: "0.5rem 1rem",
                                border: "1px solid #d35400",
                              }}
                            >
                              {t("events.pastEvent")}
                            </Badge>
                          )}
                        </div>
                      </CardFooter>
                    </Card.Body>
                  </StyledCard>
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
