import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Home as HomeIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { t } from "../utils/translationUtils";
import RoomIcon from "@mui/icons-material/Room";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
// Import services
import {
  eventService,
  announcementService,
  prasadamService,
  templeService,
} from "../services/api";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CampaignIcon from "@mui/icons-material/Campaign";
import Link from "@mui/material/Link";

// Styled components for custom elements
const HeroBanner = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "500px",
  backgroundImage: `url('/templeHero.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  [theme.breakpoints.down("md")]: {
    height: "300px",
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  textAlign: "left",
  width: "100%",
  padding: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#E2DFD2",
  borderRadius: "15px",
  overflow: "hidden",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: "#d35400",
  color: "#E2DFD2",
  "& .MuiCardHeader-title": {
    fontWeight: "bold",
  },
  "& .MuiCardHeader-subheader": {
    color: "#E2DFD2",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: "1.5rem",
  "& .MuiTypography-root": {
    color: "#4a4a4a",
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: "#d35400",
  color: "#E2DFD2",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 1.5rem",
  fontSize: "2rem",
}));

const SectionTitle = styled((props: TypographyProps) => (
  <Typography {...props} />
))(({ theme }) => ({
  color: "#d35400",
  textAlign: "center",
  marginBottom: "2rem",
  fontWeight: "bold",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "3px",
    backgroundColor: "#d35400",
  },
}));

interface FeatureProps {
  _id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface EventProps {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  eventType?: string;
  registrationRequired?: boolean;
  description: string;
  imageUrl?: string;
}

interface AnnouncementProps {
  _id: string;
  title: string;
  dateRange: string;
  description: string;
  type?: string;
}

interface PrasadamItemProps {
  name: string;
  description?: string;
  specialItem?: boolean;
}

interface PrasadamProps {
  _id: string;
  dayOfWeek: string;
  items: PrasadamItemProps[];
  isAvailable: boolean;
  notes?: string;
}

interface PrasadamInfoProps {
  _id: string;
  description: string;
  updatedAt: string;
  __v?: number;
}

interface SectionProps {
  _id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface TempleProps {
  _id: string;
  name: string;
  tagline: string;
  imageUrl: string;
}

// Helper function to get appropriate icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "HomeIcon":
      return <HomeIcon fontSize="large" />;
    case "EventIcon":
      return <EventIcon fontSize="large" />;
    case "OfferIcon":
      return <OfferIcon fontSize="large" />;
    case "InfoIcon":
      return <InfoIcon fontSize="large" />;
    default:
      return <InfoIcon fontSize="large" />;
  }
};

const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // State for data from backend
  const [announcements, setAnnouncements] = useState<AnnouncementProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventProps[]>([]);
  // const [prasadamInfo, setPrasadamInfo] = useState<PrasadamProps[]>([]);
  // const [prasadamGeneralInfo, setPrasadamGeneralInfo] = useState<PrasadamInfoProps | null>(null);
  // const [features, setFeatures] = useState<FeatureProps[]>([]);
  // const [sections, setSections] = useState<SectionProps[]>([]);
  const [templeInfo, setTempleInfo] = useState<TempleProps | null>(null);
  // Loading and error states
  const [loadingAnnouncements, setLoadingAnnouncements] =
    useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingFeatures, setLoadingFeatures] = useState<boolean>(true);
  const [loadingSections, setLoadingSections] = useState<boolean>(true);
  const [loadingTempleInfo, setLoadingTempleInfo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Improved API error handling with detailed logging
  const handleApiError = (
    error: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    errorMessage: string
  ) => {
    console.error(`${errorMessage}:`, error);

    if (error.response) {
      console.error("API Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("API Request Error - No Response:", error.request);
    } else {
      console.error("API Setup Error:", error.message);
    }

    setError(
      t(errorMessage) + (error.response ? ` (${error.response.status})` : "")
    );
    setLoading(false);
  };

  // Fetch temple information
  useEffect(() => {
    const fetchTempleInfo = async () => {
      try {
        console.log("Fetching temple info...");
        const response = await templeService.getInfo();
        setTempleInfo(response.data);
        setLoadingTempleInfo(false);
      } catch (err) {
        handleApiError(err, setLoadingTempleInfo, "home.errors.templeInfo");
      }
    };

    fetchTempleInfo();
  }, []);

  // Fetch sections
  // useEffect(() => {
  //   const fetchSections = async () => {
  //     try {
  //       console.log('Fetching sections...');
  //       const response = await templeService.getSections();
  //       setSections(response.data);
  //       setLoadingSections(false);
  //     } catch (err) {
  //       handleApiError(err, setLoadingSections, 'home.errors.sections');
  //     }
  //   };

  //   fetchSections();
  // }, []);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        console.log("Fetching announcements...");
        const response = await announcementService.getAll();
        setAnnouncements(response.data);
        setLoadingAnnouncements(false);
      } catch (err) {
        handleApiError(
          err,
          setLoadingAnnouncements,
          "home.errors.announcements"
        );
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events...");
        const response = await eventService.getAll();
        setUpcomingEvents(response.data);
        setLoadingEvents(false);
      } catch (err) {
        handleApiError(err, setLoadingEvents, "home.errors.events");
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "mr" ? "mr-IN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(i18n.language === "mr" ? "mr-IN" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const getColor = (tag: any) => {
    switch (tag) {
      case "Important":
        return "#f97316";
      case "Event":
        return "#b91c1c";
      case "Notice":
        return "#facc15";
      default:
        return "#ccc";
    }
  };
  return (
    <Box sx={{ bgcolor: "#E2DFD2" }}>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroContent>
          <Container>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: {
                  xs: "2rem", // small screens
                  sm: "2.5rem",
                  md: "3rem", // medium screens
                  lg: "4rem", // large screens
                },
                mb: 2,
              }}
            >
              {t("home.hero.title")}
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.25rem",
                  md: "1.5rem",
                },
                mb: 3,
              }}
            >
              {templeInfo?.tagline || t("home.hero.subtitle")}
            </Typography>

            <Button
              component={RouterLink}
              to="/donate"
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#d35400",
                px: 3,
                py: 1.5,
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
                "&:hover": {
                  bgcolor: "#b34700",
                },
              }}
            >
              {t("home.hero.donate")}
            </Button>
          </Container>
        </HeroContent>
      </HeroBanner>

      {/* Upcoming Events */}
      {/* <Box sx={{ bgcolor: "#E2DFD2", py: 8, backgroundColor: "red" }}>
        <Container>
          <SectionTitle variant="h3">
            {t("home.announcements.title")}
          </SectionTitle>
          <Grid container spacing={4}>
            {announcements.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">
                  {t("home.announcements.noAnnouncements")}
                </Alert>
              </Grid>
            ) : (
              announcements?.map((announcement) => (
                <Grid item xs={12} md={6} key={announcement._id}>
                  <StyledCard>
                    <StyledCardHeader
                      title={announcement.title}
                      subheader={announcement.dateRange}
                    />
                    <StyledCardContent>
                      <Typography>{announcement.description}</Typography>
                      <Button
                        variant="text"
                        sx={{
                          mt: 2,
                          color: "#d35400",
                          "&:hover": {
                            color: "#b34700",
                          },
                        }}
                      >
                        {t("home.announcements.readMore")}
                      </Button>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box> */}
      <Box sx={{ bgcolor: "#E2DFD2", py: 8 }}>
        <Container>
          <SectionTitle variant="h3">{t("home.events.title")}</SectionTitle>
          <Grid container spacing={4}>
            {loadingEvents ? (
              // Shimmer loader for events
              Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} sm={8} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px 4px 0 0",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          height: 20,
                          backgroundColor: "#f0f0f0",
                          mb: 1,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 16,
                          backgroundColor: "#f0f0f0",
                          mb: 1,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 24,
                          backgroundColor: "#f0f0f0",
                          mb: 1,
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          height: 60,
                          backgroundColor: "#f0f0f0",
                          borderRadius: 1,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : upcomingEvents.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">{t("home.events.noEvents")}</Alert>
              </Grid>
            ) : (
              upcomingEvents.map((event) => (
                <Grid item xs={12} sm={8} md={4} key={event._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      },
                    }}
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <Box
                      sx={{
                        height: 200,
                        backgroundImage: `url(${
                          event.imageUrl ||
                          "http://localhost:4000/uploads/events/event-175469175965461546597.jpg"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                    <CardContent>
                      <Chip
                        label={event.eventType || "event"}
                        color="warning"
                        size="small"
                        sx={{ textTransform: "capitalize", mb: 1 }}
                      />
                      {/* <Typography variant="subtitle2" color="text.secondary">
                        {formatDate(event.date)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </Typography> */}
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
                          {formatDate(event.date)} |{" "}
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
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
                        <RoomIcon fontSize="small" />
                        <Typography variant="body2">
                          {event.location}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PaymentIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event._id}/register`);
                        }}
                        sx={{
                          background:
                            "linear-gradient(90deg, #f97316, #f59e0b)", // saffron to golden
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                          textTransform: "none",
                          fontSize: "1rem",
                          py: 1.2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #ea580c, #d97706)",
                            boxShadow: "0px 6px 16px rgba(249, 115, 22, 0.6)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Register & Pay
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
      {/* Announcement Sections */}
      <Box sx={{ bgcolor: "#E2DFD2", py: 6 }}>
        <Container>
          <SectionTitle variant="h3">
            {t("home.announcements.title")}
          </SectionTitle>

          <Grid container spacing={4}>
            {loadingAnnouncements ? (
              // Shimmer loader for announcements
              Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      backgroundColor: "#fff7ed",
                      px: 2,
                      pt: 2,
                      pb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        height: 20,
                        backgroundColor: "#f0f0f0",
                        mb: 2,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        height: 24,
                        backgroundColor: "#f0f0f0",
                        mb: 1,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        height: 60,
                        backgroundColor: "#f0f0f0",
                        mb: 2,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        height: 16,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 1,
                      }}
                    />
                  </Card>
                </Grid>
              ))
            ) : announcements.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">
                  {t("home.announcements.noAnnouncements")}
                </Alert>
              </Grid>
            ) : (
              announcements.map((announcement) => (
                <Grid item xs={12} md={4} key={announcement._id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderLeft: `4px solid ${getColor(
                        announcement.type || "Notice"
                      )}`,
                      borderRadius: 2,
                      backgroundColor: "#fff7ed",
                      px: 2,
                      pt: 2,
                      pb: 3,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Chip
                        label={
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <InfoIcon fontSize="small" />
                            {announcement.type || "Notice"}
                          </Box>
                        }
                        size="small"
                        sx={{
                          backgroundColor: getColor(
                            announcement.type || "Notice"
                          ),
                          color: "#fff",
                          fontWeight: 600,
                          borderRadius: "8px",
                          px: 1,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {announcement.dateRange}
                      </Typography>
                    </Box>
                    <CardContent sx={{ px: 0 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        color="#7f1d1d"
                      >
                        {announcement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {announcement.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Upcoming Events Section */}
      {/* <Container sx={{ py: 8 }}>
        <SectionTitle variant="h3">{t("home.events.title")}</SectionTitle>
        <Grid container spacing={4}>
          {upcomingEvents.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">{t("home.events.noEvents")}</Alert>
            </Grid>
          ) : (
            upcomingEvents.map((event) => (
              <Grid item xs={12} md={6} key={event._id}>
                <StyledCard>
                  <StyledCardHeader
                    title={event.title}
                    subheader={`${formatDate(event.date)} - ${formatTime(
                      event.startTime
                    )}`}
                    action={
                      event.registrationRequired && (
                        <Chip
                          label={t("home.events.registrationRequired")}
                          sx={{
                            bgcolor: "#E2DFD2",
                            color: "#d35400",
                            fontWeight: "bold",
                          }}
                          size="small"
                        />
                      )
                    }
                  />
                  <StyledCardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("home.events.location")}: {event.location}
                    </Typography>
                    <Typography>{event.description}</Typography>
                    <Button
                      variant="text"
                      component={RouterLink}
                      to="/events"
                      sx={{
                        mt: 2,
                        color: "#d35400",
                        "&:hover": {
                          color: "#b34700",
                        },
                      }}
                    >
                      {t("home.events.viewAll")}
                    </Button>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            ))
          )}
        </Grid>
      </Container> */}
    </Box>
  );
};

export default Home;
