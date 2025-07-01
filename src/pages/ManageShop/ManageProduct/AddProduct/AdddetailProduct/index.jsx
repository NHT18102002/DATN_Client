import { Button, Col, Input, notification, Row, Form, Table } from "antd";
import { useEffect, useState } from "react";
import AttributeValueForm from "./AttributeValueForm/index.jsx";

import useCallApi from "../../../../../hook/useCallApi.js";
import {
  getAttributeProduct,
  createAttributeProduct,
  createPriceProductDetail,
} from "../../../../../services/shop.service.js";

const AddDetailProduct = ({ productDetailId, handleCancel }) => {
  const [productAttribute, setProductAttribute] = useState([]);
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [formAttribute] = Form.useForm();
  const [attributeValuesMap, setAttributeValuesMap] = useState({});
  const [listPriceProductDetail, setListPriceProductDetail] = useState([]);
  const [globalPrice, setGlobalPrice] = useState("");
  const [globalQuantity, setGlobalQuantity] = useState("");
  const [formProductDetail] = Form.useForm();
  const { send: fetchAttribute } = useCallApi({
    callApi: getAttributeProduct,
    success: (res) => {
      setProductAttribute(res?.data?.items || []);
    },
    error: () => {
      notification.error({
        message: "Lỗi",
        description: "Không thể lấy danh sách phân loại sản phẩm!",
      });
    },
  });

  useEffect(() => {
    if (productDetailId) {
      fetchAttribute(productDetailId);
    }
  }, [productDetailId]);

  const handleAddAttribute = async (value) => {
    try {
      const payload = {
        ...value,
        productDetailId,
      };
      const res = await createAttributeProduct(payload);
      if (res.status === 201) {
        notification.success({
          message: "Thành công",
          description: "Phân loại sản phẩm đã được tạo!",
        });
        setShowAddAttribute(false);
        formAttribute.resetFields();
        fetchAttribute(productDetailId);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tạo phân loại!",
        });
      }
    } catch (e) {
      console.error("Error adding attribute:", e);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo phân loại!",
      });
    }
  };

  const handleUpdateAttributeValues = (attributeId, values) => {
    setAttributeValuesMap((prev) => ({ ...prev, [attributeId]: values }));
  };

  useEffect(() => {
    const generateList = () => {
      const groups = Object.values(attributeValuesMap);
      if (groups.length === 0) return [];

      const result = [];
      const backtrack = (index, current) => {
        if (index === groups.length) {
          result.push([...current]);
          return;
        }

        for (const item of groups[index]) {
          current.push(item);
          backtrack(index + 1, current);
          current.pop();
        }
      };

      backtrack(0, []);
      return result;
    };

    const list = generateList();
    // console.log("list", list);

    // Thêm các field price và quantity mặc định
    const withPriceAndQuantity = list.map((combo) => ({
      combo,
      price: "",
      quantity: "",
    }));

    setListPriceProductDetail(withPriceAndQuantity);
  }, [attributeValuesMap]);

  // const listPriceProductDetail = generateListPriceProductDetail();

  const columns = [
    // Dynamically from first combo's attributes
    ...(listPriceProductDetail[0]?.combo || []).map((attr, idx) => ({
      title: attr.attributeName,
      dataIndex: `attr_${idx}`,
      key: `attr_${idx}`,
      render: (text) => <span>{text}</span>,
    })),
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => (
        <Form.Item
          name={["listPriceProductDetail", index, "price"]}
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            {
              validator(_, value) {
                if (isNaN(value) || value <= 0) {
                  return Promise.reject("Giá phải là số dương");
                }
                return Promise.resolve();
              },
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            type="number"
            size="small"
            onChange={(e) => updatePrice(index, +e.target.value)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Kho hàng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record, index) => (
        <Form.Item
          name={["listPriceProductDetail", index, "quantity"]}
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            {
              validator(_, value) {
                if (isNaN(value) || value <= 0) {
                  return Promise.reject("số lượng phải là số dương");
                }
                return Promise.resolve();
              },
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            type="number"
            size="small"
            onChange={(e) => updateQuantity(index, +e.target.value)}
          />
        </Form.Item>
      ),
    },
  ];

  const dataSource = listPriceProductDetail.map((item, index) => {
    const row = { key: index };
    item.combo.forEach((attr, idx) => {
      row[`attr_${idx}`] = attr.value;
    });
    row.price = item.price;
    row.quantity = item.quantity;
    return row;
  });

  const updatePrice = (index, value) => {
    setListPriceProductDetail((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], price: value };
      return updated;
    });
  };

  const updateQuantity = (index, value) => {
    setListPriceProductDetail((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: value };
      return updated;
    });
  };

  const generateCombinations = async (attributeProducts, attributeValues) => {
    const groups = attributeProducts.map((attr) => {
      const values = attributeValues.filter(
        (val) => val.attributeId.id === attr.id
      );
      return values.map((v) => ({ [attr.id]: v.id }));
    });

    if (groups.length === 0) return [];

    const cartesian = (arr) =>
      arr.reduce(
        (a, b) => a.flatMap((d) => b.map((e) => ({ ...d, ...e }))),
        [{}]
      );

    return cartesian(groups);
  };

  const listPriceProductDetails = () => {
    const attributeIds = Object.keys(attributeValuesMap).map(Number); // [21, 22, ...]
    // const attributeValueIds = Object.values(attributeValuesMap).map(Number); // [21, 22, ...]
    console.log("attributeValueIds", attributeValuesMap);
    return listPriceProductDetail.map((item) => {
      const selection = {};
      const attributeValueIds = [];
      item.combo.forEach((attr) => {
        selection[attr.attributeId] = attr.id; // { "21": 32, "22": 35 }
        attributeValueIds.push(attr.id);
      });

      return {
        price: item.price,
        quantity: item.quantity,
        productDetailId,
        attributeIds,
        attributeValueIds,
        selection,
      };
    });
  };
  const handleSubmitProductDetail = async () => {
    const listPayloads = listPriceProductDetails();

    try {
      for (const payload of listPayloads) {
        const res = await createPriceProductDetail(payload); // 👈 API gửi lên backend
        if (res.status !== 201) {
          throw new Error(
            `Tạo biến thể thất bại cho: ${JSON.stringify(payload)}`
          );
        }
      }

      notification.success({
        message: "Thành công",
        description: "Tạo các phân loại thành công!",
      });
      handleCancel();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Thất bại",
        description: "Có lỗi xảy ra khi tạo các phân loại!",
      });
    }
  };

  return (
    <div>
      <Row gutter={[0]}>
        {productAttribute.length > 0 ? (
          productAttribute.map((attr, index) => (
            <AttributeValueForm
              key={attr.id}
              indexAttribute={index}
              attribute={attr}
              productDetailId={productDetailId}
              onUpdateAttributeValues={handleUpdateAttributeValues}
            />
          ))
        ) : (
          <Col span={24}></Col>
        )}

        <Col span={24}>
          {!showAddAttribute && productAttribute.length < 2 && (
            <Button type="primary" onClick={() => setShowAddAttribute(true)}>
              Thêm nhóm phân loại
            </Button>
          )}

          {showAddAttribute && (
            <Form
              form={formAttribute}
              layout="inline"
              onFinish={handleAddAttribute}
              style={{ marginTop: 16 }}
            >
              <Form.Item
                label="Phân loại hàng"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên phân loại!" },
                ]}
              >
                <Input style={{ height: 25, borderRadius: 0 }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="small">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>

        {listPriceProductDetail.length > 0 && (
          <Col
            span={24}
            style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
              Danh sách phân loại hàng
            </div>
            {/* Hàng nhập giá & kho chung */}
            <Row style={{ marginBottom: 15 }} gutter={8} align="middle">
              <Col>
                <span>Áp dụng chung:</span>
              </Col>
              <Col>
                <Input
                  placeholder="Giá"
                  size="small"
                  style={{ width: 120, borderRadius: "0px" }}
                  value={globalPrice}
                  onChange={(e) => setGlobalPrice(+e.target.value)}
                />
              </Col>
              <Col>
                <Input
                  placeholder="Kho hàng"
                  size="small"
                  style={{ width: 120, borderRadius: "0px" }}
                  value={globalQuantity}
                  onChange={(e) => setGlobalQuantity(+e.target.value)}
                />
              </Col>
              <Col>
                <Button
                  style={{
                    borderRadius: "0px",
                    fontSize: 12,
                    paddingRight: 10,
                    paddingLeft: 10,
                  }}
                  size="small"
                  type="primary"
                  onClick={() => {
                    const price = parseInt(globalPrice, 10);
                    const quantity = parseInt(globalQuantity, 10);
                    if (isNaN(price) || isNaN(quantity)) {
                      return notification.warning({
                        message: "Thiếu thông tin",
                        description: "Vui lòng nhập đầy đủ giá và kho hợp lệ!",
                      });
                    }

                    setListPriceProductDetail((prev) => {
                      const newList = prev.map((item) => ({
                        ...item,
                        price,
                        quantity,
                      }));

                      formProductDetail.setFieldsValue({
                        listPriceProductDetail: newList,
                      });

                      return newList;
                    });
                  }}
                >
                  Áp dụng cho tất cả phân loại
                </Button>
              </Col>
            </Row>
            {listPriceProductDetail.length > 0 && (
              <Form
                form={formProductDetail}
                onFinish={handleSubmitProductDetail}
              >
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  bordered
                  size="small"
                />
              </Form>
            )}
          </Col>
        )}
        {dataSource.length > 0 && (
          <Col span={23} style={{ marginTop: 16, textAlign: "right" }}>
            <Button type="primary" onClick={() => formProductDetail.submit()}>
              Lưu phân loại hàng
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AddDetailProduct;
