import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ForumCard = ({ post }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="text-muted mb-2">
          By {post.author || "Anonymous"} •{" "}
          {new Date(post.createdAt).toLocaleString()}
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
        <Link to={`/forum/${post._id}`}>
          <Button variant="outline-primary">
            View Details ({post.replies?.length || 0} replies)
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ForumCard;
