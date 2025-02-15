import Footer from "../components/Footer";
import CategoryHome from "../components/CategoryHome";
import HomeHero from "../components/HomeHero";
import "../styles/main-style.css";
import GridHome from "../components/GridHome";

function Home() {
  return (
    <>
      <HomeHero />
      <GridHome />
      <Footer />
    </>
  );
}

export default Home;
