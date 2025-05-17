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
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon,
  Info as InfoIcon
} from '@mui/icons-material';

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

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem',
  fontSize: '2rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(6),
  color: theme.palette.primary.main,
  textAlign: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    backgroundColor: theme.palette.secondary.main,
  },
})) as typeof Typography;

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
  // State for data from backend
  const [announcements, setAnnouncements] = useState<AnnouncementProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventProps[]>([]);
  const [prasadamInfo, setPrasadamInfo] = useState<PrasadamProps[]>([]);
  const [prasadamGeneralInfo, setPrasadamGeneralInfo] = useState<PrasadamInfoProps | null>(null);
  const [features, setFeatures] = useState<FeatureProps[]>([]);
  const [sections, setSections] = useState<SectionProps[]>([]);
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
    
    // Log detailed error information for debugging
    if (error.response) {
      console.error('API Response Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('API Request Error - No Response:', error.request);
    } else {
      console.error('API Setup Error:', error.message);
    }
    
    // Set appropriate error message
    setError(errorMessage + (error.response ? ` (${error.response.status})` : ''));
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
        handleApiError(err, setLoadingTempleInfo, 'Failed to load temple information');
      }
    };

    fetchTempleInfo();
  }, []);

  // Fetch features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        console.log('Fetching features...');
        const response = await templeService.getFeatures();
        setFeatures(response.data);
        setLoadingFeatures(false);
      } catch (err) {
        handleApiError(err, setLoadingFeatures, 'Failed to load temple features');
      }
    };

    fetchFeatures();
  }, []);

  // Fetch sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log('Fetching sections...');
        const response = await templeService.getSections();
        setSections(response.data);
        setLoadingSections(false);
      } catch (err) {
        handleApiError(err, setLoadingSections, 'Failed to load temple sections');
      }
    };

    fetchSections();
  }, []);

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        console.log('Fetching announcements...');
        const response = await announcementService.getAll();
        setAnnouncements(response.data);
        setLoadingAnnouncements(false);
      } catch (err) {
        handleApiError(err, setLoadingAnnouncements, 'Failed to load announcements');
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch events from backend with improved handling
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching upcoming events...');
        // Use process.env for Create React App or hardcode the URL
        console.log('API URL: http://localhost:4000/api');
        
        // First try the /upcoming endpoint
        try {
          const response = await eventService.getUpcoming();
          console.log('Upcoming events response:', response);
          setUpcomingEvents(response.data.slice(0, 5)); // Show only 5 upcoming events
        } catch (upcomingErr) {
          console.error('Error with upcoming events endpoint, falling back to regular endpoint:', upcomingErr);
          
          // Fall back to the regular endpoint with client-side filtering
          const allEventsResponse = await eventService.getAll();
          console.log('All events response:', allEventsResponse);
          
          // Sort events by date (upcoming first)
          const sortedEvents = [...allEventsResponse.data].sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          
          // Take only upcoming events (today and future)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcomingEvts = sortedEvents.filter(event => new Date(event.date) >= today);
          
          setUpcomingEvents(upcomingEvts.slice(0, 5)); // Show only 5 upcoming events
        }
        
        setLoadingEvents(false);
      } catch (err) {
        handleApiError(err, setLoadingEvents, 'Failed to load events');
      }
    };

    fetchEvents();
  }, []);

  // Fetch prasadam info from backend
  useEffect(() => {
    const fetchPrasadam = async () => {
      try {
        console.log('Fetching prasadam...');
        const response = await prasadamService.getAll();
        setPrasadamInfo(response.data);
        setLoadingPrasadam(false);
      } catch (err) {
        handleApiError(err, setLoadingPrasadam, 'Failed to load prasadam information');
      }
    };

    fetchPrasadam();
  }, []);

  // Fetch prasadam general info from backend
  useEffect(() => {
    const fetchPrasadamInfo = async () => {
      try {
        console.log('Fetching prasadam info...');
        const response = await prasadamService.getInfo();
        console.log('Prasadam info response:', response);
        
        if (response && response.data) {
          setPrasadamGeneralInfo(response.data);
        } else {
          console.error('No prasadam info data received');
          setError('No prasadam information available');
        }
        setLoadingPrasadamInfo(false);
      } catch (err) {
        handleApiError(err, setLoadingPrasadamInfo, 'Failed to load prasadam general information');
      }
    };

    fetchPrasadamInfo();
  }, []);

  // Format date for display with better internationalization and formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    try {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date(dateString).toDateString();
    }
  };

  // Format time with better handling
  const formatTime = (timeString: string) => {
    // Handle different time formats
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      
      if (isNaN(hour)) return timeString;
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      
      return `${formattedHour}:${minutes} ${period}`;
    }
    
    return timeString;
  };

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroContent>
          <Typography variant="h2" component="h1" gutterBottom>
            {loadingTempleInfo ? 'Welcome to Temple' : templeInfo?.name || 'Sri Siva Vishnu Temple'}
          </Typography>
          <Typography variant="h5" paragraph>
            {loadingTempleInfo ? 'Loading...' : templeInfo?.tagline || 'Experience peace, spirituality and cultural richness'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" color="secondary" component={Link} to="/donations">
              Recurring Donations
            </Button>
            <Button variant="outlined" color="inherit" component={Link} to="/services/puja">
              Puja Sponsorships
            </Button>
          </Box>
        </HeroContent>
      </HeroBanner>

      {/* Feature Icons Section */}
      <Box sx={{ py: 5 }}>
        <Container>
          {loadingFeatures ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : features.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>No features available at this time.</Alert>
          ) : (
          <Grid container spacing={4}>
              {features.map(feature => (
                <Grid item xs={12} sm={6} md={3} key={feature._id}>
                <Box 
                  component={Link} 
                  to={feature.link} 
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    display: 'block',
                    '&:hover': {
                      '& .MuiCard-root': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4
                      }
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <FeatureIcon>
                        {getIconComponent(feature.icon)}
                    </FeatureIcon>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          )}
        </Container>
      </Box>

      {/* Announcements Section */}
      <Box sx={{ py: 5, bgcolor: '#f8f9fa' }}>
        <Container>
          <SectionTitle variant="h3" component="h2">
            Announcements
          </SectionTitle>
          
          {loadingAnnouncements ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : announcements.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>No announcements available at this time.</Alert>
          ) : (
          <Grid container spacing={3}>
            {announcements.map(announcement => (
                <Grid item xs={12} md={6} key={announcement._id}>
                <Card elevation={2} sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        px: 2, 
                        py: 1, 
                        borderRadius: 4, 
                        mr: 2 
                      }}>
                          {new Date(announcement.dateRange.split(' - ')[0]).getDate()}
                          {new Date(announcement.dateRange.split(' - ')[0]).toLocaleString('default', { month: 'short' })}
                      </Box>
                      <Typography variant="h5" component="h3">
                        {announcement.title}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {announcement.dateRange}
                    </Typography>
                    <Typography paragraph>
                      {announcement.description}
                    </Typography>
                    <Button size="small" variant="outlined">Info</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          )}
        </Container>
      </Box>

      {/* Upcoming Events */}
      <Box sx={{ py: 5 }}>
        <Container>
          <SectionTitle variant="h3" component="h2">
            Upcoming Events
          </SectionTitle>
          
          {loadingEvents ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : upcomingEvents.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>No upcoming events available at this time.</Alert>
          ) : (
          <Grid container spacing={3}>
            {upcomingEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card elevation={2} sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}>
                  <CardHeader
                    sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          bgcolor: 'secondary.main', 
                          color: 'white', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 4, 
                          mr: 2, 
                          fontSize: '0.9rem', 
                          fontWeight: 'bold',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          minWidth: '2.5rem'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {new Date(event.date).getDate()}
                          </Typography>
                          <Typography variant="caption">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </Typography>
                        </Box>
                        <Typography variant="h6">{event.title}</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>When:</strong> {formatDate(event.date)}, {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Where:</strong> {event.location}
                    </Typography>
                    {event.eventType && (
                      <Chip 
                        label={event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)} 
                        size="small" 
                        color={
                          event.eventType === 'puja' ? 'primary' :
                          event.eventType === 'festival' ? 'secondary' :
                          event.eventType === 'discourse' ? 'info' :
                          event.eventType === 'community' ? 'success' :
                          event.eventType === 'class' ? 'warning' : 'default'
                        }
                        sx={{ mb: 2 }}
                      />
                    )}
                    <Typography variant="body2" paragraph>
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button size="small" variant="contained" component={Link} to={`/events/${event._id}`}>
                        Details
                      </Button>
                      {event.registrationRequired && (
                        <Chip 
                          label="Registration Required" 
                      size="small" 
                          color="warning" 
                      variant="outlined" 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/events"
            >
              More Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Temple Information */}
      <Box sx={{ py: 5, bgcolor: '#f8f9fa' }}>
        <Container>
          <SectionTitle variant="h3" component="h2">
            {loadingTempleInfo ? 'Temple Information' : templeInfo?.name || 'Sri Siva Vishnu Temple'}
          </SectionTitle>
          
          {loadingSections ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : sections.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>No temple information available at this time.</Alert>
          ) : (
          <Grid container spacing={4} sx={{ mb: 5 }}>
              {sections.map(section => (
                <Grid item xs={12} md={6} key={section._id}>
              <Typography variant="h6" gutterBottom>
                    {section.title}
              </Typography>
              <Typography paragraph>
                    {section.description}
              </Typography>
            </Grid>
              ))}
            </Grid>
          )}
          
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/about"
            >
              View All
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Prasadam Info */}
      <Box sx={{ py: 5 }}>
        <Container>
          <SectionTitle variant="h3" component="h2">
            Prasadam
          </SectionTitle>
          
          {loadingPrasadam || loadingPrasadamInfo ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : (
            <>
          <Typography align="center" paragraph sx={{ mb: 4 }}>
                {prasadamGeneralInfo?.description || 'Prasadam information is not available at this time.'}
          </Typography>
              
          <Grid container spacing={3}>
                {prasadamInfo.length === 0 ? (
                  <Grid item xs={12}>
                    <Alert severity="info">No prasadam information available at this time.</Alert>
                  </Grid>
                ) : (
                  // Filter only Saturday and Sunday prasadam for the homepage
                  prasadamInfo
                    .filter(prasadam => ['Saturday', 'Sunday'].includes(prasadam.dayOfWeek))
                    .map(prasadam => (
                      <Grid item xs={12} md={6} key={prasadam._id}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardHeader
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                            title={prasadam.dayOfWeek}
                />
                <CardContent>
                            <Typography paragraph>Special prasadam offerings on {prasadam.dayOfWeek}:</Typography>
                            {prasadam.isAvailable ? (
                  <List>
                                {prasadam.items.map((item, index) => (
                                  <React.Fragment key={index}>
                    <ListItem>
                                      <ListItemText 
                                        primary={item.name} 
                                        secondary={item.description}
                                        primaryTypographyProps={{
                                          fontWeight: item.specialItem ? 'bold' : 'regular'
                                        }}
                                      />
                    </ListItem>
                                    {index < prasadam.items.length - 1 && <Divider component="li" />}
                                  </React.Fragment>
                                ))}
                  </List>
                            ) : (
                              <Alert severity="info">Prasadam not available on this day.</Alert>
                            )}
                            {prasadam.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Note: {prasadam.notes}
                              </Typography>
                            )}
                </CardContent>
              </Card>
            </Grid>
                    ))
                )}
          </Grid>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Home; 