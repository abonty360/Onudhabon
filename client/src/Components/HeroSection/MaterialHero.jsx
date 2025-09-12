import React , {useEffect} from "react";
import { Container } from "react-bootstrap";
import aboutHeroImg from "../../assets/material-hero.jpg";
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
        <h5>Home/Materials</h5>
        <h1 className="display-5 fw-bold">Learning Resources for Every Journey</h1>
        <p className="lead">
          Access a growing library of study materials, guides, and tools created by 
          our dedicated community. From foundational concepts to advanced topics, 
          these resources are here to support every learner`s path toward success.
        </p>
      </Container>
    </section>
  );
};

export default ForumHero;
