import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ReplyBox = ({ postId, onReplyAdded }) => {
  const [text, setText] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAuthorId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!authorId) {
      navigate("/login", {
        state: { message: "You must be logged in to reply." },
      });
      return;
    }

    await axios.post(`http://localhost:5000/api/forum/${postId}/replies`, {
      text,
      author: authorId,
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
