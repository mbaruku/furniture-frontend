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
    <div >
      {/* Top Navigation */}
      <Topbar showSearch={false} />

      {/* Main Content */}
      <main>
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

      {/* Bottom Navigation for Mobile */}
      
    </div>
    <div>
    <BottomNavbar />
    </div>
    </>
  );
};

export default HomePage;
