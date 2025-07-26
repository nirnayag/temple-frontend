import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
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
}

interface AnnouncementProps {
  _id: string;
  title: string;
  dateRange: string;
  description: string;
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
  bannerImage: string;
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
        const response = await eventService.getUpcoming();
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

  const dummyUpcomingEvents = [
    {
      id: 1,
      tag: "festival",
      date: "August 15, 2025",
      time: "6:00 AM - 10:00 PM",
      title: "Krishna Janmashtami",
      description:
        " Gokulashtami, is an annual Hindu festival that celebrates the birth of Krishna, the eighth avatar of Vishnu. Krishna has been identified as supreme God and the source of all avatars.",
      location: "Main Temple Hall",
      attendees: "450 / 500 registered",
      image:
        "https://i.pinimg.com/736x/5f/d7/38/5fd73819e1f731b6d80edf848e439d5d.jpg",
    },
    {
      id: 2,
      tag: "spiritual",
      date: "August 18, 2025",
      time: "7:00 AM - 9:00 AM",
      title: "Satsang & Meditation",
      description:
        "Join our weekly spiritual gathering for meditation, devotional singing, and enlightening discussions on ancient wisdom and modern living.",
      location: "Meditation Hall",
      attendees: "20 / 100 registered",
      image:
        "https://www.shutterstock.com/image-vector/holy-man-sadhu-sitting-meditating-260nw-2383039899.jpg",
    },
    {
      id: 3,
      tag: "Festival",
      date: "August 27, 2025",
      time: "7:30 AM - 11:00 AM",
      title: "Ganesh Chaturti",
      description:
        "Ganesh Chaturthi is a vibrant and widely celebrated Hindu festival marking the birth of Lord Ganesha, a divine being known as the remover of obstacles and the god of wisdom, prosperity, and good fortune. ",
      location: "Mandap",
      attendees: "100 / 100 registered",
      image:
        "https://www.shutterstock.com/image-vector/ganesh-chaturthi-marathi-hindi-calligraphy-260nw-2358015643.jpg",
    },
  ];
  const dummyAnnouncements = [
    {
      id: 1,
      tag: "Important",
      date: "Dec 28, 2024",
      title: "Special Aarti on New Year",
      description:
        "Join us for a special New Year blessing ceremony. Experience divine grace as we welcome 2025 with traditional prayers and prasadam distribution.",
      color: "orange",
      icon: <CampaignIcon fontSize="small" />,
    },
    {
      id: 2,
      tag: "Event",
      date: "Dec 25, 2024",
      title: "Donation Drive for Community Kitchen",
      description:
        "Help us serve free meals to devotees and the needy. Your contribution will help us expand our daily prasadam distribution program.",
      color: "red",
      icon: <EventNoteIcon fontSize="small" />,
    },
    {
      id: 3,
      tag: "Notice",
      date: "Dec 20, 2024",
      title: "Updated Temple Timings",
      description:
        "Please note the updated darshan timings for the winter season. Morning aarti starts at 6:00 AM and evening aarti at 7:00 PM.",
      color: "yellow",
      icon: <InfoIcon fontSize="small" />,
    },
  ];
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
              mt={-6}
              ml={-6}
              variant="h2"
              component="h1"
              gutterBottom
            >
              {t("home.hero.title")}
            </Typography>
            <Typography ml={-6} variant="h5" gutterBottom>
              {templeInfo?.tagline || t("home.hero.subtitle")}
            </Typography>
            <Button
              component={RouterLink}
              to="/about"
              variant="contained"
              sx={{
                mt: 2,
                ml: -6,
                bgcolor: "#d35400",
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
            {dummyUpcomingEvents.map((announcement) => (
              <Grid item xs={8} md={4} key={announcement.id}>
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
                      backgroundImage: `url(${announcement.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                  <CardContent>
                    <Chip
                      label={announcement.tag}
                      color="warning"
                      size="small"
                      sx={{ textTransform: "capitalize", mb: 1 }}
                    />
                    <Typography variant="subtitle2" color="text.secondary">
                      {announcement.date} • {announcement.time}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {announcement.description}
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
                        {announcement.date} | {announcement.time}
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
                        {announcement.location}
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
                    {/* <Button
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
                    </Button> */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
            {dummyAnnouncements.map((item) => (
              <Grid item xs={12} md={4} key={item.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderLeft: `4px solid ${getColor(item.tag)}`,
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
                          {item.icon}
                          {item.tag}
                        </Box>
                      }
                      size="small"
                      sx={{
                        backgroundColor: getColor(item.tag),
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px",
                        px: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>
                  <CardContent sx={{ px: 0 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      color="#7f1d1d"
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {item.description}
                    </Typography>
                    {/* <Link
                      underline="hover"
                      sx={{
                        color: "#d35400",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#b34700",
                        },
                      }}
                    >
                      Read More
                    </Link> */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
