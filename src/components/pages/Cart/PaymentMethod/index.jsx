import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import AntImage from "../../../common/AntImage/index.jsx";
import { formatCurrency } from "../../../../utils/string.js";
import {
  BankOutlined,
  DeleteFilled,
  HomeOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const PaymentMethod = ({ cart, shippingInfo, form, totalPrice }) => {
  totalPrice.current = cart?.reduce((acc, cur) => {
    return acc + cur?.itemId?.price * cur?.number;
  }, 0);
  return (
    <Row gutter={32}>
      <Col span={16}>
        <Table
          rowKey={(record) => record?.id}
          dataSource={cart}
          pagination={false}
          columns={[
            {
              title: "Product",
              dataIndex: "title",
              key: "title",
              width: 450,
              align: "center",
              render: (text, record) => {
                return (
                  <Row
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <Col>
                      <AntImage
                        src={
                          record?.itemId?.productDetail?.productId?.thumbnail
                        }
                        width={80}
                        // height={0}
                      />
                    </Col>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        // height: "100%",
                        width: "40%",
                        margin: "10px 0",
                        textAlign: "start",
                        fontWeight: 500,
                      }}
                    >
                      {record?.itemId?.productDetail?.productId?.name} -{" "}
                    </div>
                    <div
                      style={{
                        marginLeft: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        gap: 10,
                        margin: "10px 0",
                      }}
                    >
                      {/* {record?.itemId?.selectionOptions?.[0]?.title} */}
                      {record?.itemId?.selectionOptions?.map(
                        (selection, index) => (
                          <Row
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 10,
                            }}
                          >
                            <div style={{ fontWeight: "bold", marginLeft: 4 }}>
                              {selection.title}
                            </div>
                            <div>{selection.options?.[0].name}</div>
                          </Row>
                        )
                      )}
                      {/* <CaretDownFilled /> */}
                    </div>
                  </Row>
                );
              },
            },
            {
              title: "Đơn Giá",
              dataIndex: "price",
              key: "price",
              align: "center",
              render: (text, record) => (
                <div>{formatCurrency(record?.itemId?.price)}</div>
              ),
            },
            {
              title: "Số lượng",
              dataIndex: "quantity",
              key: "quantity",
              align: "center",
              render: (text, record) => <p>{record?.number}</p>,
            },
            {
              title: "Tổng tiền",
              dataIndex: "total",
              key: "total",
              align: "center",
              render: (text, record) => (
                <p>{formatCurrency(record?.itemId?.price * record?.number)}</p>
              ),
            },
          ]}
        />
        <Card
          title="Phương thức thanh toán"
          style={{
            width: "100%",
            textAlign: "left",
            marginTop: "2rem",
          }}
        >
          <Form form={form}>
            <Form.Item
              name={"paymentMethod"}
              rules={[
                {
                  required: true,
                  message: "Please select payment method!",
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={"cash"}>
                    <MoneyCollectOutlined /> Thanh toán khi nhận hàng
                  </Radio>
                  <Radio value={"vnpay"}>
                    <BankOutlined />
                    Thanh Toán Bằng VN Pay
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="Địa chỉ nhận hàng"
          style={{
            width: "100%",
            textAlign: "left",
            marginBottom: "2rem",
          }}
        >
          <p>
            <span style={{ fontWeight: 600 }}>{shippingInfo?.username}</span> |{" "}
            <span style={{ color: "#0d6efd" }}>{shippingInfo?.phone}</span>
          </p>
          <p>
            <HomeOutlined style={{ color: "#0d6efd" }} />{" "}
            {shippingInfo?.address}
          </p>
        </Card>
        <Card
          title="Thanh Toán"
          style={{
            width: "100%",
            textAlign: "left",
          }}
        >
          <h3>
            <span>Số tiền: </span>{" "}
            <span style={{ color: "#0d6efd", float: "right" }}>
              {formatCurrency(totalPrice.current)}
            </span>
          </h3>
          <p
            style={{
              paddingBottom: "1rem",
              borderBottom: " 1px solid #d9d9d9",
            }}
          >
            Phí vận chuyển:{" "}
            <span style={{ color: "#0d6efd", float: "right" }}>
              {formatCurrency(20000)}
            </span>
          </p>
          <h3>
            Tổng thanh toán:{" "}
            <span style={{ color: "#0d6efd", float: "right" }}>
              {formatCurrency(totalPrice.current + 20000)}
            </span>
          </h3>
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentMethod;
