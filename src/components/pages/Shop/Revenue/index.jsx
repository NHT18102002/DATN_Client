import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DatePicker, Radio } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;

const RevenueChart = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [dateRange, setDateRange] = useState(null);
  const [month, setMonth] = useState(null);
  const [filterType, setFilterType] = useState("day"); // "day" | "month"

  // Tính tổng doanh thu
  const totalRevenue = useMemo(() => {
    return filteredData?.reduce((acc, item) => acc + item.revenue, 0) || 0;
  }, [filteredData]);

  useEffect(() => {
    if (filterType === "day" && dateRange?.length === 2) {
      const [start, end] = dateRange;
      const filtered = data.filter((item) => {
        const current = dayjs(item.date);
        return (
          current.isSameOrAfter(start, "day") &&
          current.isSameOrBefore(end, "day")
        );
      });
      setFilteredData(filtered);
    } else if (filterType === "month" && month) {
      const filtered = data.filter((item) => {
        const current = dayjs(item.date);
        return current.isSame(month, "month");
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, dateRange, month, filterType]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
          marginLeft: 0,
          marginBottom: 10,
        }}
      >
        <h3>📈 Doanh thu theo ngày</h3>
        <Radio.Group
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setDateRange(null);
            setMonth(null);
          }}
        >
          <Radio.Button value="day">Theo ngày</Radio.Button>
          <Radio.Button value="month">Theo tháng</Radio.Button>
        </Radio.Group>

        {filterType === "day" && (
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(dates) => setDateRange(dates)}
            allowClear
          />
        )}

        {filterType === "month" && (
          <DatePicker
            picker="month"
            format="YYYY-MM"
            onChange={(value) => setMonth(value)}
            allowClear
          />
        )}

        <div style={{ fontWeight: "bold", marginLeft: "auto", marginRight: 20 }}>
          🧾 Tổng doanh thu: <span style={{ color: "#1890ff" }}>{totalRevenue.toLocaleString()}₫</span>
        </div>
      </div>

      <ResponsiveContainer height={300}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
