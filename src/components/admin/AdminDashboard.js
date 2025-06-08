import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Alert,
  Tabs,
  Tab,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { devoteeService, eventService } from "../../services/api";
import authService from "../../services/auth";
import { useGetAllEvents } from "tanstack/Queries/events_tanstack";
import {
  useDeleteDevotee,
  useGetAllDevotees,
} from "tanstack/Queries/devotees_tanstack";
import { useGetProfile } from "tanstack/Queries/profile_tanstacks";
import { useDeleteEvent } from "tanstack/Queries/events_tanstack";
import { toast } from "react-toastify";
import EventDialogForm from "./EventDialogForm";
import DevoteeDialogForm from "components/devotees/DevoteeDialogForm";
const AdminDashboard = () => {
  const {
    data: adminProfile,
    isLoading: isAdminLoading,
    error: adminError,
  } = useGetProfile();
  const {
    data: eventData,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useGetAllEvents();
  const {
    data: devoteeData,
    isLoading: isDevoteesLoading,
    error: devoteesError,
  } = useGetAllDevotees();
  const { mutate: deleteEvent, isPending: deleteEventPending } =
    useDeleteEvent();
  const { mutate: deleteDevotee, isPending: deleteDevoteePending } =
    useDeleteDevotee();
  const isLoading = isAdminLoading || isEventsLoading || isDevoteesLoading;
  const error = adminError || eventsError || devoteesError;
  const navigate = useNavigate();
  // const [adminProfile, setAdminProfile] = useState(null);
  // const [devotees, setDevotees] = useState([]);
  const [openEventFormDialog, setEventFormOpenDialog] = useState(false);
  const [openAddDevoteeForm, setOpenAddDevoteeForm] = useState(false);
  const [donations, setDonations] = useState([]);
  const [eventDataforEdit, setEventDataforEdit] = useState(null);
  const [devoteeDataforEdit, setDevoteeDataforEdit] = useState(null);
  const [stats, setStats] = useState({
    devotees: 0,
    events: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    // fetchData();
    // Extract donations from all devotees
    if (!isLoading && devoteeData && eventData) {
      const allDonations = [];
      devoteeData.forEach((devotee) => {
        if (devotee.donationHistory && devotee.donationHistory.length > 0) {
          devotee.donationHistory.forEach((donation) => {
            allDonations.push({
              ...donation,
              devoteeId: devotee._id,
              devoteeName: devotee.name,
            });
          });
        }
      });

      // Sort donations by date (newest first)
      allDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDonations(allDonations);

      // Calculate stats
      const now = new Date();
      const upcomingEventsCount = eventData?.filter(
        (event) => new Date(event.date) >= now
      )?.length;

      setStats({
        devotees: devoteeData.length,
        events: eventData?.length,
        upcomingEvents: upcomingEventsCount,
      });
    }
  }, [adminProfile, eventData, devoteeData, isLoading]);

  // const fetchData = async () => {
  //   try {
  //     // setLoading(true);

  //     // Get admin profile
  //     const profileData = await authService.getProfile();
  //     // setAdminProfile(profileData);

  //     // This below eventData is fetched using the custom hook useGetAllEvents
  //     console.log("eventData from custom hook:", eventData);

  //     setEvents(eventData);

  //     // Get devotees
  //     const devoteesResponse = await devoteeService.getAll();
  //     const devoteeData = devoteesResponse.data;
  //     // setDevotees(devoteeData);

  //     // Extract donations from all devotees
  //     const allDonations = [];
  //     devoteeData.forEach((devotee) => {
  //       if (devotee.donationHistory && devotee.donationHistory.length > 0) {
  //         devotee.donationHistory.forEach((donation) => {
  //           allDonations.push({
  //             ...donation,
  //             devoteeId: devotee._id,
  //             devoteeName: devotee.name,
  //           });
  //         });
  //       }
  //     });

  //     // Sort donations by date (newest first)
  //     allDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
  //     setDonations(allDonations);

  //     // Calculate stats
  //     const now = new Date();
  //     const upcomingEventsCount = eventData?.filter(
  //       (event) => new Date(event.date) >= now
  //     )?.length;

  //     setStats({
  //       devotees: devoteeData.length,
  //       events: eventData?.length,
  //       upcomingEvents: upcomingEventsCount,
  //     });

  //     setError(null);
  //   } catch (err) {
  //     console.error("Error fetching admin dashboard data:", err);
  //     setError("Failed to load admin dashboard data. Please try again.");
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  function handleEventDelete(eventId) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId, {
        onSuccess: () => {
          console.log("Event deleted successfully");
        },
      });
    }
  }

  function handleEventEdit(yourEventData) {
    setEventDataforEdit(yourEventData);
    setEventFormOpenDialog(true);
  }

  function handleDevoteeEdit(selectedDevoteeData) {
    setOpenAddDevoteeForm(true);
    setDevoteeDataforEdit(selectedDevoteeData);
  }

  function handleDevoteeDelete(id) {
    if (window.confirm("Are you sure you want to delete this devotee?")) {
      deleteDevotee(
        { id },
        {
          onSuccess: () => {
            toast.success("Devotee has been deleted");
          },
        }
      );
    }
  }

  function handleCreate() {
    console.log("event create clicked");
  }

  if (isLoading) {
    return <div className="text-center py-5">Loading admin dashboard...</div>;
  }

  // if (error) {
  //   return (
  //     <Container className="mt-4">
  //       <Alert variant="danger">
  //         {error}
  //         <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchData}>
  //           Try Again
  //         </Button>
  //       </Alert>
  //     </Container>
  //   );
  // }

  return (
    <Container fluid className="my-4">
      {/* <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          <p className="text-muted">
            Welcome,{" "}
            {adminProfile?.devotee?.name || adminProfile?.user?.username}
          </p>
        </Col>
        <Col xs="auto">
          <Button
            as={false}
            variant="success"
            className="me-2"
            onClick={() => setEventFormOpenDialog(true)}
          >
            Create Event
          </Button>
          <Button
            as={false}
            variant="primary"
            onClick={() => setOpenAddDevoteeForm(true)}
          >
            Add Devotee
          </Button>
        </Col>
      </Row> */}

      <Row className="mb-4 align-items-center">
  <Col>
    <h2
      style={{
        color: "#d35400",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 700,
        fontSize: "2.2rem",
        marginBottom: "0.3rem",
      }}
    >
      Admin Dashboard
    </h2>
    <p
      style={{
        color: "#a84300",
        fontFamily: "'Merriweather', serif",
        fontSize: "1.1rem",
        marginBottom: 0,
      }}
    >
      Welcome,{" "}
      <strong>
        {adminProfile?.devotee?.name || adminProfile?.user?.username}
      </strong>
    </p>
  </Col>

  <Col xs="auto">
    <Button
      variant="success"
      className="me-2"
      onClick={() => setEventFormOpenDialog(true)}
      style={{ fontWeight: "bold", borderRadius: "8px" }}
    >
      Create Event
    </Button>
    <Button
      variant="primary"
      onClick={() => setOpenAddDevoteeForm(true)}
      style={{ fontWeight: "bold", borderRadius: "8px" }}
    >
      Add Devotee
    </Button>
  </Col>
</Row>



      {/* <Row className="mb-4">
        <Col md={4}>
          <Card className="stats-card bg-primary text-white mb-4">
            <Card.Body>
              <Card.Title>Total Devotees</Card.Title>
              <h1>{stats.devotees}</h1>
              <Button
                as={Link}
                to="/admin/devotees"
                variant="outline-light"
                size="sm"
              >
                View All Devotees
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card bg-success text-white mb-4">
            <Card.Body>
              <Card.Title>Total Events</Card.Title>
              <h1>{stats.events}</h1>
              <Button
                as={Link}
                to="/admin/events"
                variant="outline-light"
                size="sm"
              >
                View All Events
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card bg-info text-white mb-4">
            <Card.Body>
              <Card.Title>Upcoming Events</Card.Title>
              <h1>{stats.upcomingEvents}</h1>
              <Button
                as={Link}
                to="/admin/events"
                variant="outline-light"
                size="sm"
              >
                View All Events
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
<Row className="mb-4">
  {/* Total Devotees */}
  <Col md={4}>
    <Card
      className="stats-card text-white mb-4"
      style={{
        background: "linear-gradient(to right, #f39c12, #e67e22)",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Card.Body>
        <Card.Title className="fw-semibold">Total Devotees</Card.Title>
        <h1 className="display-6 fw-bold">{stats.devotees}</h1>
        <Button
        
          to="/admin/devotees"
          variant="outline-light"
          size="sm"
        >
          View All Devotees
        </Button>
      </Card.Body>
    </Card>
  </Col>

  {/* Total Events */}
  <Col md={4}>
    <Card
      className="stats-card text-white mb-4"
      style={{
        background: "linear-gradient(to right, #f39c12, #e67e22)",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Card.Body>
        <Card.Title className="fw-semibold">Total Events</Card.Title>
        <h1 className="display-6 fw-bold">{stats.events}</h1>
        <Button
          as={Link}
          to="/admin/events"
          variant="outline-light"
          size="sm"
        >
          View All Events
        </Button>
      </Card.Body>
    </Card>
  </Col>

  {/* Upcoming Events */}
  <Col md={4}>
    <Card
      className="stats-card text-white mb-4"
      style={{
        background: "linear-gradient(to right, #f39c12, #e67e22)",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Card.Body>
        <Card.Title className="fw-semibold">Upcoming Events</Card.Title>
        <h1 className="display-6 fw-bold">{stats.upcomingEvents}</h1>
        <Button
          as={Link}
          to="/admin/events"
          variant="outline-light"
          size="sm"
        >
          View All Events
        </Button>
      </Card.Body>
    </Card>
  </Col>
</Row>

        
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="devotees" className="mb-3">
            <Tab eventKey="devotees" title="Recent Devotees">
              {devoteeData.length === 0 ? (
                <Alert variant="info">No devotees found.</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Membership</th>
                        <th>Member Since</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devoteeData.slice(0, 5).map((devotee) => (
                        <tr key={devotee._id}>
                          <td>{devotee.name}</td>
                          <td>{devotee.email}</td>
                          <td>{devotee.phone || "N/A"}</td>
                          <td>
                            <Badge
                              bg={
                                devotee.membershipType === "vip"
                                  ? "danger"
                                  : devotee.membershipType === "lifetime"
                                  ? "success"
                                  : "primary"
                              }
                            >
                              {devotee.membershipType}
                            </Badge>
                          </td>
                          <td>
                            {new Date(devotee.memberSince).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              as={false}
                              variant="primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleDevoteeEdit(devotee)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => handleDevoteeDelete(devotee._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {devoteeData.length > 5 && (
                <div className="text-center mt-3">
                  <Button
                    as={Link}
                    to="/admin/devotees"
                    variant="outline-primary"
                  >
                    View All Devotees
                  </Button>
                </div>
              )}
            </Tab>

            <Tab eventKey="events" title="Recent Events">
              {eventData.length === 0 ? (
                <Alert variant="info">No events found.</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventData.slice(0, 5).map((event) => (
                        <tr key={event._id}>
                          <td>{event.title}</td>
                          <td>
                            {new Date(event.startDate).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(event.endDate).toLocaleDateString()}
                          </td>

                          <td>
                            {event.startTime} - {event.endTime}
                          </td>
                          <td>{event.location}</td>
                          <td>
                            <Badge
                              bg={
                                event.eventType === "puja"
                                  ? "primary"
                                  : event.eventType === "festival"
                                  ? "success"
                                  : event.eventType === "discourse"
                                  ? "info"
                                  : event.eventType === "community"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {event.eventType}
                            </Badge>
                          </td>
                          <td>{event.registeredDevotees?.length || 0}</td>
                          <td>
                            <Button
                              as={false}
                              variant="primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEventEdit(event)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => handleEventDelete(event._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {eventData.length > 5 && (
                <div className="text-center mt-3">
                  <Button
                    as={Link}
                    to="/admin/events"
                    variant="outline-primary"
                  >
                    View All Events
                  </Button>
                </div>
              )}
            </Tab>

            <Tab eventKey="donations" title="Recent Donations">
              {donations.length === 0 ? (
                <Alert variant="info">No donations found.</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Devotee</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 5).map((donation, index) => (
                        <tr key={index}>
                          <td>{donation.devoteeName}</td>
                          <td>
                            {new Date(donation.date).toLocaleDateString()}
                          </td>
                          <td>${donation.amount.toFixed(2)}</td>
                          <td>{donation.purpose || "General Donation"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {donations.length > 5 && (
                <div className="text-center mt-3">
                  <Button
                    as={Link}
                    to="/admin/donations"
                    variant="outline-primary"
                  >
                    View All Donations
                  </Button>
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      <EventDialogForm
        open={openEventFormDialog}
        onClose={() => setEventFormOpenDialog(false)}
        eventDataforEdit={eventDataforEdit}
      />
      <DevoteeDialogForm
        open={openAddDevoteeForm}
        onClose={() => {
          setOpenAddDevoteeForm(false);
          setEventDataforEdit(null);
        }}
        devoteeDataforEdit={devoteeDataforEdit}
      />
    </Container>
  );
};

export default AdminDashboard;
