import React from 'react';
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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon,
  Info as InfoIcon
} from '@mui/icons-material';

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
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface EventProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface AnnouncementProps {
  id: number;
  title: string;
  dateRange: string;
  description: string;
}

const Home: React.FC = () => {
  const announcements: AnnouncementProps[] = [
    {
      id: 1,
      title: "Sri Siva Gnana Deepika Mahotsavam",
      dateRange: "April 17, 2025 - August 3, 2025",
      description: "Join us for the annual Sri Siva Gnana Deepika Mahotsavam with special pujas and cultural programs"
    },
    {
      id: 2,
      title: "2025 Annual Calendar",
      dateRange: "November 29, 2024 - February 26, 2025",
      description: "Annual calendar of temple events and festivals is now available"
    }
  ];
  
  const upcomingEvents: EventProps[] = [
    {
      id: 1,
      title: "Papanasam Sivan Festival – Main Concert",
      date: "May 17, 2025",
      time: "09:00 - 12:00",
      location: "Main Temple"
    },
    {
      id: 2,
      title: "Weekly Bhajan",
      date: "May 24, 2025",
      time: "19:00 - 20:30",
      location: "Bhajan Hall"
    },
    {
      id: 3,
      title: "Spiritual Discourse",
      date: "June 5, 2025",
      time: "17:00 - 19:00",
      location: "Lecture Hall"
    }
  ];

  const tempFeatures: FeatureProps[] = [
    {
      id: 1,
      title: "Religious",
      description: "Daily PujasTemple Opening & Suprabhaatam, Evening Aarathi, Abhishekam",
      icon: <HomeIcon fontSize="large" />,
      link: "/services/puja"
    },
    {
      id: 2,
      title: "Cultural",
      description: "The Temple hosts a number of cultural events by local talent and well-known artists from India.",
      icon: <EventIcon fontSize="large" />,
      link: "/events"
    },
    {
      id: 3,
      title: "Donation",
      description: "Click here to donate or to sponsor for pujas.",
      icon: <OfferIcon fontSize="large" />,
      link: "/donations"
    },
    {
      id: 4,
      title: "Upcoming Events",
      description: "Click here to view details about Upcoming Events.",
      icon: <InfoIcon fontSize="large" />,
      link: "/events"
    }
  ];

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroContent>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Sri Siva Vishnu Temple
          </Typography>
          <Typography variant="h5" paragraph>
            Experience peace, spirituality and cultural richness
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
          <Grid container spacing={4}>
            {tempFeatures.map(feature => (
              <Grid item xs={12} sm={6} md={3} key={feature.id}>
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
                      {feature.icon}
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
        </Container>
      </Box>

      {/* Announcements Section */}
      <Box sx={{ py: 5, bgcolor: '#f8f9fa' }}>
        <Container>
          <SectionTitle variant="h3" component="h2">
            Announcements
          </SectionTitle>
          <Grid container spacing={3}>
            {announcements.map(announcement => (
              <Grid item xs={12} md={6} key={announcement.id}>
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
                        {announcement.id}Nov
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
        </Container>
      </Box>

      {/* Upcoming Events */}
      <Box sx={{ py: 5 }}>
        <Container>
          <SectionTitle variant="h3" component="h2">
            Upcoming Events
          </SectionTitle>
          <Grid container spacing={3}>
            {upcomingEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
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
                          fontWeight: 'bold' 
                        }}>
                          {event.date.substring(0, 2)}
                        </Box>
                        <Typography variant="h6">{event.title}</Typography>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {event.date}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Time:</strong> {event.time}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Location:</strong> {event.location}
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      component={Link} 
                      to="/events"
                    >
                      Info
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            Sri Siva Vishnu Temple
          </SectionTitle>
          <Grid container spacing={4} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Our Way Of Life
              </Typography>
              <Typography paragraph>
                Hinduism is the way of life that deeply influences our thinking, behavior and attitude toward oneself and others. 
                Our Dharma or Godly duties becomes interwoven in our lifestyle. Seeking higher knowledge or enlightenment, 
                living peacefully, expressing gratitude, devotion and exercising moral principles are core practices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Yoga & Meditation
              </Typography>
              <Typography paragraph>
                Harikatha, literally "Story of Lord", is a form of Hindu traditional discourse in which the storyteller 
                explores a traditional theme, usually the life of a saint or a story from an Indian epic.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              <Typography paragraph>
                We started a focused experiment with the Seminar Series called "Learning the Tradition of Hinduism" 
                starting from September 14, 2002. This has evolved in 2003 into separate adult and children's program.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Community Programs
              </Typography>
              <Typography paragraph>
                Carnatic & Hindustani music evolved with Sanskrit language scripts in itself and through Vedic traditions. 
                Vocal music is performed by one or more singers. Instrumental music is compositions without lyrics.
              </Typography>
            </Grid>
          </Grid>
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
          <Typography align="center" paragraph sx={{ mb: 4 }}>
            The temple makes prasadam available to devotees on weekends and special holidays for a nominal donation. 
            The prasadam counter is open 9:00 AM to 1:00 PM & 5:00 PM to 9:00 PM on Monday, Tuesday, Thursday & Friday; 
            9:00 AM to 9:00 PM on Weekends, and special days. <strong>Prasadam counter is closed on Wednesdays.</strong>
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardHeader
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                  title="Saturday"
                />
                <CardContent>
                  <Typography paragraph>Special prasadam offerings on Saturday:</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Vada" />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText primary="Sweet Pongal" />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText primary="Puliyogare" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardHeader
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                  title="Sunday"
                />
                <CardContent>
                  <Typography paragraph>Special prasadam offerings on Sunday:</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Vada" />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText primary="Sweet Pongal" />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText primary="Puliyogare" />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText primary="Curd Rice" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home; 