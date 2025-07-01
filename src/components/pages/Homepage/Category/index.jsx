import { Avatar, Button, Card, Image, Row, Carousel } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "./category.js";
import { ArrowRightOutlined } from "@ant-design/icons";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Autoplay, Pagination, Navigation } from "swiper";
import useCallApi from "../../../../hook/useCallApi.js";
import Spinner from "../../../common/Spinner/index.jsx";
import { getCategory } from "../../../../services/shop.service.js";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import AntImage from "../../../common/AntImage/index.jsx";

const Category = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const carouselRef = useRef(null);
  const { send: fetchCategoris, loading } = useCallApi({
    callApi: getCategory,
    success: (res) => {
      // console.log(res);
      const categoris = res?.data?.items || [];
      const pairs = [];
      for (let i = 0; i < categoris.length; i += 2) {
        const pair = [];

        if (categoris[i]) {
          pair.push({
            avatar: categoris[i].avatar,
            name: categoris[i].name,
            id: categoris[i].id,
          });
        }

        if (categoris[i + 1]) {
          pair.push({
            avatar: categoris[i + 1].avatar,
            name: categoris[i + 1].name,
            id: categoris[i+1].id,

          });
        }

        pairs.push(pair);
      }
      setCategory(pairs);

      // console.log("category", category);
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    fetchCategoris();
  }, []);

  // return (
  //   <div style={{ marginBottom: 48, marginLeft: 30, marginRight: 30 }}>
  //     <h2 style={{ textAlign: "left" }}>Danh Mục</h2>
  //     <div>
  //       <Swiper
  //         slidesPerView={1}
  //         breakpoints={{
  //           524: {
  //             slidesPerView: 2,
  //             autoplay: false,
  //           },
  //           767: {
  //             slidesPerView: 3,
  //             autoplay: false,
  //           },
  //         }}
  //         autoplay={{
  //           delay: 3000,
  //           disableOnInteraction: false,
  //         }}
  //         spaceBetween={90}
  //         pagination={{
  //           clickable: true,
  //         }}
  //         modules={[Pagination, Autoplay]}
  //         className="mySwiper"
  //       >
  //         {category.map((item, index) => (
  //           <SwiperSlide key={index}>
  //             <Card
  //               cover={<img src={item?.img} alt="Cover" />}
  //               style={{
  //                 width: "100%",
  //                 position: "relative",
  //                 padding: "0 !important",
  //               }}
  //             >
  //               <Button
  //                 icon={<ArrowRightOutlined />}
  //                 style={{
  //                   position: "absolute",
  //                   top: "70%",
  //                   left: "50%",
  //                   transform: "translate(-50%, -50%)",
  //                   width: "60%",
  //                   height: "40px",
  //                 }}
  //                 onClick={() => {
  //                   navigate("/shop");
  //                 }}
  //               >
  //                 {item?.title}
  //               </Button>
  //             </Card>
  //           </SwiperSlide>
  //         ))}
  //       </Swiper>
  //     </div>
  //   </div>
  // );
  return (
    <div
      style={{ marginBottom: 48, paddingTop: 10, backgroundColor: "#ffffff" }}
    >
      <h2 style={{ textAlign: "left", paddingLeft: 30 }}>DANH MỤC</h2>
      {loading ? (
        <div style={{ display: "block" }}>
          <Spinner />
        </div>
      ) : (
        <>
          <div style={{}}>
            <div
              style={{ position: "relative", height: "300px", width: "100%" }}
            >
              <Swiper
                slidesPerView={10}
                slidesPerGroup={5}
                spaceBetween={0}
                navigation
                // pagination={{ clickable: true }}
                modules={[Pagination, Navigation]}
                breakpoints={{
                  360: {
                    slidesPerView: 2,
                  },

                  414: {
                    slidesPerView: 3,
                  },
                  560: {
                    slidesPerView: 4,
                  },
                  850: {
                    slidesPerView: 5,
                  },
                  940: {
                    slidesPerView: 6,
                  },
                  1050: {
                    slidesPerView: 7,
                  },
                  1200: {
                    slidesPerView: 8,
                  },
                  1300: {
                    slidesPerView: 9,
                  },
                  1446: {
                    slidesPerView: 10,
                  },
                }}
              >
                {category.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    {item.map((item, idx) => (
                      <Link
                        to={`/category/${item?.id}`}
                        key={idx}
                        className="category"
                        style={{
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 149,
                          width: 126.5,
                          border: "1px, solid, #EEEEEE",
                        }}
                      >
                        <img
                          src={item.avatar}
                          alt={item.name}
                          style={{ width: "83px", height: "83px" }}
                        />
                        <span
                          style={{
                            color: "rgba(0, 0, 0, .8)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
