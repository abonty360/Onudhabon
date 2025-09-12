import React , {useEffect} from "react";
import { Container } from "react-bootstrap";
import aboutHeroImg from "../../assets/lecture-hero.jpg";
import "./Hero.css";

const ForumHero = () => {
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
            backgroundImage: `url(${aboutHeroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginTop: "calc(-1 * var(--header-offset))",
            paddingTop: "var(--header-height)",
            paddingBottom: "80px",
          }}
        >
      <div className="overlay"></div>
      <Container>
        <h5>Home/Lectures</h5>
        <h1 className="display-5 fw-bold">Inspiring Minds, One Lecture at a Time</h1>
        <p className="lead">
          Dive into a world of knowledge where passionate educators and volunteers share 
          their expertise. Our lectures are designed to spark curiosity, build skills, 
          and empower learners to reach their full potential — no matter where they are.
        </p>
      </Container>
    </section>
  );
};

export default ForumHero;
