import { Carousel, notification, Col, Row } from "antd";
import { useEffect, useState, useRef } from "react";
import { getAllSliders } from "../../../../services/slider.service.js";
import useCallApi from "../../../../hook/useCallApi.js";
import { getProductDetail } from "../../../../services/shop.service.js";
import Spinner from "../../../common/Spinner/index.jsx";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./style.scss";
const contentStyle = {
  height: "600px",
  color: "#fff",
  lineHeight: "600px",
  textAlign: "center",
  background: "#364d79",
  backgroundImage:
    "url('https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/w_1824,c_limit/972e353f-99a4-4838-9526-d89fd1d2eb3e/nike-just-do-it.jpg')",
};
const Gallery = () => {
  const [sliders, setSliders] = useState([]);
  const [bonusSliders, setBonusSliders] = useState([]);
  const carouselRef = useRef(null);
  const { send: fetchSliders, loading } = useCallApi({
    callApi: getAllSliders,
    success: (res) => {
      // console.log(res)
      const majorBanners = res?.data?.items.slice(0, 6) || [];
      const bonusBanner = res?.data?.items.slice(6, 8) || [];
      setSliders([
        ...majorBanners.map((item) => ({
          url: item?.url,
        })),
      ]);
      setBonusSliders([
        ...bonusBanner.map((item) => ({
          url: item?.url,
          // height: "130px",
          // color: "#fff",
          // width: "400px",
          // // lineHeight: '900px',
          // textAlign: "center",
          // background: "#364d79",
          // backgroundImage: `url(${item?.url})`,
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
    fetchSliders();
  }, []);

  return (
    <div style={{ marginBottom: "48px" }}>
      {loading ? (
        <div style={{ display: "block" }}>
          <Spinner />
        </div>
      ) : (
        <>
          <Row
            style={{
              display: "flex",
              // gap: "13px",
              justifyContent: "space-beetween",
            }}
          >
            <Col
              span={16}
              style={{ position: "relative", height: "240px", width: "850px" }}
            >
              <LeftOutlined
                className="custom-left-arrow"
                style={{
                  fontSize: 20,
                  color: "#fff",
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  zIndex: 1,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingRight: 7,
                  backgroundColor: "rgba(0, 0, 0, .05",
                }}
                onClick={() => carouselRef.current?.prev()}
              />
              <Carousel
                effect="scrollx"
                ref={carouselRef}
                autoplay
                autoplaySpeed={5000}
              >
                {sliders.map((slider, index) => (
                  <div
                    style={{
                      // height: "235px",
                      // width: "850px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={slider.url}
                      alt={`banner-${index}`}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain", // hoặc "cover"
                      }}
                    />
                  </div>
                ))}
              </Carousel>

              {/* Mũi tên phải */}
              <RightOutlined
                className="custom-left-arrow"
                style={{
                  fontSize: 20,
                  color: "#fff",
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  zIndex: 1,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: 7,
                  backgroundColor: "rgba(0, 0, 0, .05",
                }}
                onClick={() => carouselRef.current?.next()}
              />
            </Col>
            <Col span={8} style={{ height: "115px", width: "400px" }}>
              <div
                style={{
                  display: "flex",

                  justifyContent: "space-beetween",
                  alignItems: "flex-end",
                  flexDirection: "column",
                }}
              >
                {bonusSliders.map((slider, index) => (
                  <img
                    src={slider.url}
                    alt={`banner-${index}`}
                    style={{
                      // height: "125px",
                      width: "99%",
                      objectFit: "contain", // hoặc "cover"
                    }}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Gallery;
