import {
  Button,
  Col,
  Image,
  Input,
  notification,
  Row,
  Select,
  Table,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getMyProduct,
  updateProductStatus,
} from "../../../services/shop.service.js";
import { formatCurrency } from "../../../utils/string.js";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusOutlined,
} from "@ant-design/icons";
import AddProduct from "./AddProduct/index.jsx";
import ProductDetail from "./ProductDetail/index.jsx";
import Spinner from "../../../components/common/Spinner/index.jsx";
import ShopSidebar from "../../../components/common/ShopSidebar/index.jsx";
import useCallApi from "../../../hook/useCallApi.js";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

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
    success: (res) => setProducts(res?.data || []),
    error: () =>
      notification.error({
        message: "Lỗi",
        description: "Không thể tải sản phẩm",
      }),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeVietnameseTones = (str) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const getFilteredProducts = () => {
    const normalizedSearch = removeVietnameseTones(searchText);
    return products.filter((item) => {
      const matchSearch =
        !searchText ||
        removeVietnameseTones(item.name).includes(normalizedSearch);
      const matchStatus = !statusFilter || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  };

  const handleChangeStatus = async (productId, newStatus) => {
    try {
      await updateProductStatus(productId, { status: newStatus });
      message.success("Cập nhật trạng thái thành công");
      fetchProducts();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const statusOptions = [
    { label: "Tất cả", value: null },
    { label: "Đang bán", value: "active" },
    { label: "ngưng bán", value: "disabled" },
    { label: "Chưa bán", value: "pending" },
  ];

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Row justify="space-between">
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
              <Row style={{ marginBottom: 20 }}>
                <Col
                  xs={24}
                  md={16}
                  style={{
                    marginLeft: 30,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    style={{ height: 40 }}
                    placeholder="Tìm theo tên sản phẩm"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Select
                    placeholder="Lọc theo trạng thái"
                    size="large"
                    style={{ width: 180, marginLeft: 30 }}
                    value={statusFilter}
                    options={statusOptions}
                    onChange={setStatusFilter}
                    allowClear
                  />
                </Col>
                <Col span={7} style={{ display: "flex" }}>
                  <Button
                    style={{
                      marginLeft: "auto",
                      color: "#fff",
                      backgroundColor: "#0c3b70",
                    }}
                    size="large"
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
                style={{ width: "97%", marginLeft: 30 }}
                rowKey={(record) => record?.id}
                dataSource={getFilteredProducts()}
                pagination={{ pageSize: 4 }}
                scroll={{ y: 600 }}
                columns={[
                  {
                    title: "STT",
                    render: (text, record, index) => (
                      <span style={{ color: "grey" }}>{index + 1}</span>
                    ),
                    width: 50,
                  },
                  {
                    title: "Tên sản phẩm",
                    dataIndex: "name",
                    width: 150,
                  },
                  {
                    title: "Ảnh đại diện",
                    dataIndex: "thumbnail",
                    width: 110,
                    render: (value) => <Image src={value} height={110} />,
                  },
                  {
                    title: "Danh mục",
                    dataIndex: ["category", "name"],
                    width: 100,
                  },
                  {
                    title: "Mô tả",
                    dataIndex: "description",
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
                    width: 90,
                    render: (value) => formatCurrency(value),
                  },
                  {
                    title: "Giảm giá(%)",
                    dataIndex: "discount",
                    width: 100,
                  },
                  {
                    title: "Số lượng bán",
                    dataIndex: "sellOfQuantity",
                    width: 100,
                  },
                  {
                    title: "Hoạt động",
                    key: "action",
                    width: 120,
                    fixed: "right",
                    render: (_, record) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          <a
                            href={`/product/${record.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0D6EFD" }}
                          >
                            <EyeFilled style={{ fontSize: 18 }} />
                          </a>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedProduct(record);
                              setShowProductDetail(true);
                            }}
                          >
                            <EditFilled
                              style={{ fontSize: 18, color: "#0D6EFD" }}
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
                              style={{ fontSize: 18, color: "red" }}
                            />
                          </span>
                        </div>
                        <Select
                          value={record.status}
                          style={{ width: 106, fontSize: 10 }}
                          options={[
                            {
                              label: (
                                <span
                                  style={{
                                    color: "green",
                                    border: "1px solid green",
                                    borderRadius: 4,
                                    padding: "1px 6px",
                                    fontSize: 10,
                                  }}
                                >
                                  Đang bán
                                </span>
                              ),
                              value: "active",
                            },
                            {
                              label: (
                                <span
                                  style={{
                                    color: "red",
                                    border: "1px solid red",
                                    borderRadius: 4,
                                    padding: "1px 6px",
                                    fontSize: 10,
                                  }}
                                >
                                  Ngừng bán
                                </span>
                              ),
                              value: "disabled",
                            },
                          ]}
                          onChange={(newStatus) =>
                            handleChangeStatus(record.id, newStatus)
                          }
                        />
                      </div>
                    ),
                  },
                ]}
              />

              <ProductDetail
                open={showProductDetail}
                onClose={() => setShowProductDetail(false)}
                data={selectedProduct}
              />

              <AddProduct
                visible={showEditModal}
                handleCancel={() => {
                  setShowEditModal(false), fetchProducts();
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ManageProduct;
