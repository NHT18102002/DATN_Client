import { instanceCoreApi } from "./setupAxios.js";
import { REVIEW_API } from "./apis/index.js";

export const getReviewProduct = async (id) => {
  return instanceCoreApi.get(REVIEW_API.GET_REVIEW_PRODUCT, {
    params: { productId: id },
  });
};

export const getReviewByOrder = async (id) => {
  return instanceCoreApi.get(REVIEW_API.GET_REVIEW_PRODUCT, {
    params: { orderItemId: id },
  });
};

export const createReview = async (data) => {
  return instanceCoreApi.post(REVIEW_API.CREATE_REVIEW, data);
};

export const updateReview = (id, data) => {
  return instanceCoreApi.patch(
    REVIEW_API.UPDATE_REVIEW.replace(":id", id),
    data
  );
};

export const deleteReview = (id) => {
  return instanceCoreApi.delete(REVIEW_API.UPDATE_REVIEW.replace(":id", id));
};
