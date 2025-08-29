import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./AboutPage.css";
import { GoGoal } from "react-icons/go";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { FaBook } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaFacebook, FaGithub } from "react-icons/fa";

const About = ({ isLoggedIn, handleLogout }) => {
  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {}
      <div className="about-page text-center">
        <h1>About Onudhabon</h1>
        <p>
          We believe every child deserves access to quality education,
          regardless of their circumstances. Onudhabon connects dedicated
          volunteers with underserved communities to create lasting educational
          impact.
        </p>
      </div>

      {}
      <Container className="py-4">
        <Row className="g-4">
          <Col md={6}>
            <Card className="about-card text-center">
              <div className="about-icon">
                <GoGoal size={40} color="#007bff" />
              </div>
              <h5>Our Mission</h5>
              <p>
                Our mission is to make education accessible to every child in
                Bangladesh by building a network of volunteers, educators, and
                communities working together.
              </p>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="about-card text-center h-100">
              <div className="about-icon">
                <FaGlobeAmericas size={40} color="#007bff" />
              </div>
              <h5>Our Vision</h5>
              <p>
                A platform where geographical, economic, and social barriers do
                not prevent children from receiving the education they need to
                reach their full potential and create positive change in their
                communities.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {}
      <Container className="py-5">
        <h2 className="section-title text-center mb-4">How Onudhabon Works</h2>
        <Row className="g-4 text-center">
          <Col xs={12} md={3} sm={6}>
            <Card className="about-card h-100">
              <div className="about-icon">
                <FaShieldAlt size={40} color="#007bff" />
              </div>

              <h5>Local Guardians</h5>
              <p>
                Register children in their communities and track their
                educational progress.
              </p>
            </Card>
          </Col>
          <Col md={4} sm={6}>
            <Card className="about-card">
              <div className="about-icon">
                <GiTeacher size={40} color="#007bff" />
              </div>
              <h5>Educators</h5>
              <p>
                Create and deliver educational content through online lectures
                and materials.
              </p>
            </Card>
          </Col>
          <Col md={4} sm={6}>
            <Card className="about-card">
              <div className="about-icon">
                <FaHandHoldingHeart size={40} color="#007bff" />
              </div>
              <h5>Donors & Supporters</h5>
              <p>
                Provide funding for materials, infrastructure, and operational
                needs.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {}
      <Container className="py-5">
        <h2 className="section-title text-center mb-4">Developer Team</h2>
        <Row className="g-4 text-center">
          <Col xs={12} md={4} sm={6}>
            <Card className="team-card h-100">
              <Card.Img
                variant="top"
                src="/images/abonty-rahman.jpg"
                alt="Abonty Rahman"
              />
              <Card.Body>
                <Card.Title>Abonty Rahman</Card.Title>
                <div className="social-links">
                  <a
                    href="https://github.com/abonty360"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaGithub size={25} />
                  </a>
                  <a
                    href="https://www.facebook.com/abonty.rahman.360"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={25} />
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={6}>
            <Card className="team-card">
              <Card.Img
                variant="top"
                src="/images/nusrat-jahan.jpg"
                alt="Nusrat Jahan Tuli"
              />
              <Card.Body>
                <Card.Title>Nusrat Jahan Tuli</Card.Title>
                <div className="social-links">
                  <a
                    href="https://github.com/tuwuli07"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaGithub size={25} />
                  </a>
                  <a
                    href="https://www.facebook.com/nusratjahantuli2"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={25} />
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={6}>
            <Card className="team-card">
              <Card.Img
                variant="top"
                src="/images/zahin-zia.jpeg"
                alt="Zahin Zia Heya"
              />
              <Card.Body>
                <Card.Title>Zahin Zia Heya</Card.Title>
                <div className="social-links">
                  <a
                    href="https://github.com/heyazahin"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaGithub size={25} />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100057636812852"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={25} />
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default About;
