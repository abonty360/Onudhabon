// In ForumList.jsx
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ForumCard from "../../Components/ForumComp/ForumCard";
import ForumHero from "../../Components/HeroSection/ForumHero.jsx";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./ForumPage.css";
import { useSearchParams } from 'react-router-dom';

const ForumList = ({ isLoggedIn, handleLogout }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const POSTS_PER_PAGE = 5; // Match the default limit on the backend
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // We define the function to fetch posts
  const fetchPosts = (page) => {
    axios
      .get(`http://localhost:5000/api/forum?page=${page}&limit=${POSTS_PER_PAGE}`)
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  // This one useEffect is enough to fetch the posts when the component loads
  useEffect(() => {
    fetchPosts(currentPage); // Fetch posts for the current page
  }, [currentPage]);
  // This useEffect for handling login status is correct

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the window to the top
  }, [currentPage]);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);
      }
    }
  }, [isLoggedIn]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      // This will update the URL to "?page=..." and trigger a re-render
      setSearchParams({ page: newPage.toString() });
    }
  };

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <ForumHero />
      <div className="forum-page-container">
        <Container className="mt-4">
          <div className="d-flex justify-content-between align-items-center forum-header">
            <h2>Posts</h2>
            <Link to="/forum/new">
              <Button variant="success">+ New Post</Button>
            </Link>
          </div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <ForumCard key={post._id} post={post} onPostUpdate={() => fetchPosts(currentPage)} />
            ))
          ) : (
            <p className="no-posts-message">
              No posts yet. Be the first to contribute!
            </p>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center my-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

        </Container>
        <Footer />
      </div>
    </>
  );
};

export default ForumList;