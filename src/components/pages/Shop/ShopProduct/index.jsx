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
import { MessageOutlined, ShopOutlined } from "@ant-design/icons";
import { formatTimeAgo } from "../../../../utils/string";
import { averageRate } from "../../../../utils/string";
const ShopProduct = ({ shop, review }) => {
  return (
    <Row
      style={{
        padding: "10px 10px 10px 17px",
        height: 150,
        borderBottom: "1px solid #ccc",
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
          paddingLeft: 20,
          alignItems: "center",
          // filter: "blur(2px)"
          position: "relative",
        }}
      >
        {shop?.banner && (
          <div
            style={{
              zIndex: "-1",
              position: "absolute",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${shop?.banner})`,
              backgroundPosition: "50%",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              filter: "blur(0.7px)",
              right: 0,
              top: 0,
              bottom: 0,
              left: 0,
              // backgroundColor: "#ccc"
            }}
          ></div>
        )}
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
              fontSize: 18,
              fontWeigh: 600,
              color: shop?.banner ? "#fff" : "#000",
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
              Xem Sản Phẩm
            </Button>
          </div>
        </div>
      </Col>
      <Col xs={24} lg={16} style={{ paddingLeft: 25 }}>
        <Row gutter={16} style={{ height: "100%" }}>
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
                style={{
                  textAlign: "start",
                }}
                span={7}
              >
                Đánh giá:
              </Col>
              <Col
                style={{
                  textAlign: "start",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={6}
              >
                {averageRate(shop.products)}
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={7}
              >
                Sản phẩm:
              </Col>
              <Col
                style={{
                  textAlign: "start",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={6}
              >
                {shop?.products?.length}
              </Col>
            </Row>
            <Row>
              <Col
                span={9}
                style={{
                  textAlign: "start",
                }}
              >
                Tỉ lệ phản hồi:
              </Col>
              <Col
                style={{
                  textAlign: "start",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={12}
              >
                100%
              </Col>
            </Row>
          </Col>

          <Col
            span={12}
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
                span={8}
              >
                thời gian phản hồi:
              </Col>
              <Col
                style={{
                  textAlign: "start",
                  color: "#0b74e5",
                  fontWeight: 500,
                }}
                span={12}
              >
                Trong vài phút
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  textAlign: "start",
                }}
                span={4}
              >
                tham gia:
              </Col>
              <Col
                style={{
                  textAlign: "start",
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
                span={7}
              >
                Người theo dõi:
              </Col>
              <Col
                style={{
                  textAlign: "start",
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
