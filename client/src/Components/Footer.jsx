import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-light text-dark py-5 mt-5 border-top">
    <Container>
      <Row>
        <Col md={4} className="mb-4">
          <h5>About Onudhabon</h5>
          <p>
            Onudhabon is a community-driven initiative focused on providing
            access to quality education for children in South Asia. We
            collaborate with local educators, volunteers, and organizations to
            create sustainable change.
          </p>
        </Col>
        <Col md={4} className="mb-4">
          <h5>Navigation</h5>
          <ul className="list-unstyled">
            <li>
              <Link className="text-dark" to="/home">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-dark" to="/lecture">
                Lectures
              </Link>
            </li>
            <li>
              <Link className="text-dark" to="/material">
                Materials
              </Link>
            </li>
            <li>
              <Link className="text-dark" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-dark" to="/settings">
                Settings
              </Link>
            </li>

            <li>
              <Link className="text-dark" to="/forum">
                Forum
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={4} className="mb-4">
          <h5>Connect</h5>
          <ul className="list-unstyled">
            <li>
              <a className="text-dark" href="#">
                Facebook
              </a>
            </li>
            <li>
              <a className="text-dark" href="#">
                Instagram
              </a>
            </li>
            <li>
              <a className="text-dark" href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <div className="text-center mt-4 small">
        © 2025 Onudhabon. All rights reserved.
      </div>
    </Container>
  </footer>
);

export default Footer;
