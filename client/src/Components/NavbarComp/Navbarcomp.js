import React, { Component } from 'react'
import { Navbar, Nav, Container, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/navbar_logo.png'
import './Navbarcomp.css';


export default class NavbarComponent extends Component {
    render() {
        const { isLoggedIn, handleLogout } = this.props;
        return (
            <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm custom-navbar">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                        <Image src={logo} alt="Onudhabon Logo" height="60" />


                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="me-auto mx-4">
                            <Nav.Link as={Link} to="/home">Home</Nav.Link>
                            <Nav.Link as={Link} to="/lecture">Lectures</Nav.Link>
                            <Nav.Link as={Link} to="/material">Materials</Nav.Link>
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                            <Nav.Link as={Link} to="/forum">Forum</Nav.Link>
                        </Nav>
                        <Form className="d-flex align-items-center gap-2">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            {isLoggedIn ? (
                                <Button
                                    variant="primary"
                                    onClick={handleLogout}
                                    className="custom-login-btn"
                                >
                                    <i className="bi bi-box-arrow-in-right me-1"></i> Logout
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    as={Link}
                                    to="/login"
                                    className="custom-login-btn"
                                >
                                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                                </Button>
                            )}
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}
