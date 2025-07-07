export const formatCurrency = (number) => {
  const validNumber = Number(number);
  if (isNaN(validNumber)) return "0đ";
  return validNumber.toLocaleString("vi-VN") + "đ";
};
/**
 * Tính toán và trả về khoảng thời gian "bao lâu trước" từ một chuỗi thời gian ISO.
 * @param {string} isoDateString Chuỗi ngày tháng ở định dạng ISO 8601 (ví dụ: "2025-06-10T10:22:35.075Z").
 * @returns {string} Chuỗi mô tả khoảng thời gian (ví dụ: "3 giờ trước", "1 ngày trước", "2 tháng trước", "1 năm trước").
 */
export const formatTimeAgo = (isoDateString) => {
  const updatedAt = new Date(isoDateString);
  const now = new Date();

  const diffMilliseconds = now.getTime() - updatedAt.getTime();
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Tính toán tháng và năm một cách tương đối
  // Lưu ý: Cách tính này có thể không hoàn toàn chính xác với mọi trường hợp edge
  const diffYears = now.getFullYear() - updatedAt.getFullYear();
  let diffMonths = now.getMonth() - updatedAt.getMonth();

  if (now.getDate() < updatedAt.getDate()) {
    diffMonths--;
  }

  if (diffMonths < 0) {
    diffMonths += 12;
  }

  if (diffYears > 0) {
    return `${diffYears} năm trước`;
  } else if (diffMonths > 0) {
    return `${diffMonths} tháng trước`;
  } else if (diffDays > 0) {
    return `${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    return `${diffHours} giờ trước`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} phút trước`;
  } else {
    return "Vừa xong";
  }
};

export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const averageRate = (products) => {
  if (!Array.isArray(products) || products.length === 0) return 0;
  const totalRate = products.reduce((sum, p) => sum + p.rate, 0);
  const averageRate = totalRate / products.length;
  return averageRate.toFixed(1);
};

// utils/saleStatistic.js
export function getRevenueByDay(orders) {
  const revenueMap = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().slice(0, 10); // yyyy-mm-dd
    if (!revenueMap[date]) {
      revenueMap[date] = 0;
    }
    revenueMap[date] += order.totalMoney;
  });

  // Chuyển thành mảng để truyền vào biểu đồ
  return Object.entries(revenueMap).map(([date, total]) => ({
    date,
    revenue: total,
  }));
}

export function getOrderStatusStats(orders) {
  const statusMap = {};

  for (const order of orders) {
    const status = order.status;
    statusMap[status] = (statusMap[status] || 0) + 1;
  }

  return Object.entries(statusMap).map(([status, count]) => ({
    name: status,
    value: count,
  }));
}

export function  convertToSuccessFailStats(orders) {
  const result = { success: 0, failed: 0 };

  orders.forEach((order) => {
    const { status, isCancelByUser, isCancelByShop } = order;

    const isSuccess = status === "Delivered" || status === "Received";

    const isFailed =
      status === "Cancelled" ||
      status === "Rejected" ||
      status === "Falure" ||
      isCancelByUser === true ||
      isCancelByShop === true;

    if (isSuccess) {
      result.success += 1;
    } else if (isFailed) {
      result.failed += 1;
    }
  });

  return [
    { name: "Thành công", value: result.success },
    { name: "Thất bại", value: result.failed },
  ];
}


export const getRevenueByMonth = (orders) => {
  const revenueMap = Array.from({ length: 12 }, (_, i) => ({
    month: `Tháng ${i + 1}`,
    revenue: 0,
  }));

  orders?.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthIndex = date.getMonth(); // 0-based
    revenueMap[monthIndex].revenue += order.totalMoney || 0;
  });

  return revenueMap;
};


export const getTopSellingProducts = (orders) => {
  const productSalesMap = {};

  orders.forEach((order) => {
    if (order?.orderItems?.length) {
      order.orderItems.forEach((item) => {
        const product =
          item?.PriceProductDetail?.productDetail?.productId;
        const productId = product?.id;
        const productName = product?.name;

        if (productId) {
          if (!productSalesMap[productId]) {
            productSalesMap[productId] = {
              id: productId,
              name: productName,
              totalSold: 0,
            };
          }
          productSalesMap[productId].totalSold += item.number || 0;
        }
      });
    }
  });

  const products = Object.values(productSalesMap);

  // Sắp xếp theo số lượng bán ra giảm dần
  products.sort((a, b) => b.totalSold - a.totalSold);

  // Trả về sản phẩm đầu tiên nếu có
  return products[0] || null;
};


