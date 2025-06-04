import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { pujaService } from '../../services/api';
import { format } from 'date-fns';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  }
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  backgroundColor: 
    status === 'confirmed' ? '#4caf50' :
    status === 'pending' ? '#ff9800' :
    status === 'completed' ? '#2196f3' :
    status === 'cancelled' ? '#f44336' : '#9e9e9e',
  color: '#fff',
  fontWeight: 'bold'
}));

const PujaBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await pujaService.getBookings();
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch puja bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await pujaService.cancelBooking(bookingId);
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ color: '#d35400', mb: 3 }}>
        My Puja Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Alert severity="info">
          You haven't booked any pujas yet. Visit the Puja Services section to make a booking.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking._id}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" color="primary">
                      {booking.pujaId.name}
                    </Typography>
                    <StatusChip
                      label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      status={booking.status}
                      size="small"
                    />
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <EventIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(booking.date), 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <TimeIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {booking.time}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {booking.location.charAt(0).toUpperCase() + booking.location.slice(1)}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Amount: ₹{booking.paymentAmount}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(booking)}
                        sx={{ mr: 1 }}
                      >
                        <InfoIcon />
                      </IconButton>
                      {booking.status === 'pending' && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedBooking && (
          <>
            <DialogTitle>
              Puja Booking Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Puja Details
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Name:</strong> {selectedBooking.pujaId.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Description:</strong> {selectedBooking.pujaId.description}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Duration:</strong> {selectedBooking.pujaId.duration}
                </Typography>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Booking Details
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Date:</strong> {format(new Date(selectedBooking.date), 'MMMM dd, yyyy')}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Time:</strong> {selectedBooking.time}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Location:</strong> {selectedBooking.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Status:</strong> {selectedBooking.status}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Payment Status:</strong> {selectedBooking.paymentStatus}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Payment Amount:</strong> ₹{selectedBooking.paymentAmount}
                </Typography>
                {selectedBooking.instructions && (
                  <Typography variant="body2" paragraph>
                    <strong>Special Instructions:</strong> {selectedBooking.instructions}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PujaBookings; 