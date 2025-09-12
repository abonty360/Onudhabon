import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const NewPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setAuthorId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login", {
          replace: true,
          state: { message: "Your session is invalid. Please log in again." },
        });
      }
    } else {
      navigate("/login", {
        replace: true,
        state: { message: "You must be logged in to create a post." },
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authorId) {
      alert("You must be logged in to create a post.");
      return;
    }

    await axios.post("http://localhost:5000/api/forum", {
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()),
      author: authorId,
    });
    navigate("/forum");
  };

  if (!authorId) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-4">
      <h2>New Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Tags (comma separated)</Form.Label>
          <Form.Control
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="success">
          Post
        </Button>
      </Form>
    </Container>
  );
};

export default NewPostForm;
