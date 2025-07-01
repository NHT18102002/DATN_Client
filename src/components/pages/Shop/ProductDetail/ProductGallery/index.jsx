import { Image, Row } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper";
import React, { useState, useRef } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import "./style.scss";

const ProductGallery = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);
  return (
    <>
      {/*Big image to view product*/}
      <Row>
        <Swiper
          style={{
            "--swiper-navigation-color": "#000",
            "--swiper-pagination-color": "#000",
            width: 450,
          }}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          spaceBetween={90}
          modules={[Autoplay, Navigation, Thumbs]}
          className="mySwiper2"
        >
          {images?.map((image, index) => (
            <SwiperSlide
              key={index}
              style={{
                border: "2px solid #f6f6f6",
                boxShadow: "0 4px 12px rgba(55, 54, 54, 0.15)",
              }}
            >
              <Image key={index} src={image} width={"100%"} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Row>
      {/*Product image slider*/}
      <Row style={{ marginTop: 5 }}>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={5}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper3"
          navigation={true}
        >
          {images?.map((image, index) => (
            <SwiperSlide
              style={{
                width: 92,
              }}
              key={index}
            >
              <Image preview={false} key={index} src={image} width={"100%"} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Row>
    </>
  );
};

export default ProductGallery;
