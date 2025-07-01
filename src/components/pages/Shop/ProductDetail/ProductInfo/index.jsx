import {
  Form,
  Rate,
  Radio,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Image,
  notification,
} from "antd";

import "./style.scss";
import { formatCurrency } from "../../../../../utils/string.js";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  CarOutlined,
} from "@ant-design/icons";
import AntButton from "../../../../common/Button/index.jsx";
import {
  addToCart,
  getUserCart,
} from "../../../../../services/cart.service.js";
import { getUserCartSuccess } from "../../../../../redux/actions/cart.action.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [form] = Form.useForm();
  const userId = JSON.parse(localStorage.getItem("userInfo"))?.userId;
  const dispatch = useDispatch();
  const [price, setPrice] = useState(product?.productId?.price);
  const [rating, setRating] = useState(0);
  const [priceDefault, setPriceDefault] = useState(true);
  const [stock, setStock] = useState(
    product?.PriceProductDetail?.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    )
  );
  const [selection, setSelection] = useState({});

  const navigate = useNavigate();
  const handleIncrement = () => {
    setQuantity(quantity + 1);
    console.log(stock);
  };

  const handleAddToCart = () => {
    const priceProduct = product?.PriceProductDetail?.find((detail) => {
      const s1 = detail.selection;
      const s2 = selection;

      const keys1 = Object.keys(s1);
      const keys2 = Object.keys(s2);

      if (keys1.length !== keys2.length) return false;

      return keys1.every((key) => s1[key] === s2[key]);
    });

    if (!priceProduct) {
      notification.error({
        message: "Error",
        description: "Bạn chưa chọn lịa sản phẩm",
      });
    } else {
      // console.log(priceProduct);
      const id = priceProduct?.id;
      try {
        addToCart(quantity, id).then((res) => {
          if (res?.status === 201) {
            message.success("Add to cart successfully");
            try {
              getUserCart(userId).then((res) => {
                dispatch(getUserCartSuccess(res?.data?.data?.items));
              });
            } catch (err) {
              console.log(err);
              notification.error({
                message: "Error",
                description: "Can't get user cart!",
              });
            }
          } else {
            message.error("Add to cart failed");
          }
        });
      } catch (error) {
        console.log({ error });
        message.error("Add to cart failed");
      }
      // console.log(product?.PriceProductDetail?.selection);
    }
  };

  const handleDecrement = () => {
    setQuantity(quantity - 1);
  };

  const handleChangeSelection = (value, attribute) => {
    console.log("Chọn:", value, "Thuộc nhóm:", attribute);
    const matchedAttribute = product.attributeValues.find(
      (attr) => attr.value == value && attr.attributeId?.name == attribute
    );
    console.log(matchedAttribute);

    if (matchedAttribute) {
      setSelection((prev) => ({
        ...prev,
        [matchedAttribute.attributeId.id]: matchedAttribute.id,
      }));
    }
  };

  const getDeliveryDateRange = () => {
    const now = new Date();

    // Hàm cộng ngày
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    // Hàm format ngày thành "ngày Thmm"
    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1; // tháng bắt đầu từ 0
      return `${day} Th${month < 10 ? "0" + month : month}`;
    };

    const startDate = addDays(now, 3);
    const endDate = addDays(now, 7);

    return `Nhận từ ${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const groupedAttributes = [];

  product?.PriceProductDetail?.[0]?.selectionOptions?.forEach((option) => {
    const { title } = option;
    const values = new Set();

    product?.PriceProductDetail?.slice()
      .reverse()
      .forEach((item) => {
        const match = item.selectionOptions.find((o) => o.title === title);
        match?.options?.forEach((opt) => values.add(opt.name));
      });

    groupedAttributes.push({
      title,
      options: Array.from(values),
    });
  });

  const findMatchingItem = (priceProductDetails, selectedObj) =>
    priceProductDetails.find((item) =>
      Object.entries(selectedObj).every(([key, val]) => {
        const optionGroup = item.selectionOptions.find(
          (opt) => opt.title === key
        );
        if (!optionGroup) return false;
        const optionName = optionGroup.options[0]?.name || "";
        return optionName == val;
      })
    );

  return (
    <div className="product">
      <div
        className="product-detail"
        style={{
          display: "flex",
          flexDirection: "column",
          // gap:"2px"
        }}
      >
        <h1
          style={{
            display: "inline",
            fontSize: "inherit",
            fontWeight: "inherit",
          }}
        >
          {product?.productId?.name}
        </h1>
        {/* <p>{product?.productId?.description}</p> */}
        <div
          style={{
            display: "flex",
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              borderRight: "1px solid rgba(190, 187, 187, 0.87)",
              paddingRight: 15,
            }}
          >
            <span
              style={{
                borderBottom: "1px solid #555",
                color: "#222",
                fontSize: " 1rem",
                marginRight: "5px",
                fontWeight: 400,
              }}
            >
              {product?.productId?.rate}
            </span>
            <Rate
              className="rateStar"
              value={product?.productId?.rate}
              disabled
            />
          </div>
          <div
            style={{
              display: "flex",
              borderRight: "1px solid rgba(190, 187, 187, 0.87)",
              paddingRight: 15,
              paddingLeft: 15,
            }}
          >
            <span
              style={{
                borderBottom: "1px solid #555",
                color: "#767676",
                fontSize: " 0.875rem",
                marginRight: "5px",
                fontWeight: 400,
              }}
            >
              Đã bán
            </span>
            <span
              style={{
                // borderBottom: "1px solid #555",
                color: "#222",
                fontSize: " 1rem",
                marginRight: "5px",
                fontWeight: 400,
              }}
            >
              {" "}
              {product?.productId?.sellOfQuantity < 1000
                ? product?.productId?.sellOfQuantity
                : (product?.productId?.sellOfQuantity / 1000).toFixed(1) + "K"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              // borderRight: "1px solid rgba(190, 187, 187, 0.87)",
              // paddingRight: 15,
              paddingLeft: 15,
            }}
          >
            <span
              style={{
                color: "#222",
                fontSize: " 1rem",
                marginRight: "5px",
                fontWeight: 400,
              }}
            >
              {" "}
              {rating < 1000 ? rating : (rating / 1000).toFixed(1) + "K"}
            </span>
            <span
              style={{
                // borderBottom: "1px solid #555",

                borderBottom: "1px solid #555",
                color: "#767676",
                fontSize: " 0.875rem",
                marginRight: "5px",
                fontWeight: 400,
              }}
            >
              Đánh giá
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 15,
            backgroundColor: "rgba(0,0,0,0.02)",
            padding: "15px 20px",
            marginTop: 10,
          }}
        >
          <div
            style={{
              color: "#0d6efd",
              fontSize: 30,
              fontWeight: 500,
            }}
          >
            {priceDefault
              ? formatCurrency(
                  Math.round(
                    (parseInt(price || 0) *
                      (1 -
                        (parseFloat(product?.productId?.discount) || 0) /
                          100)) /
                      100
                  ) * 100
                )
              : formatCurrency(parseInt(price || 0))}
          </div>
          <span
            style={{
              color: "#929292",
              fontSize: 16,
              fontWeight: 400,
              textDecoration: "line-through",
            }}
          >
            {priceDefault && formatCurrency(parseInt(price))}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 15,
            // backgroundColor: "rgba(0,0,0,0.02)",
            alignItems: "center",
            padding: "15px 20px",
            marginTop: 10,
          }}
        >
          <span
            style={{
              color: "#757575",
              fontSize: 14,
              fontWeight: 400,
              width: 100,
              // textDecoration: "line-through",
            }}
          >
            Vận Chuyển
          </span>
          <div>
            <Image
              width={18}
              src="https://salt.tikicdn.com/ts/upload/67/bc/b6/7aed838df704ad50927e343895885e73.png"
              alt="Shipping Icon"
            />
            <span
              style={{
                marginLeft: 6,
                color: "#222",
                fontSize: 14,
                fontWeight: 400,
                // textDecoration: "line-through",
              }}
            >
              {getDeliveryDateRange()}
            </span>
          </div>
        </div>
      </div>
      <div className="product-action">
        <Form
          style={{
            paddingLeft: 15,
          }}
          form={form}
          onValuesChange={(changedValues, allValues) => {
            // console.log("allValues", allValues);
            const values = Object.fromEntries(
              Object.entries(allValues).filter(
                ([_, value]) => value !== undefined
              )
            );
            const matchedItem = findMatchingItem(
              product?.PriceProductDetail,
              values
            );
            if (matchedItem) {
              setPrice(matchedItem.price), setStock(matchedItem.quantity);
              setPriceDefault(false);
            } else setPrice(product?.productId?.price);
          }}
        >
          {groupedAttributes.map(({ title, options }) => (
            <Form.Item
              key={title}
              name={title}
              colon={false}
              label={
                <span
                  style={{
                    fontSize: "14px",
                    height: "36px",
                    lineHeight: "36px",
                    width: 80,
                    textAlign: "left",
                  }}
                >
                  {title}
                </span>
              }
              rules={[
                {
                  required: true,
                  message: `Vui lòng chọn ${title.toLowerCase()}!`,
                },
              ]}
            >
              <Radio.Group
                style={{
                  display: "flex", // bật flexbox
                  flexWrap: "wrap", // cho phép xuống dòng nếu quá dài
                  gap: "5px", // khoảng cách giữa các nút
                  justifyContent: "flex-start",
                }}
                onChange={(e) => {
                  handleChangeSelection(e.target.value, title);

                  // bạn có thể xử lý thêm ở đây nếu cần
                }}
              >
                {options?.map((optionValue) => {
                  // Tìm phần tử trong attributeValues có value bằng optionValue
                  const matchedAttribute = product.attributeValues?.find(
                    (attr) => attr.value === optionValue
                  );
                  // console.log("optionValue", matchedAttribute);

                  return (
                    <Radio.Button
                      className="hehehe"
                      key={optionValue}
                      value={optionValue}
                      style={{
                        fontSize: "14px",
                        height: "40px",
                        lineHeight: "36px",
                        marginLeft: 16,
                        padding: "0 12px",
                        // borderRadius: "none"
                      }}
                    >
                      {matchedAttribute?.image && (
                        <Image
                          src={matchedAttribute.image}
                          alt={optionValue}
                          width={24}
                          height={24}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <span
                        style={{
                          paddingLeft: 10,
                        }}
                      >
                        {optionValue}
                      </span>
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          ))}

          <Form.Item
            name="quantity"
            colon={false}
            label={
              <span
                style={{
                  fontSize: "14px",
                  height: "36px",
                  lineHeight: "36px",
                  width: 80,
                  textAlign: "left",
                }}
              >
                Số lượng
              </span>
            }
            rules={[{ required: true, message: "Please select a quantity!" }]}
            className="product-action-size"
          >
            <Row
              style={{
                marginLeft: 16,
              }}
            >
              <div
                style={{
                  border: "1px solid #d9d9d9",
                }}
              >
                <Row>
                  <Button
                    type={"link"}
                    icon={<MinusOutlined style={{ color: "#000000" }} />}
                    onClick={handleDecrement}
                  />
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                    style={{
                      // textAlign: "center",
                      width: 50,
                      borderTop: "none",
                      borderBottom: "none",
                      borderRadius: "0",
                    }}
                    controls={false}
                  />
                  <Button
                    type={"link"}
                    icon={<PlusOutlined style={{ color: "#000000" }} />}
                    onClick={handleIncrement}
                  />
                </Row>
              </div>
            </Row>
            <p>({stock ? stock : 0} sản phẩm có sẵn)</p>
          </Form.Item>
        </Form>
      </div>
      <Row gutter={32}>
        <Col xs={12}>
          <AntButton
            text={"Thêm vào giỏ hàng"}
            theme={"light"}
            icon={<ShoppingCartOutlined style={{ fontSize: 16 }} />}
            style={{ width: "80%" }}
            onClick={() => {
              if (stock) {
                handleAddToCart();
              } else {
                message.error("Hết hàng");
              }
            }}
          />
        </Col>
        <Col xs={12}>
          <AntButton
            text={"Mua ngay"}
            theme={"dark"}
            icon={<ShoppingCartOutlined style={{ fontSize: 16 }} />}
            style={{ width: "80%" }}
            onClick={() => {
              if (stock) {
                handleAddToCart();
                setTimeout(() => {
                  navigate("/cart");
                }, 1000); // 0.5 giây
              } else {
                message.error("Hết hàng");
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProductInfo;
