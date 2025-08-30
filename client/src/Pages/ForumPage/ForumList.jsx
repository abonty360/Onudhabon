import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumCard from "../../Components/ForumCard";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const ForumList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/forum")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Volunteer Forum</h2>
        <Link to="/forum/new">
          <Button variant="success">+ New Post</Button>
        </Link>
      </div>
      {posts.length > 0 ? (
        posts.map((post) => <ForumCard key={post._id} post={post} />)
      ) : (
        <p>No posts yet. Be the first to contribute!</p>
      )}
    </Container>
  );
};

export default ForumList;
