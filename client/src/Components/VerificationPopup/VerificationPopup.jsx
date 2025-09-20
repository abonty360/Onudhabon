import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function VerificationPopup({ show, handleClose, userId, onVerified }) {
  const [nidNumber, setNidNumber] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('userId', userId); // Pass userId to the server
    if (nidNumber) {
      formData.append('nidNumber', nidNumber);
    }
    if (certificate) {
      formData.append('certificate', certificate);
    }

    try {
      const response = await axios.post(
        `/api/user/verify-account`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );


      if (response.status === 200) {
        onVerified(); // Callback to parent to indicate successful verification
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Account Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Please provide your NID number or upload a certificate picture to verify your account.</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nidNumber" className="mb-3">
            <Form.Label>NID Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter NID number"
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="certificate" className="mb-3">
            <Form.Label>Certificate Picture (Optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
            />
            <Form.Text className="text-muted">
              Upload a clear picture of your certificate.
            </Form.Text>
          </Form.Group>
          <Alert variant="info">
            You must provide either an NID number or a Certificate Picture to verify your account.
          </Alert>
          <Button variant="primary" type="submit" disabled={loading || (!nidNumber && !certificate)}>
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default VerificationPopup;
