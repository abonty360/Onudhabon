import React, { useState } from 'react';
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomePage.css';
import NavbarComponent from '../../Components/NavbarComp/Navbarcomp';
import Footer from '../../Components/Footer';

const demoArticles = [
  {
    id: 1,
    category: 'Milestone',
    date: '1/15/2025',
    title: 'Onudhabon Reaches 10,000 Students Milestone',
    excerpt: 'We\'re proud to announce that our platform has now reached over 10,000 underprivileged children across rural South Asian communities,...',
    content: 'We\'re proud to announce that our platform has now reached over 10,000 underprivileged children across rural South Asian communities. This milestone highlights the impact of collaborative education programs and grassroots volunteerism.',
    image: '/images/article1.jpg'
  },
  {
    id: 2,
    category: 'Partnership',
    date: '1/10/2025',
    title: 'New Partnership with Bangladesh Education Foundation',
    excerpt: 'Onudhabon partners with the Bangladesh Education Foundation to expand our reach and provide more comprehensive educational...',
    content: 'Onudhabon has officially partnered with the Bangladesh Education Foundation to enhance our resource pool and volunteer network. This collaboration allows us to support more children and develop localized content.',
    image: '/images/article2.jpg'
  },
  {
    id: 3,
    category: 'Community',
    date: '1/5/2025',
    title: 'Volunteer Spotlight: Meet Our Amazing Local Guardians',
    excerpt: 'Discover the inspiring stories of our local guardians who dedicate their time to ensure every child in their community gets access to...',
    content: 'Meet the incredible local volunteers who support our mission. Their dedication to educating every child in their area makes a real difference and continues to inspire our global community.',
    image: '/images/article3.jpg'
  }
];


const Homepage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <>
      <NavbarComponent/>

      {/* Hero Section */}
      <section className="py-5 mt-5 bg-primary text-white text-center">
        <Container>
          <h1 className="display-5 fw-bold">Exploring Education Through Community</h1>
          <p className="lead mission-statement">Connecting volunteers, educators, and communities all across Bangladesh to provide quality education for underprivileged children.</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="light" as={Link} to="/login">Become a Volunteer</Button>
            <Button variant="outline-light">Donate Now</Button>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
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
              <img src="/images/navbar_logo.png" alt="Learning Materials" style={{ width: '48px', height: '48px' }} />
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
          <Button variant="outline-dark" size="sm">View All Posts</Button>
        </div>
        <Row>
          {demoArticles.map(article => (
            <Col key={article.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={article.image} alt={article.title} />
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-light text-dark border">{article.category}</span>
                    <small className="text-muted">{article.date}</small>
                  </div>
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>{article.excerpt}</Card.Text>
                  <Button variant="link" className="p-0" onClick={() => setSelectedArticle(article)}>Read More</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {selectedArticle && (
          <div className="mt-5 p-4 border rounded bg-light">
            <h3>{selectedArticle.title}</h3>
            <p><strong>{selectedArticle.date}</strong> | <span className="badge bg-secondary">{selectedArticle.category}</span></p>
            <p>{selectedArticle.content}</p>
            <Button variant="secondary" onClick={() => setSelectedArticle(null)}>Close</Button>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};
export default Homepage;
