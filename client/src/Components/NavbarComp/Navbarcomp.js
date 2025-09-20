import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, Form, Button, Image } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/navbar_logo.png";
import topBarLogo from "../../assets/hero-section-logo.png";
import "./Navbarcomp.css";
import NotificationBell from "../Notification/NotificationBell";
import NotificationPanel from "../Notification/NotificationPanel";

const NavbarComponent = ({ isLoggedIn, handleLogout, user: passedUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(passedUser || null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 260);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/user/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (isLoggedIn && !passedUser) {
      fetchProfile();
    }
  }, [isLoggedIn, passedUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("token");
      if (token && isLoggedIn) {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/notifications/unread-count",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUnreadCount(res.data.count);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleBellClick = async () => {
    setIsPanelOpen((prev) => !prev);
    if (!isPanelOpen && unreadCount > 0) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          "http://localhost:5000/api/notifications/mark-as-read",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isPanelOpen) {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            "http://localhost:5000/api/notifications",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotifications(res.data);
        } catch (err) {
          console.error(err);
        }
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [isPanelOpen]);

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  const renderProfileLink = (className) => (
    <NavLink
      to="/profile"
      className={`d-flex align-items-center text-decoration-none gap-2 profile-link ${className}`}
    >
      {user && user.picture ? (
        <Image
          src={user.picture}
          alt="Profile"
          roundedCircle
          height="28"
          width="28"
        />
      ) : (
        <PersonCircle size={28} />
      )}
      <span className="fw-semibold">{user?.name || "User"}</span>
    </NavLink>
  );

  return (
    <header className={`site-header fixed-top ${scrolled ? "scrolled" : ""}`}>
      <Navbar expand="md" className="top-bar navbar-dark">
        <Container fluid>
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center gap-2 m-0"
          >
            <Image src={topBarLogo} alt="Logo" height="60" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="topbar-nav" className="border-0" />
          <Navbar.Collapse id="topbar-nav">
            <Nav className="me-auto mx-4">
              <Nav.Link as={NavLink} to="/home" className={getNavLinkClass}>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/lecture" className={getNavLinkClass}>
                Lectures
              </Nav.Link>
              <Nav.Link as={NavLink} to="/material" className={getNavLinkClass}>
                Materials
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" className={getNavLinkClass}>
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/forum" className={getNavLinkClass}>
                Forum
              </Nav.Link>
              {user?.roles === "Local Guardian" && (
                <Nav.Link
                  as={NavLink}
                  to="/studentprogress"
                  className={getNavLinkClass}
                >
                  Student Progress
                </Nav.Link>
              )}
              {user?.roles === "Admin" && (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/admin/review-lectures"
                    className={getNavLinkClass}
                  >
                    Review Lectures
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/admin/review-materials"
                    className={getNavLinkClass}
                  >
                    Review Materials
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/admin/review-students"
                    className={getNavLinkClass}
                  >
                    Review Students
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Form className="d-flex align-items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div ref={notificationRef} className="position-relative">
                    <NotificationBell
                      unreadCount={unreadCount}
                      onClick={handleBellClick}
                      bellColor="#ADD8E6"
                    />
                    {isPanelOpen && (
                      <NotificationPanel
                        notifications={notifications}
                        isLoading={isLoading}
                        onNotificationRead={handleNotificationRead}
                        onClearAll={handleClearNotifications}
                      />
                    )}
                  </div>
                  {renderProfileLink("text-white")}
                  <Button variant="light" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Logout
                  </Button>
                </>
              ) : (
                <Button variant="light" as={NavLink} to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Button>
              )}
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Navbar expand="lg" className="shadow-sm custom-navbar">
        <Container fluid>
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center gap-2"
          >
            <Image src={logo} alt="Logo" height="60" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto mx-4">
              <Nav.Link as={NavLink} to="/home" className={getNavLinkClass}>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/lecture" className={getNavLinkClass}>
                Lectures
              </Nav.Link>
              <Nav.Link as={NavLink} to="/material" className={getNavLinkClass}>
                Materials
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" className={getNavLinkClass}>
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/forum" className={getNavLinkClass}>
                Forum
              </Nav.Link>
              {user?.roles === "Local Guardian" && (
                <Nav.Link
                  as={NavLink}
                  to="/studentprogress"
                  className={getNavLinkClass}
                >
                  Student Progress
                </Nav.Link>
              )}
              {user?.roles === "Admin" && (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/admin/review-lectures"
                    className={getNavLinkClass}
                  >
                    Review Lectures
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/admin/review-materials"
                    className={getNavLinkClass}
                  >
                    Review Materials
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/admin/review-students"
                    className={getNavLinkClass}
                  >
                    Review Students
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Form className="d-flex align-items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div ref={notificationRef} className="position-relative">
                    <NotificationBell
                      unreadCount={unreadCount}
                      onClick={handleBellClick}
                      bellColor="#ADD8E6"
                    />
                    {isPanelOpen && (
                      <NotificationPanel
                        notifications={notifications}
                        isLoading={isLoading}
                        onNotificationRead={handleNotificationRead}
                        onClearAll={handleClearNotifications}
                      />
                    )}
                  </div>
                  {renderProfileLink("text-dark")}
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
    </header>
  );
};

export default NavbarComponent;
