// TopProductsChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TopProductsChart = ({ data }) => (
  <div style={{ width: "100%", height: 350 }}>
    <h3>🔥 Top sản phẩm bán chạy</h3>
    <ResponsiveContainer>
      <BarChart
        layout="vertical"
        data={data.slice(0, 5)} // Chỉ top 5
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
        <YAxis type="category" dataKey="name" width={150} />
        <Tooltip formatter={(v) => `${v.toLocaleString()}₫`} />
        <Bar dataKey="revenue" fill="#f78a09" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TopProductsChart;
