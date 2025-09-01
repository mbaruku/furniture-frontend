import Topbar from "../components/NavMenu";
import HomeSlider from "../components/HomeSlider";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import VideoSection from "../components/VideoSection";
import BottomNavbar from "../components/BottomNavbar";

import './HomePage.css'

const HomePage = () => {
  return (
    <>
      <div className="home-page-container">
        {/* Top Navigation */}
        <Topbar showSearch={false} />

        {/* Main Content */}
        <main className="content">
          <HomeSlider />
          <WhyChooseUs />
          <VideoSection />
          <Testimonials />
          <ProductSection title="Bidhaa Mpya" categoryType="new" />
          <ProductSection title="Bidhaa Zinazouzwa Sana" categoryType="best" />
          <ProductSection title="Bidhaa kwa Punguzo" categoryType="discount" />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Bottom Navigation (Fixed) */}
      <BottomNavbar />
    </>
  );
};

export default HomePage;
