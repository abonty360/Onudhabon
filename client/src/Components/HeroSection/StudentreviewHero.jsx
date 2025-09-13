import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import reviewHeroImg from "../../assets/review-hero.jpg";
import "./Hero.css";

const StudentReviewHero = () => {
    useEffect(() => {
        const header = document.querySelector(".site-header");
        if (header) {
            const h = header.offsetHeight;
            document.documentElement.style.setProperty("--header-offset", `${h}px`);
        }
    }, []);
    return (
        <section className="hero text-white text-center"
            style={{
                backgroundImage: `url(${reviewHeroImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginTop: "calc(-1 * var(--header-offset))",
                paddingTop: "var(--header-height)",
                paddingBottom: "80px",
            }}
        >
            <div className="overlay"></div>
            <Container>
                <h5>Home/Review Students</h5>
                <h1 className="display-5 fw-bold">Review Students</h1>
                <p className="lead">
                    Accept or decline student enrollments enrolled by Local Guardians.
                </p>
            </Container>
        </section>
    );
};

export default StudentReviewHero;
