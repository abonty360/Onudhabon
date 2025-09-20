import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminReviewPendingVolunteers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/unverified-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending users.');
      console.error('Error fetching pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, status) => {
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `/api/user/verify-status/${userId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      fetchPendingUsers(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update verification status.');
      console.error('Error updating verification status:', err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="admin-review-pending-volunteers-page">
      <Container className="mt-4">
        <h2>Pending Volunteer Verifications</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        {pendingUsers.length === 0 ? (
          <Alert variant="info">No pending volunteer verifications found.</Alert>
        ) : (
          <Row>
            {pendingUsers.map((user) => (
              <Col md={6} lg={4} className="mb-4" key={user._id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
                    <Card.Text>
                      <strong>Phone:</strong> {user.phone}<br />
                      <strong>Location:</strong> {user.location}<br />
                      <strong>Role:</strong> {user.roles}<br />
                      {user.age && <><strong>Age:</strong> {user.age}<br /></>}
                      {user.sscPassingYear && <><strong>SSC Passing Year:</strong> {user.sscPassingYear}<br /></>}
                      {user.sscInstitute && <><strong>SSC Institute:</strong> {user.sscInstitute}<br /></>}
                      {user.hscPassingYear && <><strong>HSC Passing Year:</strong> {user.hscPassingYear}<br /></>}
                      {user.hscInstitute && <><strong>HSC Institute:</strong> {user.hscInstitute}<br /></>}
                      {user.universityName && <><strong>University Name:</strong> {user.universityName}<br /></>}
                      {user.universityPassingYear && <><strong>University Passing Year:</strong> {user.universityPassingYear}<br /></>}
                      {user.currentlyStudying !== undefined && <><strong>Currently Studying:</strong> {user.currentlyStudying ? 'Yes' : 'No'}<br /></>}
                      {user.nidNumber && <><strong>NID:</strong> {user.nidNumber}<br /></>}
                      {user.certificatePicture && (
                        <div className="mt-2">
                          <strong>Certificate:</strong> <a href={user.certificatePicture} target="_blank" rel="noopener noreferrer">View Certificate</a>
                        </div>
                      )}
                    </Card.Text>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => handleVerification(user._id, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleVerification(user._id, 'decline')}
                    >
                      Decline
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default AdminReviewPendingVolunteers;
