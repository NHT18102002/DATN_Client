import { Col, notification, Row } from "antd";
import { useParams } from "react-router-dom";

import ProductGallery from "../../../components/pages/Shop/ProductDetail/ProductGallery/index.jsx";
import ProductInfo from "../../../components/pages/Shop/ProductDetail/ProductInfo/index.jsx";
import ShopProduct from "../../../components/pages/Shop/ProductDetail/ShopProduct/index.jsx";
import "./style.scss";
import { useEffect, useState } from "react";
import ProductReview from "../../../components/pages/Shop/ProductDetail/ProductReview/index.jsx";
import { getProductDetail } from "../../../services/shop.service.js";
import { getShopByProductId } from "../../../services/shop.service.js";
import { getReviewProduct } from "../../../services/review.service.js";
import useCallApi from "../../../hook/useCallApi.js";
import Spinner from "../../../components/common/Spinner/index.jsx";
import MoreProduct from "../../../components/pages/Shop/ProductDetail/moreProduct/index.jsx";

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [shop, setShop] = useState({});
  const [review, setReview] = useState({});
  const [estimateReview, setEstimateReview] = useState({});
  const { id } = useParams();
  const { send: fetchProductDetail, loading } = useCallApi({
    callApi: getProductDetail,
    success: (res) => {
      // console.log(res.data);
      setProduct(res?.data);
    },
    error: (err) => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const { send: fetchShop } = useCallApi({
    callApi: getReviewProduct,
    success: (res) => {
      // console.log(res.data);
      setReview(res?.data);
      const initialSummary = {
        totalReviews: 0,
        totalReviewsWithImages: 0,
        reviewsWithImages: [], // Mảng để lưu các review có hình ảnh
        totalReviewsWithContent: 0,
        reviewsWithContent: [], // Mảng để lưu các review có nội dung
        totalRateSum: 0,
        rateCounts: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
        reviewsByRate: {
          // Đối tượng để lưu các review theo từng rate
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        },
        averageRate: 0, // Sẽ được tính sau
      };

      const estimateReview = res?.data?.items?.reduce((acc, review) => {
        // Đếm review có hình ảnh
        acc.totalReviews++;
        if (review.medias && review.medias.length > 0) {
          acc.totalReviewsWithImages++;
          acc.reviewsWithImages.push(review); // Thêm review vào mảng
        }

        // Kiểm tra và thêm review có nội dung
        if (review.content && review.content.trim().length > 0) {
          acc.totalReviewsWithContent++;
          acc.reviewsWithContent.push(review); // Thêm review vào mảng
        }

        // Đếm và thêm review theo rate
        const rate = review.rate;
        if (typeof rate === "number" && rate >= 1 && rate <= 5) {
          acc.rateCounts[rate]++;
          acc.reviewsByRate[rate].push(review); // Thêm review vào mảng của rate tương ứng
          acc.totalRateSum += rate;
        }

        return acc;
      }, initialSummary);

      if (estimateReview.totalReviews > 0) {
        // Làm tròn đến 2 chữ số thập phân
        estimateReview.averageRate = parseFloat(
          (estimateReview.totalRateSum / estimateReview.totalReviews).toFixed(1)
        );
      }

      // console.log("estimateReview", estimateReview);
      setEstimateReview(estimateReview);
    },
    error: (err) => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const { send: fetchReview } = useCallApi({
    callApi: getShopByProductId,
    success: (res) => {
      setShop(res?.data);
    },
    error: (err) => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    fetchProductDetail(id);
    fetchShop(id);
    fetchReview(id);
  }, [id]);

  return (
    <div className="hihi">
      {loading ? (
        <div style={{ height: 600 }}>
          <Spinner />
        </div>
      ) : (
        <Row style={{ backgroundColor: "#fff" }}>
          <Col
            xs={24}
            lg={9}
            style={{ padding: 8, backgroundColor: "#f5f5f5" }}
          >
            <ProductGallery images={product?.medias} />
          </Col>
          <Col
            xs={24}
            lg={15}
            style={{ padding: 8, backgroundColor: "#f5f5f5" }}
          >
            <ProductInfo product={product} />
          </Col>

          <Col
            xs={24}
            lg={24}
            style={{
              padding: "15px 15px 15px 10px",
              backgroundColor: "#f5f5f5",
              marginTop: 15,
            }}
          >
            <ShopProduct shop={shop} review={review} />
          </Col>
          <Row
            gutter={20}
            style={{
              // paddingRight: 10,
              width: "102%",
            }}
          >
            <Col
              xs={24}
              lg={24}
              style={{
                // paddingLeft: 30,
                // paddingTop: 30,
                // boxSizing:"border-box",
                backgroundColor: "#fff",
                marginTop: 15,
              }}
            >
              {/* <ProductInfo product={product} />
               */}
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#f5f5f5",
                  flexDirection: "column",
                  gap: 25,
                }}
              >
                <Row
                  style={{
                    backgroundColor: "#f5f5f5",
                    height: 50,
                    padding: 15,
                    // width: "90%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(235 235 235)",
                      height: 50,
                      padding: "14px 15px",
                      width: "100%",
                      textAlign: "left",
                      fontSize: "1.125rem",
                      // marginTop: "20px"
                    }}
                  >
                    MÔ TẢ SẢN PHẨM
                  </div>
                </Row>
                <Row
                  style={{
                    textAlign: "justify",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#f5f5f5",
                    padding: "15px 30px",
                    fontSize: "13px",
                  }}
                >
                  {product?.productId?.description}
                </Row>
              </div>
              <Row
                style={{
                  backgroundColor: "#f5f5f5",
                  marginTop: "15px",
                  padding: 25,
                }}
              >
                <ProductReview
                  review={review}
                  estimateReview={estimateReview}
                />
              </Row>
            </Col>
          </Row>
        </Row>
      )}
      <MoreProduct shop={shop} />
    </div>
  );
};

export default ProductDetail;
