// File: src/components/shop/product-detail/AddDetailProduct/AttributeValueForm.jsx
import React, { useEffect } from "react";
import { Form, Input, Button, Space, notification, Row, Col } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import UploadAttributeImage from "../../../../../../components/common/UploadAttributeImage/index.jsx";
import useCallApi from "../../../../../../hook/useCallApi.js";
import {
  getAttribueValue,
  createAttributeValue,
} from "../../../../../../services/shop.service.js";
import "./style.scss";

const AttributeValueForm = ({
  attribute,
  productDetailId,
  onUpdateAttributeValues,
  indexAttribute,
}) => {
  const [form] = Form.useForm();

  const { send: fetchCurrentAttributeValues } = useCallApi({
    callApi: getAttribueValue,
    success: (res) => {
      const allFetchedValues = res?.data?.items || [];
      const groupedByAttribute = {};
      for (const item of allFetchedValues) {
        const attrId = item.attributeId.id;
        if (!groupedByAttribute[attrId]) {
          groupedByAttribute[attrId] = [];
        }
        groupedByAttribute[attrId].push({
          id: item.id,
          value: item.value,
          image: item.image,
          attributeId: item.attributeId.id,
          attributeName: item.attributeId.name,
        });
      }

      const currentAttributeSpecificValues =
        groupedByAttribute[attribute.id] || [];

      if (currentAttributeSpecificValues.length > 0) {
        form.setFieldsValue({
          attributevalues: currentAttributeSpecificValues,
        });
      } else {
        form.setFieldsValue({ attributevalues: [{ value: "", image: "" }] });
      }

      // Gửi dữ liệu attribute value về component cha để xử lý tổ hợp
      onUpdateAttributeValues(attribute.id, currentAttributeSpecificValues);
    },
    error: () => {
      // notification.error({
      //   message: "Lỗi",
      //   description: `Không thể lấy giá trị cho phân loại '${attribute.name}'`,
      // });
      form.setFieldsValue({ attributevalues: [{ value: "", image: "" }] });
    },
  });

  useEffect(() => {
    fetchCurrentAttributeValues(productDetailId);
  }, [attribute.id, productDetailId]);

  const handleAddAttributeValueSubmit = async (values) => {
    const filteredValues = values.attributevalues.filter(
      (item) => item.value && item.value.trim() !== "" && !item.id // 👈 chỉ gửi item chưa có id
    );

    if (filteredValues.length === 0) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng nhập ít nhất một giá trị phân loại.",
      });
      return;
    }

    try {
      for (const item of filteredValues) {
        const payload = {
          productDetailId,
          attributeId: attribute.id,
          value: item.value,
          image: item.image,
        };
        const res = await createAttributeValue(payload);

        if (res.status !== 201) {
          notification.error({
            message: "Lỗi",
            description: `Tạo giá trị '${item.value}' thất bại`,
          });
        }
      }

      notification.success({
        message: "Thành công",
        description: `Đã lưu tất cả giá trị cho '${attribute.name}'`,
      });
      form.resetFields();
      fetchCurrentAttributeValues(productDetailId);
    } catch (e) {
      console.error(e);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi lưu giá trị phân loại",
      });
    }
  };

  return (
    <Col
      span={24}
      style={{
        marginBottom: 24,
        backgroundColor: "#f6f6f6",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <div
        style={{
          padding: 5,
          borderBottom: "1px solid #ccc",
        }}
      >
        <span> Phân loại hàng: </span>

        <span
          style={{
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          {attribute.name}
        </span>
      </div>
      <Form
        form={form}
        onFinish={handleAddAttributeValueSubmit}
        layout="inline"
        style={{ padding: 10, gap: 15 }}
      >
        <Form.List name="attributevalues">
          {(fields, { add, remove }) => (
            <Row
              gutter={[16, 16]}
              className="AttributeValueForm"
              style={{ width: "100%" }}
            >
              {fields.length === 0 && (
                <Col span={24}>
                  <Button
                    type="dashed"
                    onClick={() => add({ value: "", image: "" })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm giá trị cho {attribute.name}
                  </Button>
                </Col>
              )}

              {fields.map((field, index) => (
                <Col
                  key={`${field.key}-${index}`}
                  flex="none"
                  style={{ border: "1px solid #ccc" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Space size={0} style={{ marginRight: "0px" }}>
                      {indexAttribute === 0 && (
                        <UploadAttributeImage
                          defaultImage={
                            form.getFieldValue("attributevalues")?.[field.name]
                              ?.image
                          }
                          setFormValue={(imageUrl) => {
                            const values =
                              form.getFieldValue("attributevalues") || [];
                            const updated = [...values];
                            updated[field.name] = {
                              ...updated[field.name],
                              image: imageUrl,
                            };
                            form.setFieldsValue({ attributevalues: updated });
                          }}
                        />
                      )}
                      <Form.Item
                        key={`value-${field.key}-${index}`}
                        {...field}
                        name={[field.name, "value"]}
                        rules={[
                          { required: true, message: "Vui lòng nhập giá trị!" },
                        ]}
                        style={{ marginBottom: 0, marginRight: 2 }}
                      >
                        <Input
                          placeholder="Nhập"
                          style={{ width: 200, height: 25, borderRadius: 0 }}
                        />
                      </Form.Item>
                    </Space>

                    {fields.length > 1 && (
                      <DeleteOutlined
                        onClick={() => remove(field.name)}
                        style={{
                          color: "#222",
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </div>
                </Col>
              ))}

              {fields.length > 0 && (
                <Button
                  onClick={() => add({ value: "", image: "" })}
                  icon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <PlusOutlined
                        style={{ fontSize: 14, color: "#0d6efd" }}
                      />
                    </div>
                  }
                  style={{ width: 25, height: 25, borderRadius: 0, padding: 0 }}
                />
              )}
            </Row>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="small">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
};

export default AttributeValueForm;
