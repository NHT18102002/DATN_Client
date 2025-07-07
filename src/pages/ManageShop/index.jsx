import {
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Upload,
  Image,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import AntButton from "../../components/common/Button/index.jsx";
import {
  createProduct,
  deleteProduct,
  getMyProduct,
  updateShop,
} from "../../services/shop.service.js";
import { formatCurrency } from "../../utils/string.js";
import { formatTimeAgo } from "../../utils/string.js";
import {
  ClockCircleFilled,
  ClockCircleOutlined,
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  MessageOutlined,
  PlusOutlined,
  RightOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
// import {EditIcon} from "../../assets/Icons/EditIcon.jsx";
// import {DeleteIcon} from "../../assets/Icons/DeleteIcon.jsx";
// import DeleteModal from "../../components/Modal/DeleteModal/index.jsx";
import { getShopByOwnerId } from "../../services/shop.service.js";
import AddProductForm from "./ManageProduct/AddProduct/AddProductForm/index.jsx";
import { useNavigate } from "react-router-dom";
import useCallApi from "../../hook/useCallApi.js";
import Spinner from "../../components/common/Spinner/index.jsx";
import ShopSidebar from "../../components/common/ShopSidebar/index.jsx";
import { useForm } from "antd/es/form/Form.js";
import Uploader from "../../components/common/Uploader/index.jsx";
const ManageShop = () => {
  const [shop, setShop] = useState();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bannerFileList, setBannerFileList] = useState([]);
  const [bannersFileList, setBannersFileList] = useState([]);
  const [logoFileList, setLogoFileList] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const uploadInstance = axios.create(); // ✅ thêm dòng này
  const handleBannerUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pjxg2rxo");
    try {
      uploadInstance
        .post(
          "https://api.cloudinary.com/v1_1/ddpcz77k4/image/upload",
          formData,
          {
            onUploadProgress: onProgress,
          }
        )
        .then((res) => {
          console.log({ res });
          if (res) {
            const data = res?.data?.url;
            file.response = { url: data }; // ✅ bổ sung dòng này
            onSuccess(file);
            message.success(`${file.name} tải file thành công.`);

            const currentBanners = form.getFieldValue("banners") || [];
            form.setFieldValue("banner", data);
            setBannerFileList([
              {
                uid: new Date().getTime().toString(),
                name: file.name,
                status: "done",
                url: data,
              },
            ]);
          } else {
            onError(`${file.name} file upload failed.`);
          }
        });
    } catch (e) {
      message.error(`${file.name} tải file thành công.`);
    }
  };

  const handleUploadBanners = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pjxg2rxo");

    try {
      const res = await uploadInstance.post(
        "https://api.cloudinary.com/v1_1/ddpcz77k4/image/upload",
        formData,
        { onUploadProgress: onProgress }
      );

      const uploadedUrl = res?.data?.url;
      if (!uploadedUrl)
        throw new Error("Không lấy được URL ảnh từ Cloudinary.");

      // Gán response để Ant Design Upload đọc và hiển thị
      file.response = { url: uploadedUrl };
      onSuccess(file);

      message.success(`${file.name} tải file thành công.`);

      // Cập nhật trường form "banners"
      const current = form.getFieldValue("banners") || [];
      form.setFieldValue("banners", [...current, uploadedUrl]);
    } catch (error) {
      console.error("Upload banner error:", error);
      message.error(`${file.name} tải file không thành công.`);
      onError(error);
    }
  };

  const handleLogoUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pjxg2rxo");
    try {
      uploadInstance
        .post(
          "https://api.cloudinary.com/v1_1/ddpcz77k4/image/upload",
          formData,
          {
            onUploadProgress: onProgress,
          }
        )
        .then((res) => {
          // console.log({ res });
          if (res) {
            onSuccess(file);
            const data = res?.data?.url;
            // console.log({ data });
            form.setFieldValue("logo", data);

            setLogoFileList([
              {
                uid: new Date().getTime().toString(),
                name: file.name,
                status: "done",
                url: data,
              },
            ]);
            setFileList([
              { uid: "-1", name: "image.png", status: "done", url: data },
            ]);
          } else {
            onError(`${file.name} file upload failed.`);
          }
        });
    } catch (e) {
      message.error(`${file.name} tải file thành công.`);
    }
  };

  const { send: fetchShop, loading } = useCallApi({
    callApi: getShopByOwnerId,
    success: (res) => {
      setShop(res?.data);
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Xảy ra lỗi",
      });
    },
  });

  const handleUpdateShop = ({ id, ...values }) => {
    // console.log(values);

    try {
      updateShop(id, values).then((res) => {
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Update successfully!",
          });
          fetchShop();
        } else {
          notification.error({
            message: "Error",
            description: "Can't update user information",
          });
        }
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: "Can't update user information",
      });
    }
  };

  const handleDelete = () => {
    try {
      deleteProduct(rowData?.id).then((res) => {
        // console.log(res);
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
    fetchShop();
  }, []);
  const averageRate = shop?.products?.length
    ? shop.products.reduce((sum, p) => sum + (p.rate || 0), 0) /
      shop.products.length
    : 0;
  useEffect(() => {
    if (shop) {
      form.setFieldsValue(shop); // để gán các trường khác nếu cần

      // Gán bannerFileList từ shop.banner
      if (shop.banner) {
        setBannerFileList([
          {
            uid: "-1",
            name: "banner.png",
            status: "done",
            url: shop.banner,
          },
        ]);
      }

      // Gán logoFileList từ shop.logo
      if (shop.logo) {
        setLogoFileList([
          {
            uid: "-2",
            name: "logo.png",
            status: "done",
            url: shop.logo,
          },
        ]);
      }

      if (shop?.banners?.length > 0) {
        setBannersFileList(
          shop.banners.map((url) => ({
            uid: url,
            name: url.split("/").pop(), // chỉ tên file cuối
            status: "done",
            url: url,
          }))
        );
      }
    }
  }, [shop]);

  const handleBannerChange = ({ fileList: newFileList }) =>
    setBannerFileList(newFileList);
  const handleLogoChange = ({ fileList: newFileList }) =>
    setLogoFileList(newFileList);
  return (
    <div style={{ marginBottom: 50 }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Row gutter={30} style={{ margin: "0 0" }}>
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
            <Col
              xs={24}
              md={21}
              style={{
                marginTop: 15,
                // paddingBottom: 20,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Col
                xs={24}
                md={17}
                style={{
                  backgroundColor: "#f5f5f5",
                  boxShadow: "2px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ margin: "15px 0px 0px 10px" }}>
                  <h2
                    style={{ textAlign: "start", margin: "15px 0px 0px 0px" }}
                  >
                    Hồ Sơ Shop
                  </h2>
                  <div style={{ textAlign: "start", color: "#222" }}>
                    Xem tình trạng Shop và cập nhật hồ sơ Shop của bạn
                  </div>
                </div>
                <Form
                  style={{ paddingBottom: 40 }}
                  layout={"vertical"}
                  form={form}
                  initialValues={{
                    ...shop,
                  }}
                  onFinish={(values) =>
                    handleUpdateShop({ ...values, id: shop?.id })
                  }
                >
                  <Row style={{ paddingTop: 20 }}>
                    <Col xs={24} md={9}>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          cursor: "pointer",
                        }}
                      >
                        {/* Banner Form.Item */}
                        <Form.Item
                          name="banner"
                          valuePropName="bannerFileList"
                          style={{ marginBottom: 0 }}
                          width="100%"
                          // getValueFromEvent={normFile}
                        >
                          <Upload
                            listType="picture"
                            customRequest={handleBannerUpload}
                            onChange={handleBannerChange}
                            fileList={bannerFileList}
                            showUploadList={false}
                          >
                            {bannerFileList[0]?.url ? (
                              <Image
                                preview={false}
                                src={bannerFileList[0].url}
                                alt="banner"
                                style={{
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Image
                                preview={false}
                                src="https://www.shutterstock.com/image-photo/modern-grey-limestone-texture-background-260nw-2628427379.jpg"
                                alt="banner"
                                style={{
                                  width: "100%",
                                  objectFit: "cover",
                                  opacity: 0.5,
                                }}
                              />
                            )}
                          </Upload>
                        </Form.Item>

                        {/* Logo Form.Item đè lên */}

                        <Form.Item
                          name="logo"
                          valuePropName="logoFileList"
                          // getValueFromEvent={normFile}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "70px",
                            transform: "translate(-50%, -50%)",
                            margin: 0,
                            // display: "flex",
                            // flexDirection:"row"
                          }}
                        >
                          <Upload
                            customRequest={handleLogoUpload}
                            onChange={handleLogoChange}
                            fileList={logoFileList}
                            showUploadList={false}
                          >
                            {logoFileList[0]?.url ? (
                              <Image
                                preview={false}
                                src={logoFileList[0].url}
                                alt="logo"
                                style={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: "50%",
                                  border: "2px solid white",
                                  objectFit: "cover",
                                  background: "#fff",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: "50%",
                                  border: "2px dashed #d9d9d9",
                                  background: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 16,
                                  color: "#999",
                                }}
                              >
                                +
                              </div>
                            )}
                          </Upload>
                          <div
                            style={{
                              color: "#fff",
                              fontSize: 12,
                              textAlign: "start",
                              textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
                              // display:"flex"
                            }}
                          >
                            <div>{shop?.name}</div>
                            <div>
                              Đã tham gia{" "}
                              {shop?.createdAt &&
                                new Date(shop.createdAt).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                            </div>
                          </div>
                        </Form.Item>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          alignItems: "center",
                          borderLeft: "2px solid #ccc",
                          padding: "0px 15px",
                          // marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 10,
                            height: 30,
                            borderBottom: "2px solid #ccc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <EyeOutlined
                              style={{
                                fontSize: 14,
                              }}
                            />
                            <span>Giao diện Shop trên máy tính</span>
                          </div>
                          <a
                            href={`/shop/${shop?.id}`} // 👈 Phải có đường dẫn
                            target="_blank" // 👈 Mở trong tab mới
                            rel="noopener noreferrer" // 👈 An toàn
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 5,
                              fontWeight: 600,
                              color: "#0d6edf",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <span>Xem</span>
                            <RightOutlined style={{}} />
                          </a>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            alignItems: "center",
                            height: 30,
                            borderBottom: "2px solid #ccc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              gap: 5,
                            }}
                          >
                            <ShoppingOutlined
                              style={{
                                fontSize: 14,
                              }}
                            />
                            <span>Sản phẩm</span>
                          </div>

                          <a
                            href={`/shop/${shop?.id}`} // 👈 Phải có đường dẫn
                            target="_blank" // 👈 Mở trong tab mới
                            rel="noopener noreferrer" // 👈 An toàn
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 5,
                              fontWeight: 600,
                              color: "#0d6edf",
                              cursor: "pointer",
                            }}
                          >
                            <span>{shop?.products.length}</span>

                            <RightOutlined style={{}} />
                          </a>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            alignItems: "center",
                            height: 30,
                            borderBottom: "2px solid #ccc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              gap: 5,
                            }}
                          >
                            <MessageOutlined
                              style={{
                                fontSize: 14,
                              }}
                            />
                            <span>Tỉ lệ phản hồi</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 5,
                              fontWeight: 600,
                              color: "#0d6edf",
                              cursor: "pointer",
                            }}
                          >
                            <span>100%</span>
                            {/* <RightOutlined style={{}} /> */}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            alignItems: "center",
                            height: 30,

                            borderBottom: "2px solid #ccc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              gap: 5,
                            }}
                          >
                            <ClockCircleOutlined
                              style={{
                                fontSize: 14,
                              }}
                            />
                            <span>Thời gian phản hồi</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 5,
                              fontWeight: 600,
                              color: "#0d6edf",
                              cursor: "pointer",
                            }}
                          >
                            <span>Trong vòng vài tiếng</span>
                            {/* <RightOutlined style={{}} /> */}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,

                            alignItems: "center",
                            height: 30,
                            borderBottom: "2px solid #ccc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              gap: 5,
                            }}
                          >
                            <EyeOutlined />
                            <span>Đánh giá shop</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 5,
                              fontWeight: 600,
                              color: "#0d6edf",
                              cursor: "pointer",
                            }}
                          >
                            <span>{averageRate.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={15} style={{ paddingLeft: 15 }}>
                      <Form.Item
                        label={"Tên shop"}
                        title={"name"}
                        name={"name"}
                        rules={[
                          {
                            required: true,
                            message: "Please input your shop!",
                          },
                        ]}
                      >
                        <Input
                          placeholder={shop?.name}
                          // className={"account-section-input"}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                          { required: true, message: "Vui lòng nhập mô tả!" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      {shop?.banners?.length === 0 ? (
                        <Form.Item
                          label="Hình ảnh mô tả shop"
                          name="banners"
                          rules={
                            [
                              // {
                              //   required: true,
                              //   message: "Vui lòng chọn ít nhất một hình ảnh sản phẩm!",
                              // },
                            ]
                          }
                        >
                          <Uploader
                            multiple
                            setFormValue={(newUrls) => {
                              const current =
                                form.getFieldValue("banners") || [];
                              form.setFieldValue("banners", [
                                ...current,
                                newUrls,
                              ]);
                            }}
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item label="Hình ảnh mô tả shop" name="banners">
                          <Upload
                            customRequest={handleUploadBanners}
                            listType="picture-card"
                            fileList={bannersFileList}
                            onChange={({ fileList }) => {
                              // Lấy các URL từ fileList khi ảnh đã upload xong
                              const urls = fileList
                                .filter(
                                  (file) =>
                                    file.status === "done" &&
                                    (file.url || file.response?.url)
                                )
                                .map((file) => file.url || file.response?.url);

                              // Cập nhật lại form
                              form.setFieldValue("banners", urls);

                              // Cập nhật lại fileList hiển thị
                              setBannersFileList(
                                fileList.map((file) => ({
                                  ...file,
                                  url: file.url || file.response?.url,
                                }))
                              );
                            }}
                          >
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          </Upload>
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                  <AntButton
                    text={"Save"}
                    style={{ height: 30 }}
                    type={"primary"}
                    htmlType={"submit"}
                  />
                </Form>
              </Col>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ManageShop;
