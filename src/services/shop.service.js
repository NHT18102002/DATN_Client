import { instanceCoreApi } from "./setupAxios.js";
import { SHOP_API } from "./apis/index.js";

export const getAllProducts = async () => {
  return instanceCoreApi.get(SHOP_API.GET_LIST_PRODUCT);
};

export const getFilterProducts = async (params) => {
  return instanceCoreApi.get(SHOP_API.GET_FILTER_PRODUCT, {
    params,
  });
};

export const getDetailShop = async (id) => {
  return instanceCoreApi.get(SHOP_API.GET_DETAIL_SHOP(id));
};

export const getShopByOwnerId = async () => {
  return instanceCoreApi.get(SHOP_API.GET_SHOP_OWNER);
};

export const getAllShop = async () => {
  return instanceCoreApi.get(SHOP_API.GET_LIST_SHOP);
};

export const getProductDetail = async (id) => {
  return instanceCoreApi.get(SHOP_API.GET_PRODUCT_MEDIAS, {
    params: { productId: id },
  });
};

export const getShopByProductId = async (id) => {
  return instanceCoreApi.get(SHOP_API.GET_SHOP_BY_PRODUCTID, {
    params: { productId: id },
  });
};

export const getAttributeProduct = async (id) => {
  if (!id) throw new Error("Missing productDetailId");
  return instanceCoreApi.get(SHOP_API.GET_ATTRIBUTE_PRODUCT, {
    params: { productDetailId: id },
  });
};

export const getPriceProductDetail = async (id) => {
  return instanceCoreApi.get(
    SHOP_API.GET_PRICE_PRODUCT_DETAIL_BY_PRODUCT_DETAIL,
    {
      params: { productDetailId: id },
    }
  );
};

export const getAttribueValue = async (id) => {
  if (!id) throw new Error("Missing productDetailId");
  return instanceCoreApi.get(SHOP_API.GET_ATTRIBUTE_VALUE_BY_PRODUCT_DETAIL, {
    params: { productDetailId: id },
  });
};

export const getCategory = async () => {
  return instanceCoreApi.get(SHOP_API.GET_CATEGORY);
};

export const getDetailCategory = async (id) => {
  return instanceCoreApi.get(SHOP_API.GET_CATEGORY_DETAIL.replace(":id", id));
};

export const getMyProduct = async () => {
  return instanceCoreApi.get(SHOP_API.GET_MY_PRODUCT);
};

export const getProductCategory = async (id) => {
  return instanceCoreApi.get(
    SHOP_API.GET_PRODUCT_BY_CATEGORY.replace(":id", id)
  );
};

export const getProductShop = async () => {
  return instanceCoreApi.get(SHOP_API.GET_PRODUCT_SHOP.replace(":id", id));
};

export const createShop = async (data) => {
  return instanceCoreApi.post(SHOP_API.CREATE_SHOP, data);
};

export const createProduct = async (data) => {
  return instanceCoreApi.post(SHOP_API.CREATE_PRODUCT, data);
};

export const createAttributeProduct = async (data) => {
  return instanceCoreApi.post(SHOP_API.CREATE_ATTRIBUTE_PRODUCT, data);
};

export const createAttributeValue = async (data) => {
  return instanceCoreApi.post(SHOP_API.CREATE_ATTRIBUTE_VALUES, data);
};

export const createPriceProductDetail = async (data) => {
  return instanceCoreApi.post(SHOP_API.CREATE_PRICE_PODUCT_DETAIL, data);
};

export const updateProduct = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_PRODUCT.replace(":id", id),
    data
  );
};

export const updateShop = async (id, data) => {
  return instanceCoreApi.patch(SHOP_API.UPDATE_SHOP.replace(":id", id), data);
};

export const updateProductDetail = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_PRODUCT_DETAIL.replace(":id", id),
    data
  );
};

export const updatettributeProduct = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_ATTRIBUTE.replace(":id", id),
    data
  );
};

export const updatetAttributeValue = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_ATTRIBUTE_VALUE.replace(":id", id),
    data
  );
};

export const updatePriceProductDetail = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_PRICE_PRODUCT_DETAIL.replace(":id", id),
    data
  );
};

export const deleteProduct = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_PRODUCT.replace(":id", id),
    data
  );
};

export const deletettributeProduct = async (id, data) => {
  return instanceCoreApi.delete(
    SHOP_API.UPDATE_ATTRIBUTE.replace(":id", id),
    data
  );
};

export const deletetAttributeValue = async (id, data) => {
  return instanceCoreApi.delete(
    SHOP_API.UPDATE_ATTRIBUTE_VALUE.replace(":id", id),
    data
  );
};

export const deletePriceProductDetail = async (id, data) => {
  return instanceCoreApi.patch(
    SHOP_API.UPDATE_PRICE_PRODUCT_DETAIL.replace(":id", id),
    data
  );
};
