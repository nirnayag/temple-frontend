import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  TypographyProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { t } from '../utils/translationUtils';

// Import services
import { eventService, announcementService, prasadamService, templeService } from '../services/api';

// Styled components for custom elements
const HeroBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '500px',
  backgroundImage: `url('https://placehold.co/1200x500/800020/FFFFFF?text=Sri+Siva+Gnana+Deepika+Mahotsavam')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  [theme.breakpoints.down('md')]: {
    height: '300px',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  width: '100%',
  padding: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#E2DFD2',
  borderRadius: '15px',
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  }
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: '#d35400',
  color: '#E2DFD2',
  '& .MuiCardHeader-title': {
    fontWeight: 'bold'
  },
  '& .MuiCardHeader-subheader': {
    color: '#E2DFD2'
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: '1.5rem',
  '& .MuiTypography-root': {
    color: '#4a4a4a'
  }
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: '#d35400',
  color: '#E2DFD2',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem',
  fontSize: '2rem'
}));

const SectionTitle = styled((props: TypographyProps) => (
  <Typography {...props} />
))(({ theme }) => ({
  color: '#d35400',
  textAlign: 'center',
  marginBottom: '2rem',
  fontWeight: 'bold',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    backgroundColor: '#d35400'
  }
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
    case 'HomeIcon':
      return <HomeIcon fontSize="large" />;
    case 'EventIcon':
      return <EventIcon fontSize="large" />;
    case 'OfferIcon':
      return <OfferIcon fontSize="large" />;
    case 'InfoIcon':
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
  const [loadingAnnouncements, setLoadingAnnouncements] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingPrasadam, setLoadingPrasadam] = useState<boolean>(true);
  const [loadingPrasadamInfo, setLoadingPrasadamInfo] = useState<boolean>(true);
  const [loadingFeatures, setLoadingFeatures] = useState<boolean>(true);
  const [loadingSections, setLoadingSections] = useState<boolean>(true);
  const [loadingTempleInfo, setLoadingTempleInfo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Improved API error handling with detailed logging
  const handleApiError = (error: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>, errorMessage: string) => {
    console.error(`${errorMessage}:`, error);
    
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('API Request Error - No Response:', error.request);
    } else {
      console.error('API Setup Error:', error.message);
    }
    
    setError(t(errorMessage) + (error.response ? ` (${error.response.status})` : ''));
    setLoading(false);
  };

  // Fetch temple information
  useEffect(() => {
    const fetchTempleInfo = async () => {
      try {
        console.log('Fetching temple info...');
        const response = await templeService.getInfo();
        setTempleInfo(response.data);
        setLoadingTempleInfo(false);
      } catch (err) {
        handleApiError(err, setLoadingTempleInfo, 'home.errors.templeInfo');
      }
    };

    fetchTempleInfo();
  }, []);

  // Fetch features
  // useEffect(() => {
  //   const fetchFeatures = async () => {
  //     try {
  //       console.log('Fetching features...');
  //       const response = await templeService.getFeatures();
  //       setFeatures(response.data);
  //       setLoadingFeatures(false);
  //     } catch (err) {
  //       handleApiError(err, setLoadingFeatures, 'home.errors.features');
  //     }
  //   };

  //   fetchFeatures();
  // }, []);

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
        console.log('Fetching announcements...');
        const response = await announcementService.getAll();
        setAnnouncements(response.data);
        setLoadingAnnouncements(false);
      } catch (err) {
        handleApiError(err, setLoadingAnnouncements, 'home.errors.announcements');
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const response = await eventService.getUpcoming();
        setUpcomingEvents(response.data);
        setLoadingEvents(false);
      } catch (err) {
        handleApiError(err, setLoadingEvents, 'home.errors.events');
      }
    };

    fetchEvents();
  }, []);

  // Fetch prasadam information
  // useEffect(() => {
  //   const fetchPrasadam = async () => {
  //     try {
  //       console.log('Fetching prasadam info...');
  //       const response = await prasadamService.getAll();
  //       setPrasadamInfo(response.data);
  //       setLoadingPrasadam(false);
  //     } catch (err) {
  //       handleApiError(err, setLoadingPrasadam, 'home.errors.prasadam');
  //     }
  //   };

  //   fetchPrasadam();
  // }, []);

  // Fetch prasadam general information
  // useEffect(() => {
  //   const fetchPrasadamInfo = async () => {
  //     try {
  //       console.log('Fetching prasadam general info...');
  //       const response = await prasadamService.getInfo();
  //       setPrasadamGeneralInfo(response.data);
  //       setLoadingPrasadamInfo(false);
  //     } catch (err) {
  //       handleApiError(err, setLoadingPrasadamInfo, 'home.errors.prasadamInfo');
  //     }
  //   };

  //   fetchPrasadamInfo();
  // }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(i18n.language === 'mr' ? 'mr-IN' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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

  return (
    <Box sx={{ bgcolor: '#E2DFD2' }}>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroContent>
          <Container>
            <Typography variant="h2" component="h1" gutterBottom>
              {templeInfo?.name || t('home.hero.title')}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {templeInfo?.tagline || t('home.hero.subtitle')}
            </Typography>
            <Button
              component={Link}
              to="/about"
              variant="contained"
              sx={{ 
                mt: 2,
                bgcolor: '#d35400',
                '&:hover': {
                  bgcolor: '#b34700'
                }
              }}
            >
              {t('home.hero.learnMore')}
            </Button>
          </Container>
        </HeroContent>
      </HeroBanner>

      {/* Features Section */}
      {/* <Container sx={{ py: 8 }}>
        <SectionTitle variant="h3">
          {t('home.features.title')}
        </SectionTitle>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature._id}>
              <StyledCard>
                <StyledCardContent sx={{ textAlign: 'center' }}>
                  <FeatureIcon>
                    {getIconComponent(feature.icon)}
                  </FeatureIcon>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container> */}

      {/* Announcements Section */}
      <Box sx={{ bgcolor: '#E2DFD2', py: 8 }}>
        <Container>
          <SectionTitle variant="h3">
            {t('home.announcements.title')}
          </SectionTitle>
          <Grid container spacing={4}>
            {announcements.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">{t('home.announcements.noAnnouncements')}</Alert>
              </Grid>
            ) : (
              announcements.map((announcement) => (
                <Grid item xs={12} md={6} key={announcement._id}>
                  <StyledCard>
                    <StyledCardHeader
                      title={announcement.title}
                      subheader={announcement.dateRange}
                    />
                    <StyledCardContent>
                      <Typography>
                        {announcement.description}
                      </Typography>
                      <Button
                        variant="text"
                        sx={{ 
                          mt: 2,
                          color: '#d35400',
                          '&:hover': {
                            color: '#b34700'
                          }
                        }}
                      >
                        {t('home.announcements.readMore')}
                      </Button>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Upcoming Events Section */}
      <Container sx={{ py: 8 }}>
        <SectionTitle variant="h3">
          {t('home.events.title')}
        </SectionTitle>
        <Grid container spacing={4}>
          {upcomingEvents.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">{t('home.events.noEvents')}</Alert>
            </Grid>
          ) : (
            upcomingEvents.map((event) => (
              <Grid item xs={12} md={6} key={event._id}>
                <StyledCard>
                  <StyledCardHeader
                    title={event.title}
                    subheader={`${formatDate(event.date)} - ${formatTime(event.startTime)}`}
                    action={
                      event.registrationRequired && (
                        <Chip
                          label={t('home.events.registrationRequired')}
                          sx={{ 
                            bgcolor: '#E2DFD2',
                            color: '#d35400',
                            fontWeight: 'bold'
                          }}
                          size="small"
                        />
                      )
                    }
                  />
                  <StyledCardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t('home.events.location')}: {event.location}
                    </Typography>
                    <Typography>
                      {event.description}
                    </Typography>
                    <Button
                      variant="text"
                      component={Link}
                      to="/events"
                      sx={{ 
                        mt: 2,
                        color: '#d35400',
                        '&:hover': {
                          color: '#b34700'
                        }
                      }}
                    >
                      {t('home.events.viewAll')}
                    </Button>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Prasadam Section */}
      {/* <Box sx={{ bgcolor: '#E2DFD2', py: 8 }}>
        <Container>
          <SectionTitle variant="h3">
            {t('home.prasadam.title')}
          </SectionTitle>
          {prasadamGeneralInfo && (
            <Typography paragraph sx={{ color: '#4a4a4a', textAlign: 'center', mb: 4 }}>
              {prasadamGeneralInfo.description}
            </Typography>
          )}
          <Grid container spacing={4}>
            {prasadamInfo.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">{t('home.prasadam.noPrasadam')}</Alert>
              </Grid>
            ) : (
              prasadamInfo.map((day) => (
                <Grid item xs={12} md={6} key={day._id}>
                  <StyledCard>
                    <StyledCardHeader
                      title={t(`common.days.${day.dayOfWeek.toLowerCase()}`)}
                      subheader={day.isAvailable ? t('home.prasadam.available') : t('home.prasadam.unavailable')}
                    />
                    <StyledCardContent>
                      <List>
                        {day.items.map((item, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText
                                primary={item.name}
                                secondary={item.description}
                                primaryTypographyProps={{ color: '#4a4a4a' }}
                                secondaryTypographyProps={{ color: '#666666' }}
                              />
                              {item.specialItem && (
                                <Chip
                                  label={t('home.prasadam.special')}
                                  sx={{ 
                                    bgcolor: '#E2DFD2',
                                    color: '#d35400',
                                    fontWeight: 'bold'
                                  }}
                                  size="small"
                                />
                              )}
                            </ListItem>
                            {index < day.items.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                      {day.notes && (
                        <Typography variant="body2" sx={{ mt: 2, color: '#666666' }}>
                          {t('home.prasadam.notes')}: {day.notes}
                        </Typography>
                      )}
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box> */}
    </Box>
  );
};

export default Home; 