import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, ListGroup } from "react-bootstrap";
import ReplyBox from "../Components/ReplyBox";

const ForumDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forum/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="text-muted mb-2">
            By {post.author || "Anonymous"} •{" "}
            {new Date(post.createdAt).toLocaleString()}
          </Card.Subtitle>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
      </Card>

      <h5>Replies</h5>
      <ListGroup className="mb-3">
        {post.replies && post.replies.length > 0 ? (
          post.replies.map((reply, idx) => (
            <ListGroup.Item key={idx}>
              <strong>{reply.author || "User"}:</strong> {reply.text}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No replies yet.</ListGroup.Item>
        )}
      </ListGroup>

      <ReplyBox
        postId={id}
        onReplyAdded={() => {
          // refresh post after adding reply
          axios
            .get(`http://localhost:5000/api/forum/${id}`)
            .then((res) => setPost(res.data))
            .catch((err) => console.error(err));
        }}
      />
    </Container>
  );
};

export default ForumDetail;
