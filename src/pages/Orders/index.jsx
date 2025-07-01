import { Col, Row, Tabs } from "antd";
import Sidebar from "../../components/common/Sidebar/index.jsx";
import OrderTable from "../../components/pages/Order/OrderTable/index.jsx";

const Orders = () => {
  const items = [
    {
      key: "0",
      label: `Tất cả`,
      children: <OrderTable/>, // Không truyền order_status
    },
    {
      key: "1",
      label: `Chờ xác nhận`,
      children: <OrderTable order_status={"Pending"} />,
    },
    {
      key: "2",
      label: `Chờ lấy hàng`,
      children: <OrderTable order_status={"Prepared"} />,
    },
    {
      key: "3",
      label: `Đang vận chuyển`,
      children: <OrderTable order_status={"Delivering"} />,
    },
    {
      key: "4",
      label: `Đã vận chuyển`,
      children: <OrderTable order_status={"Delivered"} />,
    },
    {
      key: "5",
      label: `Đã giao`,
      children: <OrderTable order_status={"Received"} />,
    },
    {
      key: "6",
      label: `Đã hủy`,
      children: <OrderTable order_status={"Failure"} />,
    },
  ];

  return (
    <Row>
      <Col xs={0} md={4}>
        <Sidebar />
      </Col>
      <Col xs={24} md={20}>
        <Tabs defaultActiveKey="0" items={items} />
      </Col>
    </Row>
  );
};

export default Orders;
