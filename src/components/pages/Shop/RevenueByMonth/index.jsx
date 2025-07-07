import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RevenueByMonthChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3>📊 Doanh thu theo các tháng trong năm</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
          <Bar dataKey="revenue" fill="#1890ff" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByMonthChart;
