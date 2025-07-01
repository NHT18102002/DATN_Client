import { Col, Row, Steps, Modal } from "antd";
import Sidebar from "../../../components/common/Sidebar/index.jsx";
import {
  ShoppingCartOutlined,
  SmileOutlined,
  SolutionOutlined,
  WalletOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Done from "../../../components/pages/Cart/Done/index.jsx";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Result, Button, Typography, Descriptions, Spin, Space } from "antd";
import moment from "moment"; // Để định dạng thời gian (nếu cần, cài đặt: npm install moment)
import { Link } from "react-router-dom";
const { Title, Text } = Typography;
const VnPaySuccess = () => {
  const params = useParams();
  const location = useLocation(); // Hook để truy cập đối tượng location (chứa URL)
  const navigate = useNavigate(); // Hook để điều hướng
  const [paymentStatus, setPaymentStatus] = useState("pending"); // 'success', 'failed', 'pending'
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(true);
  const step = 3;
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const details = {};

    // Lấy tất cả các tham số từ URL
    for (let pair of queryParams.entries()) {
      details[pair[0]] = pair[1];
    }

    setPaymentDetails(details);
    const detailString = String(details);
    if (detailString.includes("GD:")) {
      setId(detailString.split("GD:")[1]);
    }

    // Kiểm tra trạng thái thanh toán từ vnp_ResponseCode hoặc vnp_TransactionStatus
    // VNPAY thường dùng vnp_ResponseCode là chính cho trạng thái cuối cùng
    // '00' là giao dịch thành công
    if (
      details.vnp_ResponseCode === "00" &&
      details.vnp_TransactionStatus === "00"
    ) {
      setPaymentStatus("success");
    } else {
      setPaymentStatus("failed");
    }
    setIsLoading(false);

    // Tùy chọn: Gửi thông tin này về backend của bạn để xác nhận lại giao dịch
    // Điều này RẤT QUAN TRỌNG để đảm bảo tính toàn vẹn và bảo mật của giao dịch
    // Nếu bạn có một API endpoint để xác nhận:
    // fetch('/api/confirm-vnpay-transaction', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(details)
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if (data.success) {
    //     // Backend đã xác nhận thành công
    //   } else {
    //     // Backend báo lỗi xác nhận, có thể hiển thị cảnh báo
    //   }
    // })
    // .catch(error => console.error('Error confirming transaction:', error));
  }, [location.search]); // Chạy lại khi query string thay đổi

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang xử lý giao dịch..." />
      </div>
    );
  }
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const formatAmount = (amount) => {
    // VNPAY trả về amount đã nhân 100, cần chia lại
    const realAmount = parseFloat(amount) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(realAmount);
  };
  const formatPayDate = (dateString) => {
    // Định dạng: YYYYMMDDHHmmss
    if (!dateString || dateString.length !== 14) return dateString;
    // Sử dụng momentjs để định dạng (cần cài đặt: npm install moment)
    return moment(dateString, "YYYYMMDDHHmmss").format("HH:mm:ss DD-MM-YYYY");
    // Hoặc nếu không dùng moment:
    // const year = dateString.substring(0, 4);
    // const month = dateString.substring(4, 6);
    // const day = dateString.substring(6, 8);
    // const hour = dateString.substring(8, 10);
    // const minute = dateString.substring(10, 12);
    // const second = dateString.substring(12, 14);
    // return `${hour}:${minute}:${second} ${day}-${month}-${year}`;
  };

  const getTransactionStatusText = (statusCode) => {
    switch (statusCode) {
      case "00":
        return "Thành công";
      case "01":
        return "Giao dịch chưa hoàn tất";
      case "02":
        return "Giao dịch bị lỗi";
      case "03":
        return "Giao dịch không thành công";
      case "04":
        return "Giao dịch đảo (hoàn tiền giao dịch)";
      case "05":
        return "Giao dịch chờ xử lý";
      case "06":
        return "Giao dịch bị từ chối bởi ngân hàng";
      case "07":
        return "Lỗi checksum"; // Lỗi từ phía VNPAY, có thể do bạn sai hash
      case "08":
        return "Giao dịch không tìm thấy";
      case "09":
        return "Giao dịch bị từ chối bởi hệ thống";
      case "10":
        return "Giao dịch đã bị hoàn tiền";
      default:
        return "Không xác định";
    }
  };
  const stepItems = [
    {
      title: "Cart",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Shipping Address",
      icon: <SolutionOutlined />,
    },
    {
      title: "Payment Method",
      icon: <WalletOutlined />,
    },
    {
      title: "Done",
      icon: <SmileOutlined />,
    },
  ];

  return (
    <Row>
      {/* <Col xs={0} md={4}>
        <Sidebar />
      </Col> */}
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        {paymentStatus === "success" ? (
          <Result
            status="success"
            icon={<SmileOutlined />}
            title="Thanh toán thành công!"
            subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là chi tiết giao dịch của bạn:"
            extra={[
              <Button
                type="primary"
                key="dashboard"
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>,
              <Button key="orders" onClick={() => navigate("/orders")}>
                Xem đơn hàng của tôi
              </Button>,
              <Button key="details" onClick={showModal}>
                {" "}
                {/* Nút "Xem chi tiết" */}
                Xem chi tiết giao dịch
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            icon={<CloseCircleOutlined />}
            title="Thanh toán không thành công!"
            subTitle={`Mã lỗi: ${
              paymentDetails.vnp_ResponseCode || "N/A"
            }. Chi tiết: ${getTransactionStatusText(
              paymentDetails.vnp_ResponseCode
            )}. Vui lòng thử lại hoặc liên hệ hỗ trợ.`}
            extra={[
              <Button
                type="primary"
                key="retry"
                onClick={() => navigate("/cart")}
              >
                Thử lại thanh toán
              </Button>,
              <Button key="contact">Liên hệ hỗ trợ</Button>,
            ]}
          />
        )}

        {/* Hiển thị chi tiết giao dịch */}
        <Modal
          width={900}
          title="Chi tiết giao dịch"
          open={isModalVisible} // Sử dụng prop 'open' thay vì 'visible' cho Ant Design v5+
          onCancel={handleCancel}
          footer={[
            // Bạn có thể tùy chỉnh footer hoặc chỉ để nút đóng
            <Button key="back" onClick={handleCancel}>
              Đóng
            </Button>,
          ]}
        >
          <Descriptions
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            // Đã bỏ title ở đây vì Modal đã có title rồi
          >
            <Descriptions.Item label="Mã giao dịch của bạn (TxnRef)">
              <Text copyable>{paymentDetails.vnp_TxnRef}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã giao dịch VNPAY (TransactionNo)">
              <Text copyable>{paymentDetails.vnp_TransactionNo}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền thanh toán">
              <Text strong>{formatAmount(paymentDetails.vnp_Amount)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian thanh toán">
              {formatPayDate(paymentDetails.vnp_PayDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Thông tin đơn hàng">
              {paymentDetails.vnp_OrderInfo}
            </Descriptions.Item>
            <Descriptions.Item label="Ngân hàng">
              {paymentDetails.vnp_BankCode}
            </Descriptions.Item>
            <Descriptions.Item label="Loại thẻ">
              {paymentDetails.vnp_CardType}
            </Descriptions.Item>
            <Descriptions.Item label="Mã phản hồi VNPAY">
              {paymentDetails.vnp_ResponseCode} -{" "}
              {getTransactionStatusText(paymentDetails.vnp_ResponseCode)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái giao dịch">
              {paymentDetails.vnp_TransactionStatus === "00"
                ? "Thành công"
                : "Thất bại"}
            </Descriptions.Item>
            {/* Bạn có thể thêm các thông tin khác nếu thấy cần thiết */}
          </Descriptions>
        </Modal>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Text type="secondary">
            Bạn có bất kỳ câu hỏi nào? Vui lòng{" "}
            <Link href="/contact">liên hệ hỗ trợ</Link> của chúng tôi.
          </Text>
        </div>
      </div>
    </Row>
  );
};

export default VnPaySuccess;
