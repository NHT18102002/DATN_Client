import {
  Button,
  Col,
  Modal,
  notification,
  Row,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  cancelOrder,
  getOrderByStatus,
  receiveOrder,
} from "../../../../services/order.service.js";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../../../utils/string.js";
import OrderDetailModal from "../OrderDetailModal/index.jsx";
import { addToCart } from "../../../../services/cart.service.js";
import { useDispatch, useSelector } from "react-redux";
import ReviewModal from "./ReviewModal/index.jsx";
import {
  CheckOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  StarFilled,
} from "@ant-design/icons";
import useCallApi from "../../../../hook/useCallApi.js";
import { getUserCartSuccess } from "../../../../redux/actions/cart.action.js";
import Spinner from "../../../common/Spinner/index.jsx";
import { getUserCart } from "../../../../services/cart.service.js";
import { useNavigate } from "react-router-dom";
const OrderTable = ({ order_status }) => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReceivedModal, setShowReceivedModal] = useState(false);
  const [rowData, setRowData] = useState();
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("userInfo"))?.userId;
  const navigate = useNavigate(); // đặt ở đầu trong component ManageOrders
  const handleReceivedOrder = () => {
    try {
      receiveOrder(rowData?.id).then((res) => {
        if (res?.status === 200) {
          notification.success({
            header: "Success",
            message: "Update order successfully!",
          });
          setShowReceivedModal(false);
          fetchOrders();
        } else {
          notification.error({
            header: "Error",
            message: "Update order failed!",
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelOrder = () => {
    try {
      cancelOrder(rowData?.id).then((res) => {
        if (res?.status === 200) {
          notification.success({
            header: "Success",
            message: "Cancel order successfully!",
          });
          setShowCancelModal(false);
          fetchOrders();
        } else {
          notification.error({
            header: "Error",
            message: "Cancel order failed!",
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const { send: fetchOrders, loading } = useCallApi({
    callApi: getOrderByStatus,
    success: (res) => {
      // console.log(res?.data?.items);
      setOrders(res?.data?.items);
    },
    error: (e) => {
      notification.error({
        header: "Error",
        message: "Xảy ra lỗi!",
      });
    },
  });

  useEffect(() => {
    fetchOrders(order_status);
  }, [order_status]);

  const handleBuyAgain = async (order) => {
    try {
      const orderItems = order?.orderItems || [];

      if (!orderItems.length) {
        notification.warning({
          message: "Không có sản phẩm",
          description: "Đơn hàng này không có sản phẩm để mua lại.",
        });
        return;
      }

      const promises = orderItems.map((item) => {
        const number = item.number;
        const itemId = item?.PriceProductDetail?.id;

        if (itemId) {
          return addToCart(number, itemId);
        } else {
          return Promise.resolve({ status: null });
        }
      });

      const results = await Promise.all(promises);
      const allSuccessful = results.every((res) => res?.status === 201);

      if (allSuccessful) {
        notification.success({
          message: "Thành công",
          description: "Tất cả sản phẩm đã được thêm vào giỏ hàng.",
        });
        const updatedCart = await getUserCart(userId);
        dispatch(getUserCartSuccess(updatedCart?.data?.data?.items));
        // 🛒 Chuyển hướng sang giỏ hàng sau 1s để tránh xung đột UI
        setTimeout(() => {
          navigate("/cart");
        }, 1000);
      } else {
        notification.warning({
          message: "Một số sản phẩm không thêm được",
          description: "Một vài sản phẩm có thể đã hết hàng hoặc lỗi.",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.",
      });
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ height: 500 }}>
          <Spinner />
        </div>
      ) : (
        <>
          <Table
            rowKey={(record) => record?.id}
            columns={[
              {
                title: "STT",
                dataIndex: "key",
                rowScope: "row",
                render: (text, record, index) => (
                  <span style={{ color: "grey" }}>{index + 1}</span>
                ),
                width: 40,
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 150,
                render: (value) => (
                  <Tag
                    color={
                      value === "Prepared"
                        ? "grey"
                        : value === "Delivering"
                        ? "blue"
                        : value === "Delivered"
                        ? "green"
                        : value === "Received"
                        ? "green"
                        : "red"
                    }
                  >
                    {value === "Received" ? "Success" : value}
                  </Tag>
                ),
              },
              {
                title: "Xem chi tiết",
                dataIndex: "",
                key: "detail",
                width: 150,
                render: (value, row) => (
                  <Button
                    type={"link"}
                    onClick={() => {
                      setRowData(row);
                      setShowModal(true);
                    }}
                  >
                    Detail
                  </Button>
                ),
              },
              {
                title: "Phương thức thanh toán",
                dataIndex: "paymentType",
                key: "paymentType",
                width: 150,
              },
              {
                title: "Tiền thanh toán",
                dataIndex: "totalMoney",
                key: "totalMoney",
                width: 150,
                render: (value) => <p>{formatCurrency(value)}</p>,
              },
              {
                title: "Action",
                dataIndex: "",
                key: "action",
                width: 220,
                render: (value, row) => {
                  if (row?.status === "Failure") return null;

                  const canBuyAgain = [
                    "Delivered",
                    "Received",
                    "Success",
                    "Failure",
                  ].includes(row?.status);
                  const canReview = ["Delivered", "Received"].includes(
                    row?.status
                  ); // ✅ CHỈ khi đã nhận

                  return (
                    <>
                      {/* Cancel Order */}
                      {row?.status === "Pending" && (
                        <span
                          style={{
                            color: "orange",
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                          onClick={() => {
                            setRowData(row);
                            setShowCancelModal(true);
                          }}
                        >
                          <CloseCircleOutlined style={{ fontSize: 14 }} />
                        </span>
                      )}

                      {/* Confirm Received */}
                      {row?.status === "Delivered" && (
                        <span
                          style={{
                            color: "#1677FF",
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                          onClick={() => {
                            setRowData(row);
                            setShowReceivedModal(true);
                          }}
                        >
                          <CheckOutlined style={{ fontSize: 14 }} />
                        </span>
                      )}

                      {/* Buy Again */}
                      {canBuyAgain && (
                        <span
                          style={{
                            color: "green",
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                          onClick={() => handleBuyAgain(row)}
                        >
                          <ShoppingOutlined style={{ fontSize: 14 }} />
                        </span>
                      )}

                      {/* ⭐ Đánh giá - CHỈ khi Delivered hoặc Received */}
                      {canReview && (
                        <span
                          style={{ color: "#fadb14", cursor: "pointer" }}
                          onClick={() => {
                            setRowData(row);
                            setShowReviewModal(true); // 👉 mở modal đánh giá
                          }}
                        >
                          <Button size="small" type={"primary"}>
                            Đánh giá
                          </Button>
                        </span>
                      )}
                    </>
                  );
                },
              },
            ]}
            dataSource={orders}
          />
          <OrderDetailModal
            showModal={showModal}
            handleCancel={() => setShowModal(false)}
            order_id={rowData?.id}
          />
          <Modal
            open={showCancelModal}
            onCancel={() => setShowCancelModal(false)}
            title={"Cancel Order"}
            onOk={handleCancelOrder}
          >
            <p>Are you sure to cancel this order?</p>
          </Modal>
          <Modal
            open={showReceivedModal}
            onCancel={() => setShowReceivedModal(false)}
            title={"Xác nhận"}
            onOk={handleReceivedOrder}
          >
            <p>Xác nhận đã nhận được đơn hàng!</p>
          </Modal>
          <ReviewModal
            open={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            orderItems={rowData?.orderItems}
            orderItemId={rowData?.id}
          />
        </>
      )}
    </>
  );
};

export default OrderTable;
