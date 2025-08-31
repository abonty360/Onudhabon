import React , {useEffect} from "react";
import { Container } from "react-bootstrap";
import aboutHeroImg from "../../assets/forum-hero.jpg";
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
        <h1 className="display-5 fw-bold">Volunteer Forum</h1>
        <p className="lead">
          Share ideas, ask questions, and collaborate with fellow volunteers.
        </p>
      </Container>
    </section>
  );
};

export default ForumHero;
