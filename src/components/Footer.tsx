import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, styled } from '@mui/material';
import { t } from '../utils/translationUtils';

const StyledLink = styled(Link)({
  color: '#f5e6d3',
  textDecoration: 'none',
  '&:hover': {
    color: '#e0c9a6'
  }
});

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#d35400',
        color: '#f5e6d3',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#f5e6d3', fontWeight: 'bold' }}>
              {t('temple.name')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#f5e6d3' }}>
              {t('temple.description')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#f5e6d3', fontWeight: 'bold' }}>
              {t('temple.services')}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/services/puja">
                  {t('temple.pujaServices')}
                </StyledLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/services/schedule">
                  {t('temple.pujaSchedule')}
                </StyledLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/festivals">
                  {t('temple.festivals')}
                </StyledLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#f5e6d3', fontWeight: 'bold' }}>
              {t('temple.onlineServices')}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/donations">
                  {t('temple.donations')}
                </StyledLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/prayer-books">
                  {t('temple.prayerBooks')}
                </StyledLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <StyledLink to="/virtual-visit">
                  {t('temple.virtualVisit')}
                </StyledLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#f5e6d3', fontWeight: 'bold' }}>
              {t('common.contact')}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: '#f5e6d3' }}>
              {t('temple.address')}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: '#f5e6d3' }}>
              {t('temple.phone')}: (123) 456-7890
            </Typography>
            <Typography variant="body2" sx={{ color: '#f5e6d3' }}>
              {t('temple.email')}: info@temple.org
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, textAlign: 'center', borderTop: '1px solid #e0c9a6', pt: 3 }}>
          <Typography variant="body2" sx={{ color: '#f5e6d3' }}>
            © {new Date().getFullYear()} {t('temple.name')}. {t('common.allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 