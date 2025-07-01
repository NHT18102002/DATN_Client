// AddProduct.jsx
import { Modal, Tabs, Form } from "antd";
import AddProductForm from "./AddProductForm";
import { useRef, useState } from "react";
// import ProductAttribute from "./ProductAttribute";
import AddDetailProduct from "./AdddetailProduct";
// import style from "./style.scss";
const AddProduct = ({ visible, handleCancel }) => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("1");
  const [productDetailId, setProductDetailId] = useState(null);

  // const form = useRef();
  const items = [
    {
      key: "1",
      label: `Thông tin cơ bản`,
      children: (
        <AddProductForm
          form={form}
          setActiveKey={setActiveKey}
          setProductDetailId={setProductDetailId}
        />
      ),
    },
    {
      key: "2",
      label: `Thông tin chi tiết`,
      children: (
        <AddDetailProduct
          productDetailId={productDetailId}
          handleCancel={handleCancel}
        />
      ),
    },
  ];

  return (
    <Modal
      width={1000}
      minHeight={1000}
      title={"Thêm sản phẩm"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
    </Modal>
  );
};

export default AddProduct;
