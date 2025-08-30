import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const ReplyBox = ({ postId, onReplyAdded }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await axios.post(`http://localhost:5000/api/forum/${postId}/reply`, {
      text,
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
