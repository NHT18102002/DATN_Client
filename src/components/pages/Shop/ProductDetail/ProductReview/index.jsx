import { Row, Button, Col, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Rate } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import styles from "./index.module.css";
import { Select, Checkbox, Space } from "antd";
import { formatDateTime } from "../../../../../utils/string";
import AntButton from "../../../../common/Button";
const ProductReview = ({ review, estimateReview }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { Option } = Select;
  const [filterRate, setFilterRate] = useState(null); // Lọc theo số sao
  const [filterHasImage, setFilterHasImage] = useState(false); // Có ảnh
  const [filterHasContent, setFilterHasContent] = useState(false); // Có nội dung
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [averageRate, setAverageRate] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Hoặc 10 tùy bạn
  const handleClick = (rate) => {
    setSelectedRate(rate);
  };
  useEffect(() => {
    if (review?.items) {
      const filtered = review.items.filter((item) => {
        const byRate = filterRate ? item.rate === filterRate : true;
        const byImage = filterHasImage ? item.medias?.length > 0 : true;
        const byContent = filterHasContent ? item.content?.trim() !== "" : true;
        return byRate && byImage && byContent;
      });
      const averageRate =
        review.items.length > 0
          ? review.items.reduce((sum, r) => sum + r.rate, 0) / review.totalItems
          : 0;
      setFilteredItems(filtered);
      setAverageRate(averageRate);
    } else {
      setFilteredItems([]);
    }
    setCurrentPage(1);
  }, [review, filterRate, filterHasImage, filterHasContent]);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <div className={styles.ProductReview}>
        <div className={styles.tittle}>ĐÁNH GIÁ SẢN PHẨM</div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {" "}
            <div>
              <span
                style={{
                  color: "#d0011b",
                  fontSize: 30,
                  verticalAlign: "start",
                }}
              >
                {averageRate}
              </span>
              <span
                style={{
                  color: "#d0011b",
                  fontSize: 18,
                  marginLeft: "5px",
                  fontWeight: 500,
                }}
              >
                trên 5
              </span>
            </div>
            <Rate
              className={styles.rateStarAll}
              allowHalf
              value={averageRate}
              disabled
            />
          </div>
          <div>
            <Space style={{ marginTop: 10 }} wrap>
              <Button
                className={styles.Button}
                type={selectedRate === null ? "primary" : "default"}
                onClick={() => {
                  handleClick(null), setFilterRate(null);
                }}
              >
                Tất cả
              </Button>
              <Button
                className={styles.Button}
                type={selectedRate === 5 ? "primary" : "default"}
                onClick={() => {
                  handleClick(5), setFilterRate(5);
                }}
              >
                5 sao {"("}
                {estimateReview?.rateCounts?.[5]}
                {")"}
              </Button>
              <Button
                className={styles.Button}
                type={selectedRate === 4 ? "primary" : "default"}
                onClick={() => {
                  handleClick(4), setFilterRate(4);
                }}
              >
                4 sao {"("}
                {estimateReview?.rateCounts?.[4]}
                {")"}
              </Button>
              <Button
                className={styles.Button}
                type={selectedRate === 3 ? "primary" : "default"}
                onClick={() => {
                  handleClick(3), setFilterRate(3);
                }}
              >
                3 sao {"("}
                {estimateReview?.rateCounts?.[3]}
                {")"}
              </Button>
              <Button
                className={styles.Button}
                type={selectedRate === 2 ? "primary" : "default"}
                onClick={() => {
                  handleClick(2), setFilterRate(2);
                }}
              >
                2 sao {"("}
                {estimateReview?.rateCounts?.[2]}
                {")"}
              </Button>
              <Button
                className={styles.Button}
                type={selectedRate === 1 ? "primary" : "default"}
                onClick={() => {
                  handleClick(1), setFilterRate(1);
                }}
              >
                1 sao {"("}
                {estimateReview?.rateCounts?.[1]}
                {")"}
              </Button>
              <Checkbox
                checked={filterHasImage}
                onChange={(e) => setFilterHasImage(e.target.checked)}
              >
                Có hình ảnh {"("}
                {estimateReview?.totalReviewsWithImages}
                {")"}
              </Checkbox>
              <Checkbox
                checked={filterHasContent}
                onChange={(e) => setFilterHasContent(e.target.checked)}
              >
                Có bình luận {"("}
                {estimateReview?.totalReviewsWithContent}
                {")"}
              </Checkbox>
            </Space>
          </div>
        </div>
        {paginatedItems?.map((item) => (
          <div className={styles.Review} key={item.id}>
            <div
              style={{
                width: 50,
                height: 50,
              }}
            >
              <Image
                className={styles.img}
                src={item?.owner?.avatar}
                //   alt={optionValue}
                preview={false}
                width={50}
                height={50}
              />
            </div>
            {/* hẹ hẹ hẹ */}
            <div className={styles.review}>
              <div className={styles.tittlReview}>
                <div className={styles.ownerName}>{item?.owner?.username}</div>
                <Rate className={styles.rateStar} value={item?.rate} disabled />
                <div className={styles.date}>
                  {formatDateTime(item?.createdAt)}

                  {item?.orderItem?.PriceProductDetail?.selectionOptions && (
                    <div className={styles.variantText}>
                      Phân loại:{" "}
                      {item.orderItem.PriceProductDetail.selectionOptions
                        .map(
                          (attr) =>
                            `${attr.title}: ${attr.options
                              ?.map((opt) => opt.name)
                              .join(", ")}`
                        )
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.contentReview}>{item.content}</div>
              <div className={styles.imagetReview}>
                <Row className={styles.listImage}>
                  {item.medias && // Nếu item?.medias tồn tại và không null/undefined
                    item?.medias?.map(
                      (
                        image,
                        index // Thực hiện map trực tiếp
                      ) => (
                        <Image key={index} src={image} width={72} height={72} />
                      )
                    )}
                </Row>
                {/*Product image slider*/}
              </div>
            </div>
          </div>
        ))}
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredItems.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: 20 }}
        />
        {/* <Row></Row> */}
      </div>
    </>
  );
};
export default ProductReview;
