import { Col, Modal, notification, Row, Tag } from "antd";
import AntImage from "../../../common/AntImage/index.jsx";
import { getOrderByDetail } from "../../../../services/order.service.js";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../../../utils/string.js";
import useCallApi from "../../../../hook/useCallApi.js";
import Spinner from "../../../common/Spinner/index.jsx";

const OrderDetailModal = ({ order_id, showModal, handleCancel }) => {
  const [orders, setOrders] = useState();

  const { send: fetchOrderDetail, loading } = useCallApi({
    callApi: getOrderByDetail,
    success: (res) => {
      setOrders(res?.data);
    },
    error: (e) => {
      notification.error({
        header: "Error",
        message: "Get order failed!",
      });
    },
  });

  useEffect(() => {
    if (order_id) fetchOrderDetail(order_id);
  }, [order_id]);

  return (
    <Modal
      title="Chi tiết đơn hàng"
      open={showModal}
      onCancel={handleCancel}
      onOk={handleCancel}
      width={1000}
    >
      {loading ? (
        <div style={{ height: 150 }}>
          <Spinner />
        </div>
      ) : (
        <Row span={24}>
          {orders?.orderItems?.map((order) => (
            <Col span={24} style={{ marginBottom: "1rem" }}>
              <Row style={{ borderBottom: "1px solid #ccc" }}>
                <span>
                  {
                    order?.PriceProductDetail?.productDetail?.productId?.shop
                      ?.name
                  }
                </span>
              </Row>
              <Row>
                <Col span={20}>
                  <Row>
                    <Col span={4}>
                      <AntImage
                        src={
                          order?.PriceProductDetail?.productDetail?.productId
                            ?.thumbnail
                        }
                        width={100}
                        height={120}
                      />
                    </Col>
                    <Col span={16}>
                      <p>
                        {
                          order?.PriceProductDetail?.productDetail?.productId
                            ?.name
                        }{" "}
                        <b>x {order?.number}</b>
                      </p>
                      {order?.PriceProductDetail?.selectionOptions?.length >
                        0 && (
                        <div>
                          {order?.PriceProductDetail?.selectionOptions.flatMap(
                            (item) =>
                              item.options.map((opt, idx) => (
                                <div key={`${item.title}-${opt.name}-${idx}`}>
                                  {item.title}: {opt.name}
                                </div>
                              ))
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={4}>
                  {/* <p>Giá</p> */}
                  <p style={{ color: "#1677FF" }}>
                    {formatCurrency(order?.PriceProductDetail?.price)}
                  </p>
                </Col>
              </Row>
            </Col>
          ))}
          <Col span={24}>
            <Col style={{ marginLeft: "auto" }} span={4}>
              <p>
                Tổng thanh toán: {orders && formatCurrency(orders?.totalMoney)}
              </p>
            </Col>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default OrderDetailModal;
