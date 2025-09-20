import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function VerificationPendingPopup({ show, handleClose, onRedirect }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verification Pending</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Thank you for submitting your verification details. Please wait until the admin verifies your information.</p>
        <p>You will be redirected to the guest page shortly.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onRedirect}>
          Continue to Guest Page
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerificationPendingPopup;
