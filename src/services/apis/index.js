export const SHOP_API = {
  GET_LIST_PRODUCT: "/products/all", //
  GET_FILTER_PRODUCT: "/products", //
  GET_LIST_SHOP: "/shops",
  GET_FILTER_SHOP:"/shops/search",
  GET_SHOP_OWNER: "/shops/my-shop",
  GET_SHOP_BY_PRODUCTID: "/shops/shop-product",
  GET_DETAIL_PRODUCT: "/products/:id",
  GET_DETAIL_SHOP: (id) => `/shops/${id}`,
  GET_PRODUCT_MEDIAS: "/product-details",
  GET_CATEGORY: "/categories",
  GET_CATEGORY_DETAIL: "/categories/:id",
  GET_MY_PRODUCT: "/products/my-product",
  GET_PRODUCT_BY_CATEGORY: "/products/category/:id",
  GET_PRODUCT_SHOP: "/products/shop/:id",
  GET_PRODUCT_DETAIL_BY_PRODUCT: "/product-details",
  GET_ATTRIBUTE_PRODUCT: "/product-details/attributes",
  GET_PRICE_PRODUCT_DETAIL_BY_PRODUCT_DETAIL: "/product-details/selections",
  GET_ATTRIBUTE_VALUE_BY_PRODUCT_DETAIL: "/product-details/values",
  CREATE_PRODUCT: "/products",
  CREATE_SHOP: "/shops",
  CREATE_ATTRIBUTE_PRODUCT: "/product-details/attributes",
  CREATE_ATTRIBUTE_VALUES: "/product-details/values",
  CREATE_PRICE_PODUCT_DETAIL: "/product-details/selections",
  UPDATE_PRODUCT: "/products/update/:id",
  UPDATE_PRODUCT_STATUS: "/products/update-status/:id",
  UPDATE_SHOP: "/shops/:id",
  UPDATE_PRODUCT_DETAIL: "/product-details/:id",
  UPDATE_ATTRIBUTE: "/product-details/attributes/:id",
  UPDATE_ATTRIBUTE_VALUE: "/product-details/values/:id",
  UPDATE_PRICE_PRODUCT_DETAIL: "/product-details/selections/:id",
};

export const REVIEW_API = {
  CREATE_REVIEW: "/reviews",
  UPDATE_REVIEW: "/reviews/:id",
  GET_REVIEW_PRODUCT: "/reviews/product-review",
};

export const AUTH_API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_ME: "/auth/me",
};

export const USER_API = {
  GET_USER_INFO: "/users/profile",
  UPDATE_USER_INFO: "/users/profile/update",
};

export const IMAGE_UPLOAD_API = {
  UPLOAD_IMAGE: "/upload/image",
};

export const CART_API = {
  GET_CART: "/cart-items",
  GET_DETAIL_CART: "/cart-items/:id",
  UPDATE_CART: "/cart-items/:id",
};

export const ADDRESS_API = {
  ADD_ADDRESS: "/users/address",
  GET_USER_ADDRESS: "/users/address",
  SET_DEFAULT_ADDRESS: "/users/address/default/:id",
  UPDATE_ADDRESS: "/users/address/:id",
  DELETE_ADDRESS: "/users/address/:id",
};

export const ORDER_API = {
  CREATE_ORDER: "/orders",
  GET_ORDER_BY_STATUS: "/orders?status=",
  GET_ORDER_BY_ID: "/orders/:id",
  CANCEL_ORDER: "/orders/user/cancel/:id",
  RECEIVE_ORDER: "/orders/received/:id",
  GET_SHOP_ORDER: "/orders/my-shop-order",
  GET_ORDER_BY_ID: "/orders/detail/management/:id",
  UPDATE_ORDER_STATUS: '/orders/:id',
};

export const BANNER_API = {
  GET_BANNER: "/sliders",
};

export const PAYMENT_API = {
  GET_VNPAY_URL: "/transations/vnpay",
};
