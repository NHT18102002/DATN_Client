import { instanceCoreApi } from "./setupAxios.js";
import { ORDER_API } from "./apis/index.js";

export const createOrder = async (data) => {
  return instanceCoreApi.post(ORDER_API.CREATE_ORDER, data);
};

export const getOrderByStatus = async (status) => {
  if (status === undefined || status === null) {
    // Gọi mà không có query param status
    return instanceCoreApi.get(`/orders`);
  }
  return instanceCoreApi.get(`/orders?status=${status}`);
};

export const getOrderByDetail = async (id) => {
  return instanceCoreApi.get(ORDER_API.GET_ORDER_BY_ID.replace(":id", id));
};

export const updateOrderStatus = async (id, status) => {
  return instanceCoreApi.patch(
    ORDER_API.UPDATE_ORDER_STATUS.replace(":id", id),
    { status }
  );
};

export const getMyShopOrder = async () => {
  return instanceCoreApi.get(ORDER_API.GET_SHOP_ORDER);
};

export const cancelOrder = async (id) => {
  return instanceCoreApi.patch(ORDER_API.CANCEL_ORDER.replace(":id", id));
};

export const receiveOrder = async (id) => {
  return instanceCoreApi.patch(ORDER_API.RECEIVE_ORDER.replace(":id", id));
};
