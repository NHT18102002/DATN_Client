import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#ff4d4f"];

const renderCustomizedLabel = ({ name, value, percent }) =>
  `${name}: ${(percent * 100).toFixed(0)}%`;

const OrderStatusPieChart = ({ data }) => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <h3>📈 Tỉ lệ đơn hàng</h3>
    <PieChart width={400} height={270}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={renderCustomizedLabel} // 👈 hiển thị phần trăm ở label
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
);

export default OrderStatusPieChart;
