import {
  Form,
  Rate,
  Radio,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Image,
  notification,
} from "antd";
import AntButton from "../../../../common/Button";
import { MessageOutlined, ShopOutlined } from "@ant-design/icons";
import { formatTimeAgo } from "../../../../../utils/string";
import { Link } from "react-router-dom";
const ShopProduct = ({ shop, review }) => {
  return (
    <Row
      style={{
        paddingLeft: 17,
      }}
    >
      <Col
        xs={24}
        lg={8}
        style={{
          display: "flex",
          gap: 20,
          borderRight: "1px solid #ccc",
          paddingRight: 25,
        }}
      >
        <div
          style={{
            height: 80,
            width: 81,
            backgroundColor: "#ccc",
            borderRadius: "50%", // Biến hình vuông thành hình trò
          }}
        >
          <Image
            style={{
              height: 78,
              width: 78,
              borderRadius: "50%", // Biến hình vuông thành hình tròn
              objectFit: "cover",
            }}
            src={shop.logo}
            preview={false}
          ></Image>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeigh: 500,
            }}
          >
            {shop.name}
          </span>
          <div
            style={{
              //   width: 115,
              height: 34,
              display: "flex",
              gap: 10,
            }}
          >
            <Button
              text={"Chat Ngay"}
              theme={"light"}
              icon={<MessageOutlined style={{ fontSize: 14 }} />}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#d3e3f5",
                color: "#0d6efd",
                fontWeight: 500,
              }}
              // onClick={() => {
              //   if (stock) {
              //     if (form.getFieldValue("size") && form.getFieldValue("color")) {
              //       handleAddToCart();
              //     } else {
              //       message.error("hãy lựa chọn loại hàng");
              //     }
              //   } else {
              //     message.error("Out of stock");
              //   }
              // }}
            >
              Chat Ngay
            </Button>
            <Link to={`/shop/${shop.id}`}>
              <Button
                theme={"light"}
                icon={<ShopOutlined style={{ fontSize: 14 }} />}
                style={{
                  width: "100%",
                  height: "100%",
                  //   backgroundColor: "#d3e3f5",
                  color: "#555",
                }}
                // onClick={() => {
                //   if (stock) {
                //     if (form.getFieldValue("size") && form.getFieldValue("color")) {
                //       handleAddToCart();
                //     } else {
                //       message.error("hãy lựa chọn loại hàng");
                //     }
                //   } else {
                //     message.error("Out of stock");
                //   }
                // }}
              >
                Xem Shop
              </Button>
            </Link>
          </div>
        </div>
      </Col>
      <Col xs={24} lg={16} style={{ paddingLeft: 25 }}>
        <Row gutter={16} style={{ height: "100%" }}>
          <Col
            span={6}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 15,
              // alignItems: "center"
            }}
          >
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={12}
              >
                Đánh giá
              </Col>
              <Col
                style={{
                  textAlign: "end",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={6}
              >
                {review?.totalItems}
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={12}
              >
                Sản phẩm
              </Col>
              <Col
                style={{
                  textAlign: "end",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={6}
              >
                {shop?.products?.length}
              </Col>
            </Row>
          </Col>

          <Col
            span={8}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 15,
              // alignItems: "center"
            }}
          >
            <Row>
              <Col
                span={12}
                style={{
                  textAlign: "start",
                }}
              >
                Tỉ lệ phản hồi
              </Col>
              <Col
                style={{
                  textAlign: "end",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={12}
              >
                100%
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={12}
              >
                thời gian phản hồi
              </Col>
              <Col
                style={{
                  textAlign: "end",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={12}
              >
                Trong vài phút
              </Col>
            </Row>
          </Col>
          <Col
            span={7}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 15,
              // alignItems: "center"
            }}
          >
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={12}
              >
                tham gia
              </Col>
              <Col
                style={{
                  textAlign: "end",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={12}
              >
                {formatTimeAgo(shop.updatedAt)}
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={12}
              >
                Người theo dõi
              </Col>
              <Col
                style={{
                  textAlign: "end",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={12}
              >
                4k
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ShopProduct;
