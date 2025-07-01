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
  const  averageRate = totalRate / products.length;
  return averageRate.toFixed(1)
  
};

