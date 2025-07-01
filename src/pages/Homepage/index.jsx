import {Carousel} from "antd";
import Gallery from "../../components/pages/Homepage/Gallery/index.jsx";
import Services from "../../components/pages/Homepage/Services/index.jsx";
import Category from "../../components/pages/Homepage/Category/index.jsx";
import Brands from "../../components/pages/Homepage/Brands/index.jsx";
import Subscribe from "../../components/pages/Homepage/Subscribe/index.jsx";
import DailyProduct from "../../components/pages/Homepage/DailyProduct/index.jsx";
import "./styles.scss";

const Homepage = () => {
  return (
    <div className="Homepage">
      <Gallery/>
      <Brands/>
      {/* <Services/> */}
      <Category/>
      <DailyProduct/>
      <Subscribe/>
    </div>
  );
}

export default Homepage