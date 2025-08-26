import { Carousel } from "react-bootstrap";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

const HomeSlider = () => {
  return (
    <Carousel interval={3000} fade pause={false}>
      <Carousel.Item>
        <img className="d-block w-100" src={banner1} alt="Slide 1" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={banner2} alt="Slide 2" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={banner3} alt="Slide 3" />
      </Carousel.Item>
    </Carousel>
  );
};

export default HomeSlider;
