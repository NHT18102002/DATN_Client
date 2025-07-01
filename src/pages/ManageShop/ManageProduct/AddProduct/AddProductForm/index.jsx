// AddProductForm.jsx
import {
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Button,
  notification,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import Uploader from "../../../../../components/common/Uploader/index.jsx";
import { getCategory } from "../../../../../services/shop.service.js";
import { createProduct } from "../../../../../services/shop.service.js";
const AddProductForm = ({ form, setActiveKey, setProductDetailId }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategory()
      .then((res) => {
        if (res.status === 200) {
          setCategories(res?.data?.data?.items);
        } else {
          message.error("Can't get categories");
        }
      })
      .catch(() => message.error("Can't get categories"));
  }, []);

  // useEffect(() => {
  //   if (isEdit) {
  //     form.setFieldsValue(data);
  //     form.validateFields();
  //   } else {
  //     form.resetFields();
  //     form.setFieldsValue(data);
  //   }
  // }, [data, form, isEdit]);

  const onFinish = async (values) => {
    try {
      const res = await createProduct(values);
      if (res.status === 201) {
        notification.success({
          message: "Thành công",
          description: "Sản phẩm đã được tạo!",
        });
        // Nếu cần đóng modal:
        // if (setShowEditModal) setShowEditModal(false);
        // if (fetchProducts) fetchProducts(); // Reload lại danh sách
        if (setActiveKey) setActiveKey("2"); // Chuyển sang tab 2
        const newProductId = res?.data?.data?.id;
        console.log("newProductId", newProductId);
        setProductDetailId(newProductId);
      }
    } catch (eror) {
      console.log(e);
      notification.error({
        message: eror?.respone?.data?.message,
        description: "Không thể tạo sản phẩm!",
      });
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <Input />
      </Form.Item>
      <Row gutter={40}>
        <Col span={8}>
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              { type: "number", message: "Giá phải là số" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              { required: true, message: "Vui lòng nhập giảm giá!" },
              { type: "number", message: "Giảm giá phải là số" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng!" },
              // { type: "number", message: "Giảm giá phải là số" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Ảnh bìa"
        name="thumbnail"
        rules={[{ required: true, message: "Vui lòng chọn ảnh bìa!" }]}
      >
        <Uploader
          setFormValue={(data) => form.setFieldValue("thumbnail", data)}
        />
      </Form.Item>

      <Form.Item
        label="Hình ảnh sản phẩm"
        name="medias"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn ít nhất một hình ảnh sản phẩm!",
          },
        ]}
      >
        <Uploader
          multiple
          setFormValue={(newUrls) => {
            const current = form.getFieldValue("medias") || [];
            form.setFieldValue("medias", [...current, newUrls]);
          }}
        />
      </Form.Item>

      <Form.Item
        label="Danh mục"
        name="categoriesId"
        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
      >
        <Select
          allowClear
          placeholder="Chọn danh mục"
          options={categories.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {"Tiếp tục"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddProductForm;
