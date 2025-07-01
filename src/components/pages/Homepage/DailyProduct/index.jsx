import { notification, Pagination, Row, Button } from "antd";
import ProductCard from "../../../ProductCard/index.jsx";

import "./style.scss";
import { useEffect, useState } from "react";
import Filter from "../../Shop/Filter/index.jsx";
import { useWindowSize } from "../../../../hook/useWindowSize.js";
import { SM } from "../../../../constants.js";
import useCallApi from "../../../../hook/useCallApi.js";
import Spinner from "../../../common/Spinner/index.jsx";
import { getAllProducts } from "../../../../services/shop.service.js";

const DailyProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const windowSize = useWindowSize();
  const productsPerPage = 16;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);
  const visibleProducts = products.slice(0, visibleCount);
  const productPerOneRow = 4
  const shuffleArray = (array) => {
    const newArray = [...array]; // tạo bản sao để không làm thay đổi mảng gốc
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const { send: fetchProducts, loading } = useCallApi({
    callApi: getAllProducts,
    success: (res) => {
      const items = res?.data?.items || [];
      const shuffled = shuffleArray(items);
      setProducts(shuffled);
    },
    error: (err) => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 30);
      setLoadMoreLoading(false);
    }, 1000); // 0.5 giây
  };

  return (
    <div>
      <Row>
        <div
          style={{
            width: "100%",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .4)",
            zIndex: 2,
            backgroundColor: "#fff",
            borderBottom: "4px solid rgba(61, 137, 250, 0.9) ",
          }}
        >
          <span
            style={{
              color: "#ee4d2d",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            GỢI Ý CHO BẠN
          </span>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Row
              className="shop-products"
              gutter={windowSize.width >= SM ? [32, 32] : [16, 16]}
            >
              {visibleProducts.map((product) => (
                <ProductCard product={product} key={product?.id}  productPerOneRow = {productPerOneRow} />
              ))}
            </Row>
            <Row style={{ margin: "0 auto" }}>
              <Button
                onClick={handleLoadMore}
                loading={loadMoreLoading}
                style={{ margin: "20px auto", display: "block" }}
              >
                {loadMoreLoading ? "Đang tải..." : "Xem thêm"}
              </Button>
            </Row>
          </>
        )}
      </Row>
    </div>
  );
};

export default DailyProduct;
