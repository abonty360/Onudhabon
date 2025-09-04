import React , {useEffect} from "react";
import { Container } from "react-bootstrap";
import aboutHeroImg from "../../assets/hero-section.jpg";
import "./Hero.css";

const AboutHero = () => {
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
        <h1>About Onudhabon</h1>
        <p>
          We believe every child deserves access to quality education,
          regardless of their circumstances. Onudhabon connects dedicated
          volunteers with underserved communities to create lasting educational
          impact.
        </p>
      </Container>
    </section>
  );
};

export default AboutHero;
