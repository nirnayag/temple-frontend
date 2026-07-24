import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { t } from '../../utils/translationUtils';

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

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#E2DFD2',
  '& .MuiAccordionSummary-root': {
    backgroundColor: '#d35400',
    color: '#E2DFD2',
    '& .MuiAccordionSummary-content': {
      color: '#E2DFD2',
      fontWeight: 'bold'
    }
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(2)
  }
}));

const PujaServices = () => {
  const { i18n } = useTranslation();
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    location: '',
    instructions: ''
  });

  // Sample puja services based on temple offerings
  const pujaServices = [
    {
      id: 1,
      category: t('puja.categories.regular'),
      pujas: [
        {
          id: 101,
          name: t('puja.regular.archana.name'),
          description: t('puja.regular.archana.description'),
          duration: t('puja.regular.archana.duration'),
          cost: t('puja.regular.archana.cost')
        },
        {
          id: 102,
          name: t('puja.regular.abhishekam.name'),
          description: t('puja.regular.abhishekam.description'),
          duration: t('puja.regular.abhishekam.duration'),
          cost: t('puja.regular.abhishekam.cost')
        },
        {
          id: 103,
          name: t('puja.regular.sahasranamam.name'),
          description: t('puja.regular.sahasranamam.description'),
          duration: t('puja.regular.sahasranamam.duration'),
          cost: t('puja.regular.sahasranamam.cost')
        }
      ]
    },
    {
      id: 2,
      category: t('puja.categories.special'),
      pujas: [
        {
          id: 201,
          name: t('puja.special.ganapati.name'),
          description: t('puja.special.ganapati.description'),
          duration: t('puja.special.ganapati.duration'),
          cost: t('puja.special.ganapati.cost')
        },
        {
          id: 202,
          name: t('puja.special.satyanarayana.name'),
          description: t('puja.special.satyanarayana.description'),
          duration: t('puja.special.satyanarayana.duration'),
          cost: t('puja.special.satyanarayana.cost')
        },
        {
          id: 203,
          name: t('puja.special.rudra.name'),
          description: t('puja.special.rudra.description'),
          duration: t('puja.special.rudra.duration'),
          cost: t('puja.special.rudra.cost')
        }
      ]
    },
    {
      id: 3,
      category: t('puja.categories.lifeEvents'),
      pujas: [
        {
          id: 301,
          name: t('puja.lifeEvents.namakaranam.name'),
          description: t('puja.lifeEvents.namakaranam.description'),
          duration: t('puja.lifeEvents.namakaranam.duration'),
          cost: t('puja.lifeEvents.namakaranam.cost')
        },
        {
          id: 302,
          name: t('puja.lifeEvents.grihapravesham.name'),
          description: t('puja.lifeEvents.grihapravesham.description'),
          duration: t('puja.lifeEvents.grihapravesham.duration'),
          cost: t('puja.lifeEvents.grihapravesham.cost')
        },
        {
          id: 303,
          name: t('puja.lifeEvents.shashtiabdapoorthi.name'),
          description: t('puja.lifeEvents.shashtiabdapoorthi.description'),
          duration: t('puja.lifeEvents.shashtiabdapoorthi.duration'),
          cost: t('puja.lifeEvents.shashtiabdapoorthi.cost')
        }
      ]
    },
    {
      id: 4,
      category: t('puja.categories.festival'),
      pujas: [
        {
          id: 401,
          name: t('puja.festival.diwali.name'),
          description: t('puja.festival.diwali.description'),
          duration: t('puja.festival.diwali.duration'),
          cost: t('puja.festival.diwali.cost')
        },
        {
          id: 402,
          name: t('puja.festival.navaratri.name'),
          description: t('puja.festival.navaratri.description'),
          duration: t('puja.festival.navaratri.duration'),
          cost: t('puja.festival.navaratri.cost')
        },
        {
          id: 403,
          name: t('puja.festival.ganeshChaturthi.name'),
          description: t('puja.festival.ganeshChaturthi.description'),
          duration: t('puja.festival.ganeshChaturthi.duration'),
          cost: t('puja.festival.ganeshChaturthi.cost')
        }
      ]
    }
  ];

  const handlePujaSelect = (puja) => {
    setSelectedPuja(puja);
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { selectedPuja, formData });
  };

  return (
    <Box sx={{ bgcolor: '#E2DFD2', py: 8 }}>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ color: '#d35400', fontWeight: 'bold' }}>
          {t('puja.title')}
        </Typography>
        <Typography variant="h6" align="center" paragraph sx={{ color: '#4a4a4a', mb: 6 }}>
          {t('puja.description')}
        </Typography>

        {/* Puja Categories */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {pujaServices.map(category => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <StyledCard>
                <StyledCardHeader
                  title={category.category}
                  subheader={`${category.pujas.length} ${t('puja.types')}`}
                />
                <StyledCardContent>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#d35400',
                      '&:hover': {
                        bgcolor: '#b34700'
                      }
                    }}
                    onClick={() => document.getElementById(`category-${category.id}`).scrollIntoView({ behavior: 'smooth' })}
                  >
                    {t('puja.viewDetails')}
                  </Button>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Puja Listings by Category */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#d35400', fontWeight: 'bold' }}>
            {t('puja.availableServices')}
          </Typography>
          <Typography paragraph sx={{ color: '#4a4a4a', mb: 4 }}>
            {t('puja.bookingInstructions')}
          </Typography>

          {pujaServices.map(category => (
            <StyledAccordion key={category.id} id={`category-${category.id}`}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#E2DFD2' }} />}>
                <Typography>{category.category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ bgcolor: '#E2DFD2' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#4a4a4a', fontWeight: 'bold' }}>{t('puja.name')}</TableCell>
                        <TableCell sx={{ color: '#4a4a4a', fontWeight: 'bold' }}>{t('puja.description')}</TableCell>
                        <TableCell sx={{ color: '#4a4a4a', fontWeight: 'bold' }}>{t('puja.duration')}</TableCell>
                        <TableCell sx={{ color: '#4a4a4a', fontWeight: 'bold' }}>{t('puja.cost')}</TableCell>
                        <TableCell sx={{ color: '#4a4a4a', fontWeight: 'bold' }}>{t('puja.action')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {category.pujas.map(puja => (
                        <TableRow key={puja.id}>
                          <TableCell sx={{ color: '#4a4a4a' }}>{puja.name}</TableCell>
                          <TableCell sx={{ color: '#4a4a4a' }}>{puja.description}</TableCell>
                          <TableCell sx={{ color: '#4a4a4a' }}>{puja.duration}</TableCell>
                          <TableCell sx={{ color: '#4a4a4a' }}>{puja.cost}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: '#d35400',
                                '&:hover': {
                                  bgcolor: '#b34700'
                                }
                              }}
                              onClick={() => handlePujaSelect(puja)}
                            >
                              {t('puja.bookNow')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>

        {/* Booking Form */}
        <Box
          id="booking-form"
          component={Paper}
          sx={{
            p: 4,
            bgcolor: '#E2DFD2',
            borderRadius: '15px'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#d35400', fontWeight: 'bold' }}>
            {t('puja.bookingForm')}
          </Typography>

          {selectedPuja ? (
            <Alert severity="info" sx={{ mb: 3, bgcolor: '#E2DFD2', color: '#4a4a4a' }}>
              {t('puja.bookingFor')}: <strong>{selectedPuja.name}</strong> - {selectedPuja.description}
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 3, bgcolor: '#E2DFD2', color: '#4a4a4a' }}>
              {t('puja.selectPuja')}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('puja.form.fullName')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('puja.form.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('puja.form.phone')}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('puja.form.date')}
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('puja.form.time')}
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('puja.form.location')}
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  sx={{ bgcolor: '#fff' }}
                >
                  <MenuItem value="temple">{t('puja.form.atTemple')}</MenuItem>
                  <MenuItem value="residence">{t('puja.form.atResidence')}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('puja.form.instructions')}
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!selectedPuja}
                  sx={{
                    bgcolor: '#d35400',
                    '&:hover': {
                      bgcolor: '#b34700'
                    }
                  }}
                >
                  {t('puja.form.submit')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Additional Information */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#d35400', fontWeight: 'bold' }}>
            {t('puja.additionalInfo')}
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <StyledCardHeader title={t('puja.guidelines.title')} />
                <StyledCardContent>
                  <List>
                    {[
                      t('puja.guidelines.advance'),
                      t('puja.guidelines.confirmation'),
                      t('puja.guidelines.urgent'),
                      t('puja.guidelines.cancellation')
                    ].map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText primary={item} />
                        </ListItem>
                        {index < 3 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </StyledCardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <StyledCardHeader title={t('puja.whatToBring.title')} />
                <StyledCardContent>
                  <List>
                    {[
                      t('puja.whatToBring.offering'),
                      t('puja.whatToBring.clothing'),
                      t('puja.whatToBring.space'),
                      t('puja.whatToBring.additional')
                    ].map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText primary={item} />
                        </ListItem>
                        {index < 3 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: '#d35400',
              color: '#E2DFD2',
              borderRadius: '15px',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t('puja.contact.title')}
            </Typography>
            <Typography paragraph sx={{ mb: 1 }}>
              {t('puja.contact.description')}
            </Typography>
            <Typography>
              <strong>{t('puja.contact.email')}:</strong> puja-services@temple.org |{' '}
              <strong>{t('puja.contact.phone')}:</strong> (123) 456-7890
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PujaServices; 