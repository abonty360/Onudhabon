import React, { useState, useEffect } from "react"; // Import useEffect
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const ReplyBox = ({ postId, onReplyAdded }) => {
  const [text, setText] = useState("");
  const [authorId, setAuthorId] = useState(null); // State to hold the user's ID
  const navigate = useNavigate(); // 2. Initialize useNavigate

  // This effect runs once to get the logged-in user's ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // IMPORTANT: Use the same property as before (id, _id, sub, etc.)
        setAuthorId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Check if we have a user ID before submitting
    if (!authorId) {
      navigate('/login', { state: { message: 'You must be logged in to reply.' } });
      return;
    }

    await axios.post(`http://localhost:5000/api/forum/${postId}/replies`, {
      text,
      author: authorId, // Add the author's ID to the request
    });
    setText("");
    onReplyAdded();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write a reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" variant="primary">
        Reply
      </Button>
    </Form>
  );
};

export default ReplyBox;