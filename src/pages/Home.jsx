import Footer from "../components/Footer";
// import CategoryHome from "../components/CategoryHome";
import HomeHero from "../components/HomeHero";
import "../styles/main-style.css";
import GridHome from "../components/GridHome";

import FeaturedOffices from "../components/FeaturedOffices";
import TrustSection from "../components/TrustSection";
import Testimonials from "../components/Testimonials";
import Chatbot from "../components/charbot";

function Home() {
  return (
    <>
      <div className="pt-16">
        <HomeHero />
        <GridHome />
        <FeaturedOffices />
        <TrustSection />
        <Testimonials />
        <Chatbot />
        <Footer />
      </div>
    </>
  );
}

export default Home;
