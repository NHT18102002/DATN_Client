import { Col, notification, Row, Pagination, Button } from "antd";
import { useParams } from "react-router-dom";

import ProductGallery from "../../../components/pages/Shop/ProductDetail/ProductGallery/index.jsx";
import ProductInfo from "../../../components/pages/Shop/ProductDetail/ProductInfo/index.jsx";
import "./style.scss";
import { useEffect, useState, useRef } from "react";
import ProductReview from "../../../components/pages/Shop/ProductDetail/ProductReview/index.jsx";
import { getProductDetail } from "../../../services/shop.service.js";
import { getShopByProductId } from "../../../services/shop.service.js";
// import { getReviewProduct } from "../../../services/apis/review.service.js";
import useCallApi from "../../../hook/useCallApi.js";
import Spinner from "../../../components/common/Spinner/index.jsx";
import MoreProduct from "../../../components/pages/Shop/ProductDetail/moreProduct/index.jsx";
import { getDetailShop } from "../../../services/shop.service.js";
import { useWindowSize } from "../../../hook/useWindowSize.js";
import ProductCard from "../../../components/ProductCard/index.jsx";
import { SM } from "../../../constants.js";
import ShopProduct from "../../../components/pages/Shop/ShopProduct/index.jsx";
const ShopDetail = () => {
  const [product, setProduct] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 36; // số sản phẩm mỗi trang
  const [shop, setShop] = useState({});
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const { id } = useParams();
  const windowSize = useWindowSize();
  const productListRef = useRef(null);
  const [sortOption, setSortOption] = useState("latest");
  const sortButtons = [
    { label: "Mới nhất", value: "latest" },
    { label: "Phổ biến", value: "popular" },
    { label: "Giá tăng", value: "priceAsc" },
    { label: "Giá giảm", value: "priceDesc" },
  ];
  const getSortedProducts = () => {
    const products = [...(shop?.products || [])];
    switch (sortOption) {
      case "latest":
        return products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "popular":
        return products.sort((a, b) => b.sellOfQuantity - a.sellOfQuantity);
      case "priceAsc":
        return products.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return products.sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };
  const sortedProducts = getSortedProducts();
  const productPerOneRow = 4;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const { send: fetchShopDetail, loading } = useCallApi({
    callApi: getDetailShop,
    success: (res) => {
      setShop(res?.data);
      // setShuffledProducts(res?.dat?.products)
      const shuffledProducts = [...(res?.data?.products || [])]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      console.log(shuffledProducts);

      setShuffledProducts(shuffledProducts);
    },
    error: (err) => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    fetchShopDetail(id);
  }, [id]);

  return (
    <div className="hihi">
      {loading ? (
        <div style={{ height: 600 }}>
          <Spinner />
        </div>
      ) : (
        <div>
          <ShopProduct shop={shop} />
          <div
            style={{
              width: "100%",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .4)",
              zIndex: 2,
              backgroundColor: "#fff",
              borderBottom: "4px solid rgba(61, 137, 250, 0.9) ",
              marginTop: 15,
            }}
          >
            <span
              style={{
                color: "#ee4d2d",
                fontSize: "1rem",
                fontWeight: "500",
                marginLeft: 10,
              }}
            >
              GỢI Ý CHO BẠN
            </span>
            <span
              className="vewAll"
              style={{
                color: "#ee4d2d",
                fontSize: "1rem",
                fontWeight: "500",
                marginRight: 10,
              }}
              onClick={() => {
                productListRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Xem tất cả {">"}
            </span>
          </div>
          <Row
            className="shop-products"
            gutter={windowSize.width >= SM ? [32, 32] : [16, 16]}
          >
            {shuffledProducts?.length > 0
              ? shuffledProducts?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product?.id}
                    productPerOneRow={productPerOneRow}
                  />
                ))
              : shuffledProducts?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product?.id}
                    productPerOneRow={productPerOneRow}
                  />
                ))}
          </Row>
          <Row>
            {Array.isArray(shop?.banners) && shop?.banners.length > 0 && (
              <div
                className="banner-list"
                style={{
                  width: "100%",
                }}
              >
                {shop?.banners.map((bannerUrl, index) => (
                  <img
                    key={index}
                    src={bannerUrl}
                    alt={`Banner ${index + 1}`}
                    style={{
                      width: "100%",
                      // maxHeight: 300,
                      objectFit: "cover",
                      marginBottom: 10,
                      borderRadius: 8,
                    }}
                  />
                ))}
              </div>
            )}
          </Row>
          <div
            style={{
              width: "100%",
              height: 60,
              display: "flex",
              alignItems: "center",
              gap: 20,
              justifyContent: "flex-start",
              boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .4)",
              zIndex: 2,
              backgroundColor: "#fff",
              borderBottom: "4px solid rgba(61, 137, 250, 0.9) ",
              marginTop: 15,
            }}
          >
            <span
              style={{
                color: "#ee4d2d",
                fontSize: "1rem",
                fontWeight: "500",
                marginLeft: 15,
              }}
            >
              SẢN PHẨM
            </span>
            <span
              style={{
                fontSize: 14,
              }}
            >
              Sắp xếp theo
            </span>
            <div style={{}}>
              {sortButtons.map((btn) => (
                <Button
                  key={btn.value}
                  type={sortOption === btn.value ? "primary" : "default"}
                  onClick={() => {
                    setSortOption(btn.value);
                    setCurrentPage(1); // reset về trang đầu khi lọc
                  }}
                  style={{ marginRight: 8 }}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>

          <Row
            ref={productListRef} // 👈 thêm ref ở đây
            className="shop-products"
            gutter={windowSize.width >= SM ? [32, 32] : [16, 16]}
          >
            {currentProducts?.length > 0
              ? currentProducts?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product?.id}
                    productPerOneRow={productPerOneRow}
                  />
                ))
              : currentProducts?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product?.id}
                    productPerOneRow={productPerOneRow}
                  />
                ))}
          </Row>
          {shop?.products?.length > productsPerPage && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Pagination
                current={currentPage}
                pageSize={productsPerPage}
                total={shop?.products?.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      )}
      {/* <MoreProduct shop={shop} /> */}
    </div>
  );
};

export default ShopDetail;
