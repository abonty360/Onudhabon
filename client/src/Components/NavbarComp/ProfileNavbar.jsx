import React, { Component } from 'react'
import { Navbar, Nav, Container, Form, Button, Image } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/navbar_logo.png'
import './ProfileNavbar.css';


export default class ProfileNavbar extends Component {
    render() {
        const { isLoggedIn, handleLogout, user} = this.props;
        const getNavLinkClass = ({ isActive }) =>
        isActive ? 'nav-link active-link' : 'nav-link';
        return (
            <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm custom-navbar">
                <Container fluid>
                        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
                            <Image src={logo} alt="Onudhabon Logo" height="60" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="main-navbar" />
                        <Navbar.Collapse id="main-navbar">
                            <Nav className="me-auto mx-4">
                                <Nav.Link as={NavLink} to="/home" className={getNavLinkClass}>Home</Nav.Link>
                                <Nav.Link as={NavLink} to="/lecture" className={getNavLinkClass}>Lectures</Nav.Link>
                                <Nav.Link as={NavLink} to="/material" className={getNavLinkClass}>Materials</Nav.Link>
                                <Nav.Link as={NavLink} to="/about" className={getNavLinkClass}>About</Nav.Link>
                                <Nav.Link as={NavLink} to="/forum" className={getNavLinkClass}>Forum</Nav.Link>
                            </Nav>
                            <Form className="d-flex align-items-center gap-2">

                                {isLoggedIn ? (
                                    <>
                                        <NavLink to="/profile" className="d-flex align-items-center text-decoration-none text-white gap-2">
                                            <PersonCircle size={28} /> 
                                            <span className="fw-semibold">
                                                {user?.name || 'User'} 
                                            </span>
                                        </NavLink>
                                        <Button
                                            variant="primary"
                                            onClick={handleLogout}
                                            className="custom-login-btn"
                                        >
                                            <i className="bi bi-box-arrow-in-right me-1"></i> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="primary"
                                        as={NavLink}
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