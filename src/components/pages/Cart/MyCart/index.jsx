import {
  Button,
  Col,
  InputNumber,
  message,
  notification,
  Popconfirm,
  Row,
  Table,
  Tag,
} from "antd";
import AntImage from "../../../common/AntImage/index.jsx";
import { formatCurrency } from "../../../../utils/string.js";
import { DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  deleteCartItem,
  getUserCart,
} from "../../../../services/cart.service.js";
import { getUserCartSuccess } from "../../../../redux/actions/cart.action.js";
import { useDispatch } from "react-redux";
import Spinner from "../../../common/Spinner/index.jsx";
import { CaretDownFilled } from "@ant-design/icons";
import { updateCart } from "../../../../services/cart.service.js";
const MyCart = ({ cart, onSelectProduct }) => {
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("userInfo"))?.userId;
  const dispatch = useDispatch();
  const rowSelection = {
    onChange: (key, data) => {
      onSelectProduct(data);
      localStorage.setItem("rowKey", JSON.stringify(key));
    },
  };

  const handleUpdateCartItem = async (id, number) => {
    const parsedNumber = parseInt(number);
    console.log(number);
    if (isNaN(parsedNumber) || parsedNumber <= 0) {
      message.error("Số lượng không hợp lệ");
      return;
    }
    try {
      const res = await updateCart(id, { number });
      if (res?.status === 200) {
        // console.log(res);

        // message.success("Cập nhật số lượng thành công");

        // Lấy lại giỏ hàng mới
        const updatedCart = await getUserCart(userId);
        dispatch(getUserCartSuccess(updatedCart?.data?.data?.items));
      } else {
        message.error("Cập nhật số lượng thất bại");
      }
    } catch (error) {
      console.error("Update Cart Error:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật giỏ hàng",
      });
    }
  };

  const handleDeleteCartItem = (id) => {
    try {
      deleteCartItem(id).then((res) => {
        if (res?.status === 200) {
          message.success("Delete cart item successfully");
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
          message.error("Delete cart item failed");
        }
      });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (cart && cart?.length >= 0) setLoading(false);
  }, [cart]);

  return loading ? (
    <div style={{ height: 500 }}>
      <Spinner />
    </div>
  ) : (
    <Table
      rowKey={(record) => record?.id}
      dataSource={cart}
      pagination={false}
      rowSelection={rowSelection}
      columns={[
        {
          title: "Sản Phẩm",
          dataIndex: "title",
          key: "title",
          width: "55%",
          align: "center",
          render: (text, record) => {
            return (
              <Row
                style={{
                  display: "flex",
                  gap: 10,
                  overflow: "hidden",
                  textOverflow: "hidden",
                }}
              >
                <Col>
                  <AntImage
                    src={record?.itemId?.productDetail?.productId?.thumbnail}
                    width={80}
                    // height={0}
                  />
                </Col>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    // height: "100%",
                    width: "35%",
                    margin: "10px 0",
                    textAlign: "start",
                    fontWeight: 500,
                  }}
                >
                  {record?.itemId?.productDetail?.productId?.name} -{" "}
                </div>
                <div
                  style={{
                    marginLeft: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    gap: 10,
                    margin: "10px 0",
                  }}
                >
                  {/* {record?.itemId?.selectionOptions?.[0]?.title} */}
                  {record?.itemId?.selectionOptions?.map((selection, index) => (
                    <Row
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginLeft: 4 }}>
                        {selection.title}
                      </div>
                      <div>{selection.options?.[0].name}</div>
                    </Row>
                  ))}
                  {/* <CaretDownFilled /> */}
                </div>
              </Row>
            );
          },
        },
        {
          title: "Đơn Giá",
          dataIndex: "price",
          key: "price",
          align: "center",

          render: (text, record) => (
            <p
              style={{
                color: "#0D6EFD",
                fontWeight: 500,
              }}
            >
              {formatCurrency(record?.itemId?.price)}
            </p>
          ),
        },
        {
          title: "Số lượng",
          dataIndex: "quantity",
          key: "quantity",
          align: "center",

          render: (quantity, record) => (
            <InputNumber
              min={1}
              // max={}
              defaultValue={record?.number}
              onChange={(value) => handleUpdateCartItem(record?.id, value)}
            />
          ),
        },
        {
          title: "Số Tiền",
          dataIndex: "total",
          key: "total",
          align: "center",

          render: (text, record) => (
            <p>{formatCurrency(record?.itemId?.price * record?.number)}</p>
          ),
        },
        {
          key: "delete",
          align: "center",
          // width: 60,
          // responsive: ['lg'],
          render: (r) => {
            return (
              <Popconfirm
                title="Xác nhận"
                onConfirm={() => handleDeleteCartItem(r?.id)}
                okText="Yes"
                cancelText="Cancel"
                placement="topRight"
              >
                <Button
                  className="delete-button"
                  icon={
                    <DeleteFilled
                      className="icon-delete-btn"
                      style={{
                        color: "red",
                      }}
                    />
                  }
                  shape="circle"
                />
              </Popconfirm>
            );
          },
        },
      ]}
    />
  );
};

export default MyCart;
