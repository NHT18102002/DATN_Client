// Refactored Cart.jsx
import { Col, Form, notification, Row, Steps, message } from "antd";
import Sidebar from "../../components/common/Sidebar";
import {
  ShoppingCartOutlined,
  SmileOutlined,
  SolutionOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import AntButton from "../../components/common/Button";
import MyCart from "../../components/pages/Cart/MyCart";
import ShippingInformation from "../../components/pages/Cart/ShippingInformation";
import PaymentMethod from "../../components/pages/Cart/PaymentMethod";
import Done from "../../components/pages/Cart/Done";
import Spinner from "../../components/common/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../services/order.service";
import { getVnpayUrl } from "../../services/payment.service";
import { deleteCartItem, getUserCart } from "../../services/cart.service";
import { getUserCartSuccess } from "../../redux/actions/cart.action";
import "./style.scss";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.userCart.cart);
  const userId = JSON.parse(localStorage.getItem("userInfo"))?.id;

  const [selectProduct, setSelectProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const shippingInfo = useRef();
  const shippingId = useRef();
  const totalPrice = useRef();
  const paymentInfo = useRef();

  const [form] = Form.useForm();
  const [formPayment] = Form.useForm();

  const stepItems = [
    { title: "Giỏ Hàng", icon: <ShoppingCartOutlined /> },
    { title: "Địa Chỉ", icon: <SolutionOutlined /> },
    { title: "Phương Thức Thanh Toán", icon: <WalletOutlined /> },
    { title: "Kết Thúc", icon: <SmileOutlined /> },
  ];

  const handleDeleteCartItem = async (id) => {
    try {
      const res = await deleteCartItem(id);
      if (res?.status === 200) {
        message.success("Xóa sản phẩm khỏi giỏ hàng thành công");
        const resCart = await getUserCart(userId);
        dispatch(getUserCartSuccess(resCart?.data?.data?.items));
      } else {
        message.error("Xóa sản phẩm thất bại");
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi",
        description: "Không thể lấy giỏ hàng!",
      });
    }
  };

  const groupProductsByShop = (products) => {
    const grouped = {};

    for (const item of products) {
      const shopId = item?.itemId?.productDetail?.productId?.shop?.id;
      const shopInfo = item?.itemId?.productDetail?.productId?.shop;

      if (!shopId) continue;

      if (!grouped[shopId]) {
        grouped[shopId] = {
          shopInfo,
          items: [],
        };
      }

      grouped[shopId].items.push(item);
    }

    return grouped;
  };

  const handleCreateOrders = async () => {
    const groupedByShop = groupProductsByShop(selectProduct); // ✅ Sửa ở đây
    const shopIds = Object.keys(groupedByShop);
    let successCount = 0;

    setLoading(true);

    for (const shopId of shopIds) {
      const items = groupedByShop[shopId].items;

      const orderItems = items.map((item) => ({
        PriceProductDetail: item?.itemId?.id,
        number: item?.number,
      }));

      const totalItemMoney = items.reduce(
        (sum, item) => sum + item.itemId.price * item.number,
        0
      );

      const sendData = {
        shopId: Number(shopId),
        orderItems,
        paymentType: paymentInfo.current?.paymentMethod,
        address: shippingId.current,
        totalMoney: totalItemMoney + 20000, // ✅ Tính riêng từng shop
      };

      try {
        const res = await createOrder(sendData);
        if (res.status === 201) {
          for (const item of items) {
            await handleDeleteCartItem(item.id);
          }

          if (sendData.paymentType === "cash") {
            successCount++;
          } else {
            const { totalMoney, id: orderId } = res.data.data;
            const vnpayRes = await getVnpayUrl(totalMoney, orderId);
            if (vnpayRes.status === 201) {
              window.location.replace(vnpayRes.data.data);
              return; // ⛔ Dừng vòng lặp vì redirect sang VNPAY
            }
          }
        } else {
          notification.error({
            message: "Lỗi",
            description: `Đặt hàng thất bại cho shop ${shopId}!`,
          });
        }
      } catch (err) {
        console.error(err);
        notification.error({
          message: "Lỗi",
          description: `Đặt hàng thất bại cho shop ${shopId}`,
        });
      }
    }

    if (successCount === shopIds.length) {
      notification.success({
        message: "Thành công",
        description: "Đặt hàng thành công!",
      });
      setStep(step + 1);
    }

    setLoading(false);
  };

  const handleNext = () => {
    if (step === 0) {
      if (selectProduct.length === 0) {
        notification.warning({
          message: "Chú ý",
          description: "Vui lòng chọn ít nhất 1 sản phẩm",
        });
        return;
      }
      setStep(step + 1);
    } else if (step === 1) {
      form.validateFields().then(() => {
        shippingInfo.current = form.getFieldsValue();
        setStep(step + 1);
      });
    } else if (step === 2) {
      formPayment.validateFields().then(() => {
        paymentInfo.current = formPayment.getFieldsValue();
        setLoading(true);
        handleCreateOrders();
      });
    }
  };

  return (
    <Row>
      {step === 2 && loading && <Spinner style={{ zIndex: 99 }} />}

      <Col xs={0} md={4}>
        <Sidebar />
      </Col>

      <Col xs={24} md={20} style={{ padding: "2rem" }}>
        <Steps
          current={step}
          items={stepItems}
          style={{ marginBottom: "2rem" }}
        />

        {step === 0 && (
          <MyCart onSelectProduct={setSelectProduct} cart={cart} />
        )}
        {step === 1 && (
          <ShippingInformation
            shippingId={shippingId}
            form={form}
            userInfo={JSON.parse(localStorage.getItem("userInfo"))}
          />
        )}
        {step === 2 && (
          <PaymentMethod
            cart={selectProduct}
            shippingInfo={shippingInfo.current}
            form={formPayment}
            totalPrice={totalPrice}
          />
        )}
        {step === 3 && <Done />}

        {step < 3 && (
          <div className="cart-action">
            <AntButton
              theme="secondary"
              text="Quay lại"
              style={{ marginRight: "1rem" }}
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            />
            <AntButton
              text={step === 2 ? "Tiếp Tục" : "Tiếp tục"}
              onClick={handleNext}
            >
              Next
            </AntButton>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Cart;
