import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Button, Form, Row, Col } from 'react-bootstrap';
import { devoteeService } from '../../services/api';

const DonationsList = () => {
  const [devotees, setDevotees] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDevoteeId, setFilteredDevoteeId] = useState('');

  useEffect(() => {
    fetchDevotees();
  }, []);

  const fetchDevotees = async () => {
    try {
      setLoading(true);
      const response = await devoteeService.getAll();
      setDevotees(response.data);
      
      // Extract all donations from all devotees
      const allDonations = [];
      response.data.forEach(devotee => {
        if (devotee.donationHistory && devotee.donationHistory.length > 0) {
          devotee.donationHistory.forEach(donation => {
            allDonations.push({
              ...donation,
              devoteeId: devotee._id,
              devoteeName: devotee.name
            });
          });
        }
      });
      
      // Sort donations by date (newest first)
      allDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDonations(allDonations);
      setError(null);
    } catch (err) {
      console.error('Error fetching devotees and donations:', err);
      setError('Failed to load donations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilteredDevoteeId(e.target.value);
  };

  const getFilteredDonations = () => {
    if (!filteredDevoteeId) return donations;
    return donations.filter(donation => donation.devoteeId === filteredDevoteeId);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3">
          <div className="card">
            <div className="card-header bg-temple">
              <h3 className="mb-0">Donations</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Devotee</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td><div style={{ height: "16px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} /></td>
                        <td><div style={{ height: "16px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} /></td>
                        <td><div style={{ height: "16px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} /></td>
                        <td><div style={{ height: "16px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} /></td>
                        <td><div style={{ height: "16px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchDevotees}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-temple">
        <h3 className="mb-0">Donations</h3>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filter by Devotee</Form.Label>
              <Form.Select value={filteredDevoteeId} onChange={handleFilterChange}>
                <option value="">All Devotees</option>
                {devotees.map(devotee => (
                  <option key={devotee._id} value={devotee._id}>
                    {devotee.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        {getFilteredDonations().length === 0 ? (
          <Alert variant="info">No donations found.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Devotee</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredDonations().map((donation, index) => (
                <tr key={index}>
                  <td>{donation.devoteeName}</td>
                  <td>{new Date(donation.date).toLocaleDateString()}</td>
                  <td>${donation.amount.toFixed(2)}</td>
                  <td>{donation.purpose || 'General Donation'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <Card.Footer>
        <Button variant="success">Record New Donation</Button>
      </Card.Footer>
    </Card>
  );
};

export default DonationsList; 