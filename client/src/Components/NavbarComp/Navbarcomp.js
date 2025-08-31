import React, { Component } from 'react'
import { Navbar, Nav, Container, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/navbar_logo.png'
import topBarLogo from '../../assets/hero-section-logo.png'
import './Navbarcomp.css';


export default class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { scrolled: false };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY > 260) {
            this.setState({ scrolled: true });
        } else {
            this.setState({ scrolled: false });
        }
    };
    render() {
        const { isLoggedIn, handleLogout } = this.props;
        const { scrolled } = this.state;
        return (
            <header className={`site-header fixed-top ${scrolled ? 'scrolled' : ''}`}>
                <Navbar expand="md" className="top-bar navbar-dark">
                    <Container fluid>
                        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 m-0">
                            <Image src={topBarLogo} alt="Onudhabon Logo" height="60" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="topbar-nav" className="border-0" />
                        <Navbar.Collapse id="topbar-nav">
                            <Nav className="me-auto mx-4">
                                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                <Nav.Link as={Link} to="/lecture">Lectures</Nav.Link>
                                <Nav.Link as={Link} to="/material">Materials</Nav.Link>
                                <Nav.Link as={Link} to="/about">About</Nav.Link>
                                <Nav.Link as={Link} to="/forum">Forum</Nav.Link>
                            </Nav>
                            <Form className="d-flex align-items-center gap-2">
                                <Button
                                    variant="outline-light"
                                    className="custom-search-btn"
                                >
                                    <i className="bi bi-search"></i> Search
                                </Button>
                                {isLoggedIn ? (
                                    <>
                                        <span className="text-white">Welcome, User</span>
                                        <Button
                                            variant="light"
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-in-right me-1"></i> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="light"
                                        as={Link}
                                        to="/login"
                                    >
                                        <i className="bi bi-box-arrow-in-right"></i> Login
                                    </Button>
                                )}
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Navbar expand="lg" className="shadow-sm custom-navbar">
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
                                    <>
                                        <span>Welcome, User</span>
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
            </header>
        );
    }
}
