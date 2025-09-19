import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomePage.css";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";

const Homepage = ({ isLoggedIn, handleLogout }) => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);
  return (
    <>
      <NavbarComponent
        isLoggedIn={isLoggedIn}
        user={user}
        handleLogout={handleLogout}
      />
      <div className="home-page">
        <section className="hero-section text-white text-center">
          <div className="p-0">
            <h1 className="display-5 fw-bold">
              Exploring Education Through Community
            </h1>
            <p className="lead mission-statement">
              Connecting volunteers, educators, and communities all across
              Bangladesh to provide quality education for underprivileged
              children.
            </p>
            {!isLoggedIn ? (
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Button variant="light" as={Link} to="/login">
                  Become a Volunteer
                </Button>
                <Button variant="outline-light" as={Link} to="/donation">
                  Donate Now
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <blockquote className="blockquote">
                  <p className="mb-0 fst-italic">
                    "One book, one pen, one child, and one volunteer can change
                    the world."
                  </p>
                </blockquote>
              </div>
            )}
          </div>
        </section>

        <Container className="py-4">
          <Row className="text-center">
            <Col md={3} className="mb-3">
              <div className="border rounded p-4">
                <i className="bi bi-people display-6 text-primary"></i>
                <h5 className="mt-2">10,000+</h5>
                <p className="mb-0">Students Reached</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="border rounded p-4">
                <img
                  src="/images/navbar_logo.png"
                  alt="Learning Materials"
                  style={{ width: "48px", height: "48px" }}
                />
                <h5 className="mt-2">2,500+</h5>
                <p className="mb-0">Learning Materials</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="border rounded p-4">
                <i className="bi bi-graph-up display-6 text-primary"></i>
                <h5 className="mt-2">850+</h5>
                <p className="mb-0">Active Volunteers</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="border rounded p-4">
                <i className="bi bi-award display-6 text-primary"></i>
                <h5 className="mt-2">1,200+</h5>
                <p className="mb-0">Success Stories</p>
              </div>
            </Col>
          </Row>
        </Container>

        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Latest Updates</h2>
            <Button variant="outline-dark" size="sm">
              View All Posts
            </Button>
          </div>
          <Row>
            {articles.map((article) => (
              <Col key={article.id} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={article.image}
                    alt={article.title}
                    style={{ objectFit: "cover", height: "220px" }}
                  />
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-light text-dark border">
                        {article.category}
                      </span>
                      <small className="text-muted">
                        {new Date(article.date).toLocaleDateString()}
                      </small>
                    </div>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.excerpt}</Card.Text>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {selectedArticle && (
            <div className="mt-5 p-4 border rounded bg-light">
              <h3>{selectedArticle.title}</h3>
              <p>
                <strong>
                  {new Date(selectedArticle.date).toLocaleDateString()}
                </strong>{" "}
                |{" "}
                <span className="badge bg-secondary">
                  {selectedArticle.category}
                </span>
              </p>
              <p>{selectedArticle.content}</p>
              <Button
                variant="secondary"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </Button>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};
export default Homepage;
