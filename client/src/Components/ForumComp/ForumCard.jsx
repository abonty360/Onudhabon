import React, { useState, useEffect } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ForumCard = ({ post, onPostUpdate }) => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUserId(jwtDecode(token).id);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLike = async () => {
    if (!userId) {
      navigate("/login", {
        state: { message: "You need to log in to like posts." },
      });
      return;
    }
    await axios.patch(`http://localhost:5000/api/forum/${post._id}/like`, {
      userId,
    });
    onPostUpdate();
  };

  const handleDislike = async () => {
    if (!userId) {
      navigate("/login", {
        state: { message: "You need to log in to dislike posts." },
      });
      return;
    }
    await axios.patch(`http://localhost:5000/api/forum/${post._id}/dislike`, {
      userId,
    });
    onPostUpdate();
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="text-muted mb-2">
          By{" "}
          {post.author
            ? `${post.author.name} (${post.author.roles})`
            : "Anonymous"}{" "}
          • {new Date(post.createdAt).toLocaleString()}
        </Card.Subtitle>
        <div className="mb-2">
          {post.tags &&
            post.tags.map((tag, idx) => (
              <Badge key={idx} bg="primary" className="me-2">
                {tag}
              </Badge>
            ))}
        </div>
        <Card.Text>{post.content?.slice(0, 120)}...</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link to={`/forum/${post._id}`}>
            <Button variant="outline-primary">
              View Details ({post.replies?.length || 0} replies)
            </Button>
          </Link>
          <div>
            <Button
              variant="outline-success"
              size="sm"
              onClick={handleLike}
              className="me-2"
            >
              Like ({post.likes.length})
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleDislike}>
              Dislike ({post.dislikes.length})
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ForumCard;
