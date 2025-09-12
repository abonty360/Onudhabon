import React , {useEffect} from "react";
import { Container } from "react-bootstrap";
import studentHeroImg from "../../assets/student-hero.jpg";
import "./Hero.css";

const StudentprogressHero = () => {
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
        backgroundImage: `url(${studentHeroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        marginTop: "calc(-1 * var(--header-offset))",
        paddingTop: "var(--header-height)",
        paddingBottom: "80px",
      }}
    >
      <div className="overlay"></div>
      <Container>
        <h5>Home/Student Progress</h5>
        <h1 className="display-5 fw-bold">Student progress</h1>
        <p>
          Track student's progress
        </p>
      </Container>
    </section>
  );
};

export default StudentprogressHero;
