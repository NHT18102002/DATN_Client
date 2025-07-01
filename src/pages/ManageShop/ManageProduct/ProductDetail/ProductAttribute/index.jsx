import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
  Image,
  notification,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import UploadAttributeImage from "../../../../../components/common/UploadAttributeImage";
import AttributeValueForm from "../../AddProduct/AdddetailProduct/AttributeValueForm";
import AddDetailProduct from "../../AddProduct/AdddetailProduct";
import {
  updatettributeProduct,
  updatetAttributeValue,
  updatePriceProductDetail,
  getAttributeProduct,
  getAttribueValue,
  deletetAttributeValue,
  createAttributeValue,
  deletettributeProduct,
  getPriceProductDetail,
  createPriceProductDetail,
} from "../../../../../services/shop.service";
import { useEffect, useState } from "react";
import useCallApi from "../../../../../hook/useCallApi";
import DeleteModal from "../../../../../components/pages/Address/DeleteModal";

const ProductAttribute = ({ productDetail, attributeProduct }) => {
  const [listAttributeProduct, setListAttributeProduct] =
    useState(attributeProduct);
  const [editingAttrId, setEditingAttrId] = useState(null);
  const [editingAttrValueId, setEditingAttrValueId] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [formAttr] = Form.useForm();
  const [formAttrValue] = Form.useForm();
  const [formAddAttrValue] = Form.useForm();
  const [formPrice] = Form.useForm();
  const [showDeleteAttributeModal, setShowDeleteAttributeModal] =
    useState(false);
  const [showDeleteAttributeValueModal, setShowDeleteAttributeValueModal] =
    useState(false);
  const [attributeValues, setAttributeValues] = useState(
    productDetail?.attributeValues || []
  );
  const [priceProductDetails, setPriceProductDetails] = useState(
    productDetail?.PriceProductDetail || []
  );

  const { send: fetchProductAttribute } = useCallApi({
    callApi: getAttributeProduct,
    success: (res) => {
      setListAttributeProduct(res?.data?.items);
      // console.log("hehehehhe");
    },
    error: () => {
      message.error("Can't get product default attributes");
    },
  });

  const { send: fetchAttributeValue } = useCallApi({
    callApi: getAttribueValue,
    success: (res) => {
      setAttributeValues(res?.data?.items);
    },
    error: () => {
      message.error("Can't get product default attributes");
    },
  });

  const { send: fetchPriceProductDetail } = useCallApi({
    callApi: getPriceProductDetail,
    success: (res) => {
      setPriceProductDetails(res?.data?.items);
    },
    error: () => {
      message.error("Can't get product default attributes");
    },
  });

  useEffect(() => {
    if (productDetail) {
      setAttributeValues(productDetail?.attributeValues || []);
      setPriceProductDetails(productDetail?.PriceProductDetail || []);
    }
  }, [productDetail]);

  useEffect(() => {
    fetchProductAttribute(productDetail?.id);
    // console.log("editingAttrId", productDetail);
  }, [editingAttrId, productDetail]);
  // Handle update AttributeProduct name
  const handleSaveAttributeProduct = async (values) => {
    const id = editingAttrId;
    try {
      updatettributeProduct(id, { name: values.name }).then((res) => {
        if (res?.status === 200) {
          setEditingAttrId(null);

          notification.success({
            message: "Success",
            description: "Update successfully!",
          });
        } else {
          notification.error({
            message: "Error",
            description: "Can't update user information",
          });
        }
      });
      // fetchProductAttribute(productDetail.id);
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: "Can't update user information",
      });
    }
  };

  // Handle update AttributeValue
  const handleSaveAttributeValue = async (values) => {
    const valId = editingAttrValueId;
    try {
      updatetAttributeValue(valId, {
        value: values.value,
        image: values.image,
      }).then((res) => {
        if (res?.status === 200) {
          fetchAttributeValue(productDetail.id);
          setEditingAttrValueId(null);

          notification.success({
            message: "Success",
            description: "Update successfully!",
          });
        } else {
          notification.error({
            message: "Error",
            description: "Can't update user information",
          });
        }
      });
      // fetchProductAttribute(productDetail.id);
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: "Can't update user information",
      });
    }
  };
  const handleImageChange = (url) => {
    formAttrValue.setFieldValue("image", url); // 👈 Gán vào form
  };
  // Handle update PriceProductDetail (price, quantity)
  const handleUpdatePriceList = async (values) => {
    console.log("values", values); // Kiểm tra values.details ở đây

    try {
      const details = values.details || [];

      for (let i = 0; i < priceProductDetails.length; i++) {
        const item = priceProductDetails[i];
        await updatePriceProductDetail(item.id, {
          price: Number(details[i].price),
          quantity: Number(details[i].quantity),
        });
      }

      notification.success({ message: "Cập nhật thành công" });
    } catch {
      notification.error({ message: "Cập nhật thất bại" });
    }
  };

  const handleSinglePriceUpdate = async (recordId) => {
    try {
      // Tìm index ứng với recordId
      const index = priceProductDetails.findIndex(
        (item) => item.id === recordId
      );
      if (index === -1) throw new Error("Không tìm thấy sản phẩm");

      // Validate chỉ 2 trường tại index đó
      const values = await formPrice.validateFields([
        ["details", index, "price"],
        ["details", index, "quantity"],
      ]);

      const price = Number(values.details?.[index]?.price);
      const quantity = Number(values.details?.[index]?.quantity);

      await updatePriceProductDetail(recordId, { price, quantity });

      notification.success({ message: "Cập nhật thành công" });
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi khi cập nhật giá/kho",
      });
    }
  };

  const handleDeleteAttribute = async () => {
    try {
      deletettributeProduct(editingAttrId).then((res) => {
        // console.log({ res });
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Deleted successfully",
          });
          setShowDeleteAttributeModal(false);
          fetchProductAttribute(productDetail.id);
          fetchAttributeValue(productDetail.id);
          fetchPriceProductDetail(productDetail.id);
        } else {
          notification.error({
            message: "Error",
            description: "Can't delete Address",
          });
        }
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Can't delete Address",
      });
      // setShowDeleteModal(false);
    }
  };

  const handleDeleteAttributeValue = async () => {
    try {
      deletetAttributeValue(editingAttrValueId).then((res) => {
        console.log({ res });
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Deleted successfully",
          });
          setShowDeleteAttributeValueModal(false);
          // fetchProductAttribute(productDetail.id);
          fetchAttributeValue(productDetail.id);
          fetchPriceProductDetail(productDetail.id);
        } else {
          notification.error({
            message: "Error",
            description: "Can't delete Address",
          });
        }
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Can't delete Address",
      });
      // setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const initialDetails = priceProductDetails.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));
    formPrice.setFieldsValue({ details: initialDetails });
  }, [priceProductDetails]);

  const generateCombinations = (attributeProduct, attributeValues) => {
    const grouped = {};
    attributeProduct.forEach((attr) => {
      grouped[attr.id] = attributeValues.filter(
        (val) => val.attributeId === attr.id
      );
    });

    const result = [];
    const backtrack = (keys, index, current) => {
      if (index === keys.length) {
        result.push([...current]);
        return;
      }
      const attrId = keys[index];
      for (const val of grouped[attrId]) {
        current.push(val);
        backtrack(keys, index + 1, current);
        current.pop();
      }
    };

    const attrIds = Object.keys(grouped);
    if (attrIds.length > 0) {
      backtrack(attrIds, 0, []);
    }
    return result;
  };

  const generateMissingCombinations = () => {
    // Nhóm attributeValues theo attributeProduct
    const groupedByAttribute = {};
    for (const val of attributeValues) {
      const attrId = val.attributeId.id;
      if (!groupedByAttribute[attrId]) {
        groupedByAttribute[attrId] = [];
      }
      groupedByAttribute[attrId].push(val);
    }

    const groups = attributeProduct
      .map((attr) => groupedByAttribute[attr.id])
      .filter((group) => group && group.length > 0);

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

    // Lọc ra tổ hợp chưa tồn tại
    const missingCombinations = result.filter((combo) => {
      const comboIds = combo.map((v) => v.id).sort();
      return !priceProductDetails.some((item) => {
        const existingIds = Object.values(item.selection).sort();
        return JSON.stringify(comboIds) === JSON.stringify(existingIds);
      });
    });

    // Tạo record mới cho tổ hợp chưa tồn tại
    const newCombinations = missingCombinations.map((combo) => {
      const selection = {};
      combo.forEach((v) => {
        selection[v.attributeId.id] = v.id;
      });

      return {
        combo,
        selection,
        price: "",
        quantity: "",
      };
    });

    return newCombinations;
  };

  const handleAddAttributeValueSubmit = async (values) => {
    const { value, image } = values;

    if (!value || value.trim() === "") {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng nhập giá trị phân loại.",
      });
      return;
    }

    try {
      const payload = {
        productDetailId: productDetail.id,
        attributeId: selectedAttribute.id,
        value,
        image,
      };

      const res = await createAttributeValue(payload);

      if (res.status === 201) {
        notification.success({
          message: "Thành công",
          description: `Đã thêm giá trị`,
        });

        formAddAttrValue.resetFields();
        setSelectedAttribute(null);

        // ✅ Gọi lại API để lấy toàn bộ attribute value mới nhất
        const resAttr = await getAttribueValue(productDetail.id);
        const rawValues = resAttr?.data?.data?.items || [];

        // ✅ Chuẩn hóa attribute value
        const normalizedValues = rawValues.map((item) => ({
          id: item.id,
          value: item.value,
          image: item.image,
          attributeId: item.attributeId.id,
        }));

        // ✅ Tạo tổ hợp mới từ toàn bộ value
        const newCombos = generateCombinations(
          attributeProduct,
          normalizedValues
        );

        // ✅ Chuyển các tổ hợp đã có thành JSON key
        const existingCombos = priceProductDetails.map((item) =>
          JSON.stringify(Object.entries(item.selection).sort())
        );

        // ✅ Tìm tổ hợp cần tạo mới
        const combosToCreate = newCombos.filter((combo) => {
          const selection = {};
          combo.forEach((v) => {
            selection[v.attributeId] = v.id;
          });
          const key = JSON.stringify(Object.entries(selection).sort());
          return !existingCombos.includes(key);
        });

        // ✅ Gọi API tạo các tổ hợp mới
        for (const combo of combosToCreate) {
          const selection = {};
          combo.forEach((v) => {
            selection[v.attributeId] = v.id;
          });

          await createPriceProductDetail({
            productDetailId: productDetail.id,
            attributeIds: combo.map((v) => v.attributeId),
            attributeValueIds: combo.map((v) => v.id),
            selection,
            price: 0,
            quantity: 0,
          });
        }

        // ✅ Load lại dữ liệu
        fetchAttributeValue(productDetail.id);
        fetchPriceProductDetail(productDetail.id);
      } else {
        notification.error({
          message: "Lỗi",
          description: `Tạo giá trị '${value}' thất bại`,
        });
      }
    } catch (e) {
      console.error(e);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra trong quá trình xử lý.",
      });
    }
  };

  return (
    <div>
      <Row gutter={32}>
        <Col span={24}>
          <h3>Danh sách phân loại</h3>
          <Form
            form={formAttr}
            onFinish={handleSaveAttributeProduct}
            component={false} // không render thẻ <form> bọc, để không ảnh hưởng Table
          >
            <Table
              dataSource={listAttributeProduct}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Tên phân loại",
                  render: (_, record) => {
                    return editingAttrId === record.id ? (
                      <Form.Item
                        name="name"
                        style={{ margin: 0 }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên phân loại",
                          },
                        ]}
                      >
                        <Input
                          style={{
                            borderRadius: 0,
                          }}
                        />
                      </Form.Item>
                    ) : (
                      record.name
                    );
                  },
                },
                {
                  title: "Hành động",
                  render: (_, record) =>
                    editingAttrId === record.id ? (
                      <Row style={{ gap: 5 }}>
                        <Button
                          icon={<SaveOutlined />}
                          onClick={() => formAttr.submit()}
                          size="small"
                        />
                        <Button
                          icon={<CloseCircleOutlined />}
                          onClick={() => setEditingAttrId(null)}
                          size="small"
                        />
                      </Row>
                    ) : (
                      <Row
                        style={{
                          gap: 5,
                        }}
                      >
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingAttrId(record.id);
                            formAttr.setFieldsValue({ name: record.name }); // đặt lại giá trị trước khi render
                          }}
                          size="small"
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            setShowDeleteAttributeModal(true);
                            setEditingAttrId(record.id);
                            // handleDeleteAttribute(record.id);
                            // formAttr.setFieldsValue({ name: record.name }); // đặt lại giá trị trước khi render
                          }}
                          size="small"
                        />
                        <Tooltip
                          title="Thêm giá trị phân loại"
                          placement="topLeft"
                        >
                          <Button
                            icon={<PlusCircleOutlined />}
                            size="small"
                            onClick={() => setSelectedAttribute(record)}
                          />
                        </Tooltip>
                      </Row>
                    ),
                },
              ]}
            />
          </Form>

          {selectedAttribute && (
            <div style={{ marginTop: 20 }}>
              <Form
                form={formAddAttrValue}
                onFinish={handleAddAttributeValueSubmit}
                layout="inline"
                style={{ padding: 10, gap: 15 }}
              >
                <Row
                  gutter={[16, 16]}
                  className="AttributeValueForm"
                  style={{ width: "100%" }}
                >
                  <Col
                    flex="none"
                    style={{ border: "1px solid #ccc", padding: 10 }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* <Space size={0} style={{ marginRight: "8px" }}> */}

                      <UploadAttributeImage
                        defaultImage={formAttrValue.getFieldValue("image")}
                        setFormValue={(imageUrl) => {
                          formAttrValue.setFieldsValue({ image: imageUrl });
                        }}
                      />

                      <Form.Item
                        name="value"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá trị!",
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input
                          placeholder={`Nhập giá trị cho ${selectedAttribute.name}`}
                          style={{ width: 200, height: 25, borderRadius: 0 }}
                        />
                      </Form.Item>
                      {/* </Space> */}
                    </div>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: 10 }}>
                  <Button type="primary" htmlType="submit" size="small">
                    Lưu
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {listAttributeProduct.length == 1 && (
            <AddDetailProduct
              productDetailId={productDetail?.id}
              // handleCancel={onClose}
            />
          )}
        </Col>

        <Col span={24}>
          <h3>Giá trị phân loại</h3>
          <Form form={formAttrValue} onFinish={handleSaveAttributeValue}>
            <Table
              dataSource={attributeValues}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Phân loại",
                  render: (_, record) => record?.attributeId?.name,
                },
                {
                  title: "Giá trị",
                  render: (_, record) =>
                    editingAttrValueId === record.id ? (
                      <Form.Item
                        name="value"
                        style={{ margin: 0 }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên phân loại",
                          },
                        ]}
                      >
                        <Input
                          style={{
                            borderRadius: 0,
                          }}
                        />
                      </Form.Item>
                    ) : (
                      record.value
                    ),
                },
                {
                  title: "Ảnh",
                  render: (_, record) =>
                    editingAttrValueId === record.id ? (
                      <>
                        <Form.Item
                          name="image"
                          style={{ margin: 0 }}
                          rules={
                            [
                              // { required: true, message: "Vui lòng chọn ảnh" },
                            ]
                          }
                        >
                          {/* Ẩn trường input image (nhưng cần cho form.submit) */}
                          <Input type="hidden" />
                          <UploadAttributeImage
                            defaultImage={record.image}
                            setFormValue={handleImageChange}
                          />
                        </Form.Item>
                      </>
                    ) : record.image ? (
                      <Image
                        src={record.image}
                        alt="ảnh"
                        style={{ width: 25, height: 25, objectFit: "cover" }}
                      />
                    ) : null,
                },
                {
                  title: "Hành động",
                  render: (_, record) =>
                    editingAttrValueId === record.id ? (
                      <Row
                        style={{
                          gap: 5,
                        }}
                      >
                        <Button
                          icon={<SaveOutlined />}
                          onClick={() => formAttrValue.submit()}
                          size="small"
                        />
                        <Button
                          icon={<CloseCircleOutlined />}
                          onClick={() => setEditingAttrValueId(null)}
                          size="small"
                        />
                      </Row>
                    ) : (
                      <Row
                        style={{
                          gap: 5,
                        }}
                      >
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingAttrValueId(record.id);
                            formAttrValue.setFieldsValue({
                              value: record.value,
                              image: record.image, // 👈 Thêm dòng này
                            });
                          }}
                          size="small"
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            setShowDeleteAttributeValueModal(true);
                            setEditingAttrValueId(record.id);
                            // handleDeleteAttribute(record.id);
                            // formAttr.setFieldsValue({ name: record.name }); // đặt lại giá trị trước khi render
                          }}
                          size="small"
                        />
                      </Row>
                    ),
                },
              ]}
            />
          </Form>
        </Col>
      </Row>

      <br />
      <Row>
        <Col span={24}>
          <h3>Bảng giá và kho hàng</h3>
          {priceProductDetails.length > 0 && (
            <Form form={formPrice} onFinish={handleUpdatePriceList}>
              <Table
                dataSource={priceProductDetails.map((item, index) => ({
                  ...item,
                  key: item.id, // nên dùng id làm key ổn định hơn
                }))}
                pagination={false}
                columns={[
                  {
                    title: "Loại sản phẩm",
                    render: (_, record) =>
                      Object.entries(record.selection)
                        .map(([attrId, valId]) => {
                          const attr = attributeProduct.find(
                            (a) => a.id == attrId
                          );
                          const val = attributeValues.find(
                            (v) => v.id == valId
                          );
                          return `${attr?.name || ""}: ${val?.value || ""}`;
                        })
                        .join(" / "),
                  },

                  {
                    title: "Giá",
                    render: (_, record, index) => (
                      <Form.Item
                        style={{ margin: 0 }}
                        name={["details", index, "price"]}
                        // initialValue={record.price}
                        rules={[{ required: true, message: "Nhập giá" }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    ),
                  },

                  {
                    title: "Số lượng",
                    render: (_, record, index) => (
                      <Form.Item
                        style={{ margin: 0 }}
                        name={["details", index, "quantity"]}
                        // initialValue={record.quantity}
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Hành động",
                    render: (_, record) => (
                      <Button
                        icon={<SaveOutlined />}
                        size="small"
                        onClick={() => handleSinglePriceUpdate(record.id)}
                      ></Button>
                    ),
                  },
                ]}
              />

              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: 10 }}
              >
                Cập nhật
              </Button>
            </Form>
          )}
        </Col>
      </Row>
      <DeleteModal
        show={showDeleteAttributeModal}
        title={""}
        content={"Bạn có chắc muốn xoá?"}
        handleDelete={handleDeleteAttribute}
        handleCancel={() => {
          setShowDeleteAttributeModal(false);
          setEditingAttrId(null);
        }}
      />
      <DeleteModal
        show={showDeleteAttributeValueModal}
        title={""}
        content={"Bạn có chắc muốn xoá?"}
        handleDelete={handleDeleteAttributeValue}
        handleCancel={() => {
          setShowDeleteAttributeValueModal(false);
          setEditingAttrValueId(null);
        }}
      />
    </div>
  );
};

export default ProductAttribute;
