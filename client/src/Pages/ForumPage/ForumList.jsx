import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumCard from "../../Components/ForumComp/ForumCard";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";

// STEP 1: Import the new CSS file
import "./ForumPage.css";

const ForumList = ({ isLoggedIn, handleLogout }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/forum")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {/* The typo is already fixed here */}
      <div className="forum-page-container">
        <Container className="mt-4">
          {/* STEP 2: Add the "forum-header" class to this div */}
          <div className="d-flex justify-content-between align-items-center forum-header">
            <h2>Volunteer Forum</h2>
            <Link to="/forum/new">
              <Button variant="success">+ New Post</Button>
            </Link>
          </div>

          {posts.length > 0 ? (
            posts.map((post) => <ForumCard key={post._id} post={post} />)
          ) : (
            // STEP 3: Add a class to the "no posts" message for better styling
            <p className="no-posts-message">
              No posts yet. Be the first to contribute!
            </p>
          )}
        </Container>

        <Footer />
      </div>
    </>
  );
};

export default ForumList;