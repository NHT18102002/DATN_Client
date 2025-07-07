import {
  Button,
  Form,
  Input,
  message,
  Select,
  InputNumber,
  notification,
} from "antd";
import Uploader from "../../../../../components/common/Uploader/index.jsx";
import { useEffect, useState } from "react";
import { updateProduct } from "../../../../../services/shop.service.js";
import { getCategory } from "../../../../../services/shop.service.js";
import useCallApi from "../../../../../hook/useCallApi.js";
import Spinner from "../../../../../components/common/Spinner/index.jsx";

const BasicInformation = ({ data }) => {
  // const [data, setData] = useState()
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  const { send: fetchCategories } = useCallApi({
    callApi: getCategory,
    success: (res) => {
      setCategories(res?.data?.items);
    },
    error: () => {
      message.error("Can't get categories");
    },
  });

  useEffect(() => {
    fetchCategories();
    // console.log("dfdsfdsf", data);
  }, [data]);

  const initialFormValues = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: Number(data.discount),
    // thumbnail: data,
    // images: data,
    // stock: data,
  };
  // const {send: fetchProductDetail, loading} = useCallApi({
  //   callApi: getProductById,
  //   success: (res) => {
  //     setData(res?.data)
  //   },
  //   error: () => {
  //     message.error("Can't get product")
  //   }
  // })

  // useEffect(() => {
  //   fetchProductDetail(id)
  // }, [id])

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        price: data.price,
        discount: Number(data.discount),
        categoriesId: data?.category?.id,
        thumbnail: data.thumbnail, // nếu có
        // stock: data.stock, // nếu có
      });
    }
  }, [data]);

  return (
    <div>
      <Form
        layout={"vertical"}
        form={form}
        // initialValues={{
        //   ...initialFormValues,
        //   categoriesId: data?.category?.id,
        // }}
        onFinish={(values) => {
          // console.log(values);

          try {
            // console.log(data.id, values);
            updateProduct(data.id, values).then((res) => {
              if (res.status === 200) {
                notification.success({
                  message: "Thành công",
                  description: "Sửa thành công",
                });
              } else notification.error({ message: "Không thể cập nhật" });
            });
          } catch (error) {
            notification.error("Can't update");
          }
        }}
      >
        {() => (
          <>
            <Form.Item
              label="Name"
              name="name"
              // rules={[{ required: true, message: "Please input your title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              // rules={[
              //   { required: true, message: "Please input your description!" },
              // ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"

              // rules={[{ required: true, message: "Please input your price!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"

              // rules={[{ required: true, message: "Please input your stock!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
            <Form.Item
              label="Thumbnail"
              name="thumbnail"
              // rules={[
              //   { required: true, message: "Please input your thumbnail!" },
              // ]}
            >
              <Uploader
                setFormValue={(value) => form.setFieldValue("thumbnail", value)}
              />
            </Form.Item>
            <Form.Item
              label="Danh mục"
              name="categoriesId"
              // rules={[{ required: true, message: "Please input your title!" }]}
            >
              <Select
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select category"
                // onChange={handleChange}
                options={[
                  ...categories?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  })),
                ]}
              />
            </Form.Item>
            <Button style={{ float: "right" }} type="primary" htmlType="submit">
              Update
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default BasicInformation;
