import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Paper,
  styled
} from '@mui/material';
import { t } from '../../utils/translationUtils';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#E2DFD2',
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: '3px solid #d35400',
  margin: '0 auto 16px'
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#d35400',
  color: '#E2DFD2',
  margin: '4px',
  '&:hover': {
    backgroundColor: '#b34700'
  }
}));

const PriestsList = () => {
  const { t } = useTranslation();

  // Sample priests data based directly on SSVT website
  const priests = [
    {
      id: 1,
      name: "Sri Narayanachar Lakshminarasimha Digalakote",
      title: "Vaishnava Pancharatra Aagama Priest",
      origin: "Karnataka, India",
      background: "Sri Narayanachar is a vaishnava pancharatra aagama priest at SSVT. He hails from Digalakote, Karnataka. He is the disciple of Shri Savyasachi Swamigal, Vaishnava Acharya of SSVT. He has been trained in Pancharatra Aagama and has training in satras including Poorva Pryogas, Srardha Pryogas, and Aparaprayogas. He joined SSVT in May 1992. He performs all the aagamic activities at SSVT and always involves devotees in when he performs either archanas or kalyanotsavams.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+1",
      languages: ["Kannada", "Telugu", "Tamil", "Hindi", "Sanskrit", "English"]
    },
    {
      id: 2,
      name: "Sri Easwaran Nampoothiri",
      title: "Tantrik Priest",
      origin: "Kerala, India",
      background: "Sri. Easwaran Nampoothiri hails from Allapuzha, Kerala. He is Tantrik priest trained in Kerala Tantrik pujas through a family hereditary system under his grandfather and father. He has performed Thanthrik pujas and prtishtapanams in many states in India. Melsanthi at Sabarimalai Temple in 1996-1997 and at Sabarimalai-Mallikapuram temple in 1985-86 are something he cherishes. He joined SSVT in September 2000 as Tantrik priest. He performs all the pujas at the Ayyappan sannidhi and serves other deities as well.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+2",
      languages: ["Malayalam", "Tamil", "Hindi", "English"]
    },
    {
      id: 3,
      name: "Sri Janakiram Sarma Marthi",
      title: "Smartha Vaidhika Priest",
      origin: "Andhra Pradesh, India",
      background: "Sri. Janakiram Marthi hails from Andhra Pradesh, India. He is smartha vaidhika priest who had his veda paatam at \"Gayathri Smaartha Vedapaatashaala\" at Srisailam, Andhra Pradesh under his father Shri Venkatarama Sarma and later under Sri Sailam Nitya Agnihotri Satyanarayana Somayajulu. Prior to joining SSVT in October 2005 he was a vaidika priest in Narasaropet, Andhra. He has participated in Kotivarthi Sahit Lakshminarayana Deepotsavam, Varanasi and in Rudra Yagam & Subramanya Prathishta, Rameswaram.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+3",
      languages: ["Telugu", "Hindi", "English", "Sanskrit"]
    },
    {
      id: 4,
      name: "Sri Sivasubramaniyan Ganesa Gurukkal",
      title: "Saivagama Priest",
      origin: "Tamil Nadu, India",
      background: "Sri Sivasubramanyan Ganesa Gurukkal hails from Tiruvannamalai, Tamil Nadu. He is trained in Saivagama under his Guru Dr. Somasundara Sivachariyar from Sri Lokambika Vedha Sivaagama Vidyalaya, Tiruppalaivanam, Tamilnadu. He is trained in Poorva Prayoga and Shraddha Prayogas. He served the deities in Sri Shishta Gurunadhar Temple, Sri Arunachaleswar Temple in Tamilnadu for over 15 years. Before joining SSVT in July 2011 as Sivaagama Priest he was with Sri Lakshmi Temple in Boston.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+4",
      languages: ["Tamil", "English"]
    },
    {
      id: 5,
      name: "Sri Shankara Gurukkal",
      title: "Saivagama Priest",
      origin: "Tamil Nadu, India",
      background: "Sri Sankaran Gurukkal hails from Tiruveezhimizhalai, Tamilnadu. He is trained in Saivagama under his Guru Sivasri Visvanatha Sivachariyar from Sri Vedha Sivaagama Patasali, Allur, Tamilnadu. He is trained in Poorva Prayoga and Shraddha Prayogas. He has served the Deities for more than 17 years in Mangala Vinayagar Temple, Tambaram before serving Murugan Temple (MTNA) Lanham in 2008 - 2009. After a small break In India he joined SSVT as saivagama priest in March 2010.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+5",
      languages: ["Tamil", "Hindi", "Sanskrit"]
    },
    {
      id: 6,
      name: "Sree Venkatacharyulu Kumanduri",
      title: "Vaishnava Pancharatra Aagama Priest",
      origin: "Andhra Pradesh, India",
      background: "Sri Venkatacharyulu Kumanduri is a vaishnava pancharatra aagama priest at SSVT. He hails from Kesavaram Andhra Pradesh. He finished his veda aagama studies from Sri Pancharaatra Aagama kSalashaala, Jeeyar Educational Trust, Jaggayyapet, Andhra Pradesh under his Guru Srinivasacharya Samudrala. He also has a B.Com degree from Andhra University. He has served in different temples in Hyderabad for 10 years before joining SSVT in May 2011.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+6",
      languages: ["Telugu", "Tamil", "Hindi", "English"]
    }
  ];

  return (
    <Box sx={{ bgcolor: '#E2DFD2', minHeight: '100vh', py: 8 }}>
      <Container>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: '#d35400', fontWeight: 'bold', mb: 4 }}
        >
          {t('priests.title')}
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          sx={{ color: '#4a4a4a', mb: 6, maxWidth: '800px', mx: 'auto' }}
        >
          {t('priests.description')}
        </Typography>

        <Grid container spacing={4}>
          {priests.map(priest => (
            <Grid item xs={12} key={priest.id}>
              <StyledCard>
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                      <StyledAvatar
                        src={priest.image}
                        alt={priest.name}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: '#d35400', fontWeight: 'bold', mb: 1 }}
                      >
                        {priest.title}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={9}>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{ color: '#4a4a4a', fontWeight: 'bold', mb: 2 }}
                      >
                        {priest.name}
                      </Typography>
                      
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ color: '#666666', mb: 2 }}
                      >
                        {priest.background}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: '#4a4a4a', fontWeight: 'bold', mb: 1 }}
                        >
                          {t('priests.languages')}:
                        </Typography>
                        <Box>
                          {priest.languages.map((language, index) => (
                            <StyledChip
                              key={index}
                              label={language}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Typography
                        variant="subtitle1"
                        sx={{ color: '#4a4a4a' }}
                      >
                        <strong>{t('priests.origin')}:</strong> {priest.origin}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 4,
            bgcolor: '#d35400',
            color: '#E2DFD2',
            borderRadius: '15px',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('priests.services.title')}
          </Typography>
          
          <Typography paragraph sx={{ mb: 2 }}>
            {t('priests.services.description')}
          </Typography>
          
          <Typography>
            <strong>{t('priests.services.contact')}:</strong> priest-services@temple.org | (123) 456-7890
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PriestsList; 