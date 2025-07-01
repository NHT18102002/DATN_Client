import { Image, Row } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import useCallApi from "../../../../hook/useCallApi.js";
import { getAllShop } from "../../../../services/shop.service.js";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./style.scss";
import AntImage from "../../../common/AntImage/index.jsx";


const Brands = () => {
  const [brand, setBrand] = useState([]);

  const { send: fetchShop } = useCallApi({
    callApi: getAllShop,
    success: (res) => {
      const firtBrand = res?.data?.items.slice(0, 12) || [];
      console.log(brand);
      setBrand([
        ...firtBrand.map((item) => ({
          logo: item?.logo,
        })),
      ]);
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    fetchShop();
  }, []);

  return (
    <div style={{ marginBottom: 48, marginLeft: 30, marginRight:30 }}>
      <h2 style={{ textAlign: "left" }}>Thương hiệu nổi bật</h2>
      <div>
        <Swiper
          slidesPerView={1}
          // loop={true}
          breakpoints={{
            524: {
              slidesPerView: 2,
              autoplay: false,
            },
            767: {
              slidesPerView: 3,
              autoplay: false,
            },
            991: {
              slidesPerView: 4,
            },
            1400: {
              slidesPerView: 5,
            },
          }}
          // autoplay={{
          //   delay: 2000,
          //   disableOnInteraction: false,
          //   pauseOnMouseEnter: true,
          // }}
          spaceBetween={50}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {brand.map((item, index) => (
            <SwiperSlide
              style={{ padding: "0px 0px 50px 0px ", marginRight: "0px" , backgroundColor : "rgba(0, 0, 0, 0.00"}}
              key={index}
            >
              <AntImage
                className="logoShop"
                style={{
                  padding: "0 0",
                  border: "1px solid #ccc",
                  transition: "all 0.3s ease-in-out",
                  // borderRadius: 8,
                }}
                src={item?.logo}
                objectFit="contain"
                layout={"fixed"}
                preview={false}
                height={120}
                width={120}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Brands;
