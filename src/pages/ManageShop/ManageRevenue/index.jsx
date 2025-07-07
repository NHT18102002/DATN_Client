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
  Statistic,
} from "antd";
import { useEffect, useState } from "react";
import {
  cancelOrder,
  updateOrderStatus,
  getMyShopOrder,
} from "../../../services/order.service.js";
import { formatCurrency } from "../../../utils/string.js";
import ShopSidebar from "../../../components/common/ShopSidebar/index.jsx";
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
// import { CancelIcon } from "../../assets/Icons/CancelIcon.jsx";
import useCallApi from "../../../hook/useCallApi.js";
import Spinner from "../../../components/common/Spinner/index.jsx";
import { getRevenueByDay } from "../../../utils/string.js";
import RevenueChart from "../../../components/pages/Shop/Revenue/index.jsx";
import OrderStatusPieChart from "../../../components/pages/Shop/Piechart/index.jsx";
import { convertToSuccessFailStats } from "../../../utils/string.js";
import { getRevenueByMonth } from "../../../utils/string.js";
import RevenueByMonthChart from "../../../components/pages/Shop/RevenueByMonth/index.jsx";
import { getTopSellingProducts } from "../../../utils/string.js";
import TopProductsChart from "../../../components/pages/Shop/TopProductsChart/index.jsx";
const ManageRevenue = () => {
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState();
  const [revenueDataByMonth, setRevenueDataByMonth] = useState();
  const [statusData, setStatusData] = useState();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalOrders: 0,
    successOrders: 0,
    failedOrders: 0,
    totalRevenue: 0,
    topProduct: null,
    topRevenueDay: null,
  });

  const { send: fetchOrders, loading } = useCallApi({
    callApi: getMyShopOrder,
    success: (res) => {
      const data = res?.data?.items || [];

      setOrders(data);

      const successOrdersList = data.filter(
        (o) => o.status === "Delivered" || o.status === "Received"
      );

      const totalOrders = data.length;
      const successOrders = successOrdersList.length;
      const failedOrders = totalOrders - successOrders;

      const totalRevenue = successOrdersList.reduce(
        (acc, curr) => acc + (curr.totalMoney || 0),
        0
      );

      const revenueByDay = getRevenueByDay(successOrdersList);
      const topRevenueDay = [...revenueByDay].sort(
        (a, b) => b.revenue - a.revenue
      )[0];

      const topProductList = getTopSellingProducts(successOrdersList);
      // const topProduct = topProductList?.[0] || null;
      // Set all statistics
      setSummaryStats({
        totalOrders,
        successOrders,
        failedOrders,
        totalRevenue,
        topProduct: topProductList,
        topRevenueDay,
      });

      // Set data for charts
      setRevenueData(revenueByDay);
      setStatusData(convertToSuccessFailStats(data));
      setRevenueDataByMonth(getRevenueByMonth(successOrdersList));
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Can't get orders",
      });
    },
  });

  useEffect(() => {
    fetchOrders();
    console.log("topProductss", summaryStats);
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
            <Col xs={24} md={21}>
              <Col style={{ marginTop: 20, display: "flex" }}>
                <Col xs={24} md={16}>
                  <RevenueChart data={revenueData} />
                </Col>

                <Col xs={24} md={10}>
                  <div
                    style={{ width: "100%", height: "100%", marginLeft: 20 }}
                  >
                    <h3 style={{ marginBottom: "16px", textAlign: "start" }}>
                      📋 Tổng kết doanh thu
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-around",
                        height: "70%",
                      }}
                    >
                      <div>
                        📦 <strong>Tổng đơn hàng:</strong>{" "}
                        <span>{summaryStats.totalOrders}</span>
                      </div>
                      <div>
                        ✅ <strong>Đơn thành công:</strong>{" "}
                        <span>{summaryStats.successOrders}</span>
                      </div>
                      <div>
                        ❌ <strong>Đơn thất bại:</strong>{" "}
                        <span>{summaryStats.failedOrders}</span>
                      </div>
                      <div>
                        💰 <strong>Tổng doanh thu:</strong>{" "}
                        <span style={{ color: "#3f8600" }}>
                          {summaryStats.totalRevenue.toLocaleString()}₫
                        </span>
                      </div>
                      <div>
                        🏆 <strong>SP bán chạy:</strong>{" "}
                        <span>
                          {summaryStats.topProduct?.name || "Không có"}
                        </span>
                      </div>
                      <div>
                        📈 <strong>Ngày cao nhất:</strong>{" "}
                        <span>
                          {summaryStats.topRevenueDay?.date || "N/A"} (
                          {summaryStats.topRevenueDay?.revenue?.toLocaleString() ||
                            0}
                          ₫)
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Col>
              <Row>
                <Col xs={24} md={14} style={{ marginTop: 20, display: "flex" }}>
                  <RevenueByMonthChart data={revenueDataByMonth} />
                </Col>
                <Col xs={24} md={8}>
                  <OrderStatusPieChart data={statusData} />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* <OrderDetailModal
            showModal={showDetailModal}
            handleCancel={() => setShowDetailModal(false)}
            order_id={rowData?.id}
          /> */}
        </>
      )}
    </div>
  );
};

export default ManageRevenue;
