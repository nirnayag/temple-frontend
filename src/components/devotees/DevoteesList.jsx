import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Card } from 'react-bootstrap';
import { devoteeService } from '../../services/api';

const DevoteesList = () => {
  const [devotees, setDevotees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevotees();
  }, []);

  const fetchDevotees = async () => {
    try {
      setLoading(true);
      const response = await devoteeService.getAll();
      setDevotees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching devotees:', err);
      setError('Failed to load devotees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this devotee?')) {
      try {
        await devoteeService.delete(id);
        // Filter out the deleted devotee from the list
        setDevotees(devotees.filter(devotee => devotee._id !== id));
      } catch (err) {
        console.error('Error deleting devotee:', err);
        setError('Failed to delete devotee. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Devotees List</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Membership</th>
                      <th>Member Since</th>
                      <th>Actions</th>
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
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <div style={{ height: "32px", width: "60px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
                            <div style={{ height: "32px", width: "60px", backgroundColor: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
                          </div>
                        </td>
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
        <h3 className="mb-0">Devotees List</h3>
      </Card.Header>
      <Card.Body>
        {devotees.length === 0 ? (
          <Alert variant="info">No devotees found. Add some devotees to get started.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Membership</th>
                <th>Member Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devotees.map((devotee) => (
                <tr key={devotee._id}>
                  <td>{devotee.name}</td>
                  <td>{devotee.email}</td>
                  <td>{devotee.phone || 'N/A'}</td>
                  <td>{devotee.membershipType}</td>
                  <td>{new Date(devotee.memberSince).toLocaleDateString()}</td>
                  <td>
                    <Button variant="primary" size="sm" className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(devotee._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <Card.Footer>
        <Button variant="success">Add New Devotee</Button>
      </Card.Footer>
    </Card>
  );
};

export default DevoteesList;
