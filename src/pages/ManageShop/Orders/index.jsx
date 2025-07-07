import {
  Col,
  Input,
  notification,
  Row,
  Table,
  Tag,
  Modal,
  Tooltip,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  cancelOrder,
  updateOrderStatus,
  getMyShopOrder,
} from "../../../services/order.service.js";
import { formatCurrency } from "../../../utils/string.js";
import OrderDetailModal from "./OrderDetailModal/index.jsx";
import ShopSidebar from "../../../components/common/ShopSidebar/index.jsx";
import OrderStatusPieChart from "../../../components/pages/Shop/Piechart/index.jsx";
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
// import { CancelIcon } from "../../assets/Icons/CancelIcon.jsx";
import { getOrderStatusStats } from "../../../utils/string.js";
import useCallApi from "../../../hook/useCallApi.js";
import Spinner from "../../../components/common/Spinner/index.jsx";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusData, setStatusData] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rowData, setRowData] = useState(null);

  const { send: fetchOrders, loading } = useCallApi({
    callApi: getMyShopOrder,
    success: (res) => {
      setOrders(res?.data?.items);
       setStatusData(getOrderStatusStats(res?.data?.items));
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Can't get orders",
      });
    },
  });

  const handleCancel = () => {
    try {
      cancelOrder(rowData?.id).then((res) => {
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Cancel order successfully!",
          });
          setShowCancelModal(false);
          fetchOrders();
        } else {
          notification.error({
            message: "Error",
            description: "Cancel order failed!",
          });
        }
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Cancel order failed!",
      });
    }
  };

  const handleProcess = () => {
    try {
      const status =
        rowData?.status === "Prepared"
          ? "Delivering"
          : rowData?.status === "Delivering"
          ? "Delivered"
          : rowData?.status === "Received"
          ? "Success"
          : "Prepared";
      updateOrderStatus(rowData?.id, status).then((res) => {
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Process order successfully!",
          });
          setShowProcessModal(false);
          fetchOrders();
        } else {
          notification.error({
            message: "Error",
            description: "Process order failed!",
          });
        }
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Process order failed!",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value || "");

    if (!value) {
      setFilteredData([]);
      return;
    }

    const filteredDataSource = orders.filter((item) => item.status === value);
    setFilteredData(filteredDataSource);
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Row justify={"space-between"} style={{ margin: "0 0" }}>
            <Col
              xs={24}
              md={3}
              style={{
                borderRight: "1px solid #ccc",
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <ShopSidebar />
            </Col>
            <Col xs={24} md={21} style={{ marginTop: 20 }}>
              <Col
                span={12}
                style={{
                  marginBottom: "2rem",
                  marginLeft: 30,
                  display: "flex",
                  justifyContent: " start",
                }}
              >
                <Select
                  allowClear
                  size="medinum"
                  style={{ width: "30%" }}
                  placeholder="Mặc định"
                  onChange={handleSearch}
                >
                  <Select.Option value="Pending">Chờ xác nhận</Select.Option>
                  <Select.Option value="Prepared">Đang chuẩn bị</Select.Option>
                  <Select.Option value="Delivering">
                    Đang vận chuyển
                  </Select.Option>
                  <Select.Option value="Delivered">Đã vận chuyển</Select.Option>
                  <Select.Option value="Received">Đã nhận hàng</Select.Option>
                  <Select.Option value="Failure">Đã hủy</Select.Option>
                </Select>
         
              </Col>

              <Table
                dataSource={
                  filteredData.length >= 0 && searchText !== ""
                    ? filteredData
                    : orders
                }
                rowKey={(record) => record?.id}
                style={{ width: "95%", marginLeft: 30 }}
                scroll={{ y: 600 }}
                columns={[
                  {
                    title: "STT",
                    dataIndex: "key",
                    rowScope: "row",
                    render: (text, record, index) => (
                      <span style={{ color: "grey" }}>{index + 1}</span>
                    ),
                    width: 30,
                  },
                  {
                    title: "Người mua",
                    dataIndex: "ownerId",
                    key: "ownerId",
                    width: 100,
                    render: (value) => (
                      <span style={{ color: "grey" }}>
                        {value?.email} - {value?.phone}
                      </span>
                    ),
                  },
                  {
                    title: "trạng thái",
                    dataIndex: "status",
                    key: "status",
                    width: 70,
                    render: (value) => {
                      if (value === "Pending") {
                        return <Tag color="orange">Chờ xác nhận</Tag>;
                      } else if (value === "Prepared") {
                        return <Tag color="orange">Đang chuẩn bị</Tag>;
                      } else if (value === "Delivering") {
                        return <Tag color="blue">Đang vận chuyển</Tag>;
                      } else if (value === "Delivered") {
                        return <Tag color="yellow">Đã vận chuyển</Tag>;
                      } else if (value === "Received") {
                        return <Tag color="green">Đã nhận hàng</Tag>;
                      } else {
                        return <Tag color="red">Đã hủy</Tag>;
                      }
                    },
                  },
                  {
                    title: "Thời gian đặt hàng",
                    dataIndex: "createdAt",
                    key: "createdAt",
                    width: 110,
                    render: (value) => (
                      <span style={{ color: "grey" }}>
                        {value ? new Date(value).toLocaleString() : "N/A"}
                      </span>
                    ),
                  },
                  {
                    title: "Cập nhật gần nhất",
                    dataIndex: "updatedAt",
                    key: "updatedAt",
                    width: 110,
                    render: (value) => (
                      <span style={{ color: "grey" }}>
                        {value ? new Date(value).toLocaleString() : "N/A"}
                      </span>
                    ),
                  },
                  {
                    title: "Tổng tiền",
                    dataIndex: "totalMoney",
                    key: "totalMoney",
                    width: 100,
                    render: (value) => (
                      <span style={{ color: "#1677FF" }}>
                        {formatCurrency(value)}
                      </span>
                    ),
                  },
                  {
                    title: "Action",
                    key: "operation",
                    fixed: "right",
                    align: "right",
                    width: 100,
                    render: (text, record) => (
                      <>
                        <>
                          <Tooltip
                            title="Xem chi tiết"
                            placement="topLeft"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setShowDetailModal(true);
                              setRowData(record);
                            }}
                          >
                            <InfoCircleOutlined style={{ marginRight: 8 }} />
                          </Tooltip>
                          {record?.status === "Prepared" && (
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setShowCancelModal(true);
                                setRowData(record);
                              }}
                            >
                              <CloseCircleOutlined style={{ marginRight: 8 }} />
                            </span>
                          )}
                          {record?.status !== "Delivered" &&
                            record?.status !== "Received" &&
                            record?.status !== "Failure" && (
                              <span
                                style={{
                                  cursor: "pointer",
                                  color:
                                    record?.status === "Prepared" ||
                                    record?.status === "Pending"
                                      ? "orange"
                                      : record?.status === "Delivering"
                                      ? "blue"
                                      : "green" + "!important",
                                }}
                                onClick={() => {
                                  setShowProcessModal(true);
                                  setRowData(record);
                                }}
                              >
                                <RiseOutlined />
                              </span>
                            )}
                        </>
                      </>
                    ),
                  },
                ]}
                pagination={{
                  pageSize: 5,
                }}
              />
            </Col>
          </Row>
          <Modal
            open={showCancelModal}
            title={"Cancel Order"}
            // content={"Are you sure you want to cancel this order?"}
            onOk={handleCancel}
            onCancel={() => {
              setShowCancelModal(false);
            }}
          >
            {" "}
            <p>Bạn có muốn hủy đơn hàng này</p>
          </Modal>
          <Modal
            open={showProcessModal}
            title={"Process Order"}
            // content={"Are you sure you want to process this order?"}
            onOk={handleProcess}
            onCancel={() => {
              setShowProcessModal(false);
            }}
          >
            <p>Bạn có muốn tiếp tục đơn hàng này</p>
          </Modal>
          <OrderDetailModal
            showModal={showDetailModal}
            handleCancel={() => setShowDetailModal(false)}
            order_id={rowData?.id}
          />
        </>
      )}
    </div>
  );
};

export default ManageOrders;
