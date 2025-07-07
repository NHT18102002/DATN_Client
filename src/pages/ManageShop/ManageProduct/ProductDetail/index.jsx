import { Modal, Tabs } from "antd";
import BasicInformation from "./BasicInformation/index.jsx";
import ProductAttribute from "./ProductAttribute/index.jsx";
import useCallApi from "../../../../hook/useCallApi.js";
import { getAttributeProduct } from "../../../../services/shop.service.js";
import { getProductDetail } from "../../../../services/shop.service.js";
import AddDetailProduct from "../AddProduct/AdddetailProduct/index.jsx";
import Media from "./Media/index.jsx";
import { useState, useEffect } from "react";
const ProductDetail = ({ open, onClose, data }) => {
  const [productDetail, setProductDetail] = useState();
  const [attributeProduct, setAttributeProduct] = useState([]);

  const { send: fetchProductDetail } = useCallApi({
    callApi: getProductDetail,
    success: (res) => {
      setProductDetail(res?.data);
      // console.log("hehehehhe");
    },
    error: () => {
      message.error("Can't get product default attributes");
    },
  });

  const { send: fetchProductAttribute } = useCallApi({
    callApi: getAttributeProduct,
    success: (res) => {
      setAttributeProduct(res?.data?.items);
      // console.log("hehehehhe");
    },
    error: () => {
      message.error("Can't get product default attributes");
    },
  });

  useEffect(() => {
    if (data?.productDetail?.id) {
      fetchProductDetail(data?.productDetail?.id);
      fetchProductAttribute(data?.productDetail?.id);
    }
  }, [data]);
  const items = [
    {
      key: "1",
      label: `Thông tin cơ bản`,
      children: <BasicInformation data={data} />,
    },

    {
      key: "2",
      label: `Thông tin chi tiết`,
      children:
        attributeProduct.length > 0 ? (
          <ProductAttribute
            productDetail={productDetail}
            attributeProduct={attributeProduct}
          />
        ) : (
          <AddDetailProduct
            productDetailId={data?.productDetail?.id}
            handleCancel={onClose}
          />
        ),  
    },

    {
      key: "3",
      label: `Hình ảnh`,
      children: (
        <Media
          productDetail={productDetail}
          // attributeProduct={attributeProduct}
        />
      ),
    },
    // {
    //   key: "3",
    //   label: `Other Attributes`,
    //   children: <ProductOtherAttribute productId={Number(data.id)} />,
    // },
    // {
    //   key: "4",
    //   label: `Media`,
    //   children: <Media productId={Number(data.id)} />,
    // },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      footer={null} // nếu không cần footer
      width={900}
      title="Chi tiết sản phẩm"
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default ProductDetail;
