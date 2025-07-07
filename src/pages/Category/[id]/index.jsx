import { notification, Pagination, Row, Button, Col, List } from "antd";
import ProductCard from "../../../components/ProductCard/index.jsx";
import "./index.scss";
import { useEffect, useState } from "react";
import Filter from "../../../components/pages/Shop/Filter/index.jsx";
import { useWindowSize } from "../../../hook/useWindowSize.js";
import { SM } from "../../../constants.js";
import useCallApi from "../../../hook/useCallApi.js";
import { Link } from "react-router-dom";
import { CaretRightFilled, CaretDownFilled } from "@ant-design/icons";
import Spinner from "../../../components/common/Spinner/index.jsx";
// import { getAllProducts } from "../../../../services/shop.service.js";
import { getProductCategory } from "../../../services/shop.service.js";
import Gallery from "../../../components/pages/Homepage/Gallery/index.jsx";
import { getDetailCategory } from "../../../services/shop.service.js";
import { useParams } from "react-router-dom";
const Category = () => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState({});
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30; // số sản phẩm mỗi trang
  const [sortOption, setSortOption] = useState("latest");
  const windowSize = useWindowSize();
  const productPerOneRow = 6;
  const { send: fetchProductCategory, loading } = useCallApi({
    callApi: getProductCategory,
    success: (res) => {
      setProduct(res?.data);
      // setShuffledProducts(res?.dat?.products)
      // console.log(res.data);
    },
    error: (err) => {
      notification.error({
        // message: "Error",
        description: "Danh mục chưa có sản phẩm",
      });
      // window.location.reload();
      setProduct([]);
    },
  });

  const { send: fetchCcategory } = useCallApi({
    callApi: getDetailCategory,
    success: (res) => {
      setCategory(res?.data);
      const indexCategory = res?.data?.childCategory?.findIndex(
        (category) => category.id == id
      );
      // console.log("indexCategory", indexCategory);
      if (indexCategory >= 5) {
        setShowAllCategories(true);
      }
      // setShuffledProducts(res?.dat?.products)
      // console.log(res.data);
    },
    error: (err) => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    fetchProductCategory(id);
    fetchCcategory(id);
  }, [id]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const initialDisplayCount = 5; // Số lượng category hiển thị ban đầu
  // Lọc category để hiển thị
  // Hàm xử lý khi click nút "Xem thêm"
  const handleShowMore = () => {
    setShowAllCategories(true);
  };

  return (
    <>
      <Gallery />
      <Row>
        <Col className="listCategory" span={5}>
          <div
            style={{
              height: 50,
              borderBottom: "1px solid #ccc",
              padding: 10,
              width: "90%",
              color: "#000",
              fontSize: 18,
              textAlign: "start",
              fontWeight: 600,
            }}
          >
            Danh Mục
          </div>

          <Row
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingLeft: 5,
              marginTop: 10,
            }}
          >
            {" "}
            <Link
              to={`/category/${category.id}`}
              style={{
                color: "#0D6EFD",
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
              }}
            >
              {" "}
              <CaretRightFilled />
              {category.name}
            </Link>
            {/* Logic hiển thị trực tiếp trong map */}
            <Row
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft: 5,
                gap: 10,
                marginTop: 10,
              }}
            >
              {showAllCategories
                ? category?.childCategory?.map((category) => (
                    <Link
                      to={`/category/${category.id}`}
                      style={{
                        textAlign: "start",
                        paddingLeft: 13,
                        height: 32,
                        fontWeight: 400,
                        color:
                          String(category.id) === id ? "#1890ff" : "inherit", // 👈 Bôi xanh
                      }}
                      key={category.id}
                      href={`/categories/${category.id}`}
                    >
                      {category.name}
                    </Link>
                  ))
                : category?.childCategory
                    ?.slice(0, initialDisplayCount)
                    .map((category) => (
                      <Link
                        to={`/category/${category.id}`}
                        style={{
                          paddingLeft: 13,
                          height: 32,
                          fontWeight: 400,
                        }}
                        key={category.id}
                        href={`/categories/${category.id}`}
                      >
                        {category.name}
                      </Link>
                    ))}
              {!showAllCategories && (
                <Link
                  onClick={() => setShowAllCategories(true)}
                  style={{
                    paddingLeft: 13,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 400,
                  }}
                >
                  thêm {">"}
                </Link>
              )}
            </Row>
          </Row>
        </Col>
        <Col className="listProduct" span={19}>
          {product?.length === 0 ? (
            <div style={{ padding: "20px", fontSize: "16px", marginTop: 30 }}>
              Chưa có sản phẩm
            </div>
          ) : (
            <Row
              className="shop-products"
              gutter={windowSize.width >= SM ? [32, 32] : [16, 16]}
            >
              {product.map((product) => (
                <ProductCard
                  product={product}
                  key={product?.id}
                  productPerOneRow={productPerOneRow}
                />
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};
export default Category;
