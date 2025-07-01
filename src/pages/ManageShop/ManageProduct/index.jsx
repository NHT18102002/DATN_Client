import {
  Button,
  Col,
  Image,
  Input,
  notification,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getMyProduct,
} from "../../../services/shop.service.js";
import { formatCurrency } from "../../../utils/string.js";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusOutlined,
} from "@ant-design/icons";
import AddProduct from "./AddProduct/index.jsx";
// import {EditIcon} from "../../assets/Icons/EditIcon.jsx";
// import {DeleteIcon} from "../../assets/Icons/DeleteIcon.jsx";
// import DeleteModal from "../../components/Modal/DeleteModal/index.jsx";
import ProductDetail from "./ProductDetail/index.jsx";
import AddProductForm from "./AddProduct/AddProductForm/index.jsx";
import { useNavigate } from "react-router-dom";
import useCallApi from "../../../hook/useCallApi.js";
import Spinner from "../../../components/common/Spinner/index.jsx";
import ShopSidebar from "../../../components/common/ShopSidebar/index.jsx";
const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const initialFormValues = {
    name: "",
    description: "",
    price: "",
    discount: "",
    thumbnail: "",
    images: "",
    stock: "",
  };

  const { send: fetchProducts, loading } = useCallApi({
    callApi: getMyProduct,
    success: (res) => {
      setProducts(res?.data);
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Can't get products",
      });
    },
  });

  const handleEdit = (data) => {
    try {
      createProduct(data).then((res) => {
        // console.log("sfdsfzdxvcxv",data)
        if (res.status === 201) {
          notification.success({
            message: "Success",
            description: "Product created!",
          });
          setShowEditModal(false);
          fetchProducts();
        }
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: "Product not created!",
      });
    }
  };

  const handleDelete = () => {
    try {
      deleteProduct(rowData?.id).then((res) => {
        console.log(res);
        if (res.status === 200) {
          notification.success({
            message: "Success",
            description: "Product deleted!",
          });
          setShowDeleteModal(false);
          fetchProducts();
        }
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: "Product not deleted!",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const normalizedSearch = removeVietnameseTones(value);

    const filteredDataSource = products.filter((item) =>
      removeVietnameseTones(item.name).includes(normalizedSearch)
    );

    setFilteredData(filteredDataSource);
  };
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Row justify={"space-between"} style={{ margin: "0 0" }}>
            <Col
              xs={24}
              md={3}
              style={{
                borderRight: "1px solid #ccc",
                boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <ShopSidebar />
            </Col>
            <Col xs={24} md={21} style={{ marginTop: 20 }}>
              <Row style={{ marginBottom: "20px" }}>
                <Col span={12} style={{ marginLeft: 30 }}>
                  <Input
                    placeholder="Tìm theo tên sản phẩm"
                    size="large"
                    onChange={handleSearch}
                  />
                </Col>
                <Col span={10} style={{ display: "flex" }}>
                  <Button
                    style={{
                      marginLeft: "auto",
                      color: "#ffffff",
                      backgroundColor: "#0c3b70",
                    }}
                    size={"large"}
                    type="primary"
                    onClick={() => {
                      setIsEdit(false);
                      setRowData(initialFormValues);
                      setShowEditModal(true);
                    }}
                  >
                    New <PlusOutlined />
                  </Button>
                </Col>
              </Row>
              <Table
                style={{ width: "95%", marginLeft: 30 }}
                dataSource={
                  filteredData.length >= 0 && searchText !== ""
                    ? filteredData
                    : products
                }
                rowKey={(record) => record?.id}
                columns={[
                  {
                    title: "STT",
                    dataIndex: "key",
                    rowScope: "row",
                    render: (text, record, index) => (
                      <span style={{ color: "grey" }}>{index + 1}</span>
                    ),
                    width: 50,
                  },
                  {
                    title: "Tên sản phẩm",
                    dataIndex: "name",
                    key: "name",
                    width: 150,
                  },
                  {
                    title: "Ảnh đại diện",
                    dataIndex: "thumbnail",
                    key: "thumbnail",
                    width: 110,
                    render: (value) => <Image src={value} height={110} />,
                  },
                  {
                    title: "Danh mục",
                    dataIndex: ["category", "name"],
                    key: "category",
                    width: 100,
                  },
                  {
                    title: "Mô tả",
                    dataIndex: "description",
                    key: "description",
                    width: 150,
                    render: (text) => (
                      <Tooltip title={text}>
                        {text?.length > 50 ? `${text.slice(0, 50)}...` : text}
                      </Tooltip>
                    ),
                  },
                  {
                    title: "Giá",
                    dataIndex: "price",
                    key: "price",
                    width: 80,
                    render: (value) => formatCurrency(value),
                  },
                  {
                    title: "Giảm giá(%)",
                    dataIndex: "discount",
                    key: "discount",
                    width: 100,
                    // render: (value) => formatCurrency(value),
                  },
                  {
                    title: "Số lượng bán",
                    dataIndex: "sellOfQuantity",
                    key: "sellOfQuantity",
                    width: 100,
                  },
                  {
                    // title: "Action",
                    key: "operation",
                    fixed: "right",
                    align: "right",
                    width: 90,
                    render: (text, record) => (
                      <>
                        <a
                          href={`/product/${record.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ cursor: "pointer" }}
                        >
                          <EyeFilled
                            style={{
                              marginRight: 5,
                              color: "#0D6EFD",
                              fontSize: 18,
                            }}
                          />
                        </a>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedProduct(record);
                            setShowProductDetail(true);
                          }}
                        >
                          <EditFilled
                            style={{
                              marginRight: 5,
                              color: "#0D6EFD",
                              fontSize: 18,
                            }}
                          />
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setShowDeleteModal(true);
                            setRowData(record);
                          }}
                        >
                          <DeleteFilled
                            style={{ color: "red", fontSize: 18 }}
                          />
                        </span>
                      </>
                    ),
                  },
                ]}
                pagination={{
                  pageSize: 4,
                }}
                scroll={{
                  y: 600,
                }}
              />
            </Col>
          </Row>

          <ProductDetail
            open={showProductDetail}
            onClose={() => setShowProductDetail(false)}
            data={selectedProduct}
          />

          <AddProduct
            visible={showEditModal}
            // handleSubmit={handleEdit}
            handleCancel={() => {
              setShowEditModal(false);
            }}
          />
          {/* <DeleteModal
            show={showDeleteModal}
            title={"Delete product"}
            content={"Are you sure you want to delete this product?"}
            handleDelete={handleDelete}
            handleCancel={() => {
              setShowDeleteModal(false)
            }}
          />  */}
        </>
      )}
    </div>
  );
};

export default ManageProduct;
