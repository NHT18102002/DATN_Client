import { Card, Col, Row, Skeleton } from "antd";
import "./style.scss";
import {
  ArrowRightOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from "@ant-design/icons";
import { formatCurrency } from "../../utils/string.js";
import { Link } from "react-router-dom";
import AntButton from "../common/Button/index.jsx";
import { useWindowSize } from "../../hook/useWindowSize.js";
import { SM } from "../../constants.js";
import AntImage from "../common/AntImage/index.jsx";
import { useEffect, useState } from "react";
import { addToCart } from "../../services/cart.service.js";
import { useSelector } from "react-redux";

const { Meta } = Card;

const ProductCard = ({ product, productPerOneRow }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) setLoading(false);
  }, [product]);
  const windowSize = useWindowSize();
  return (
    <Col
      className="Card"
      xs={12}
      xl={productPerOneRow}
      style={{
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <Link
        to={`/product/${product?.id}`}
        className="card-link"
        onClick={() => {
          // window.location.reload();
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }}
      >
        <Card
          className={""}
          hoverable
          cover={
            <AntImage
              preview={false}
              alt={product?.title}
              src={product?.thumbnail}
              width={"100%"}
              height={"100%"}
            />
          }
        >
          {loading ? (
            <Skeleton />
          ) : (
            <div className="card-item">
              <div>
                <span className="card-desc">{product?.name}</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <div
                  className="card-price"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: "#0d6efd",
                      fontWeight: "500",
                    }}
                  >
                    {formatCurrency(product?.price)}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#0d6efd",
                      fontWeight: "600",
                      lineHeight: "12px",
                      backgroundColor: "rgb(184 209 247 / 59%)",
                      // boxSizing: "border-box",
                      padding: "2px 4px",
                      height: "16px",
                    }}
                  >
                    -{product?.discount}%
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <span style={{ color: "#faad14", fontSize: 12 }}>
                    <StarFilled />
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {product?.rate}
                  </span>
                </div>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  Đã bán{" "}
                  {product?.sellOfQuantity < 1000
                    ? product?.sellOfQuantity
                    : (product?.sellOfQuantity / 1000).toFixed(1) + "K"}
                </span>
              </div>
            </div>
          )}
        </Card>
      </Link>
    </Col>
  );
};

export default ProductCard;
