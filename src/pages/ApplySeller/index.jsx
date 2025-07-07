import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Upload,
  notification,
  Steps,
} from "antd";
import {
  ShoppingCartOutlined,
  SmileOutlined,
  SolutionOutlined,
  WalletOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AntImage from "../../components/common/AntImage/index.jsx";
import AntButton from "../../components/common/Button/index.jsx";
import Done from "../../components/pages/Cart/Done/index.jsx";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import Spinner from "../../components/common/Spinner/index.jsx";
import { createShop } from "../../services/shop.service.js";
import AddressFormModal from "../../components/pages/Address/AddressFormModal/index.jsx";
import { addAddress } from "../../services/address.service.js";
import { updateUserInfo } from "../../services/user.service.js";
const ApplySeller = () => {
  const params = useParams();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  const { userId, username, email, avatar, vendor } = useSelector(
    (state) => state.userInfo // tùy reducer bạn gộp tên là gì
  );
  const [form] = Form.useForm();
  const stepItems = [
    {
      title: "Thông tin shop",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Địa Chỉ",
      icon: <SolutionOutlined />,
    },
    {
      title: "Hoàn tất",
      icon: <SmileOutlined />,
    },
  ];

  const [fileList, setFileList] = useState([]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    try {
      uploadInstance
        .post(
          "https://api.cloudinary.com/v1_1/dzazt6bib/image/upload",
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

  const handleCreateShop = (values) => {
    try {
      createShop(values).then((res) => {
        if (res?.status === 201) {
          updateUserInfo({ vendor: "2" }).then((res) => {
            if (res?.status === 200) {
              notification.success({
                message: "Success",
                description: "Update successfully!",
              });
              // fetchUserInfo();
            } else {
              notification.error({
                message: "Error",
                description: "Can't update user information",
              });
            }
          });

          notification.success({
            message: "Success",
            description: "Create successfully!",
          });
          // fetchUserInfo();
          setStep(1);
        } else {
          notification.error({
            message: "Error",
            description: "Tên shop đã tồn tại",
          });
        }
      });
    } catch (err) {
      // console.log(err);
      notification.error({
        message: "Error",
        description: "Không thể tạo cửa hàng",
      });
    }
  };

  const handleUpdateInfo = () => {
    // console.log({ values });
    const sendData = { vendor: "2" };
    try {
      updateUserInfo(sendData).then((res) => {
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Update successfully!",
          });
          // fetchUserInfo();
        } else {
          notification.error({
            message: "Error",
            description: "Can't update user information",
          });
        }
      });
    } catch (err) {
      // console.log(err);
      notification.error({
        message: "Error",
        description: "Can't update user information",
      });
    }
  };

  const handleSubmitAddress = (values) => {
    try {
      addAddress(values).then((res) => {
        if (res.status === 201) {
          setVisible(false);
          notification.success({
            header: "Success",
            message: "Thêm địa chỉ thành công!",
          });
          setStep(2);
        } else {
          notification.error({
            header: "Error",
            message: "Thêm địa chỉ Không thành công!",
          });
        }
      });
    } catch (e) {
      // console.log(e)
      notification.error({
        header: "Error",
        message: "Thêm địa chỉ Không thành công!",
      });
    }
  };

  return (
    <Row>
      <Col xs={24} md={24}>
        <Steps
          current={step}
          items={stepItems}
          style={{ marginBottom: "2rem" }}
        />
        {step === 0 && (
          <Form form={form} layout={"vertical"} onFinish={handleCreateShop}>
            <Form.Item name={"logo"}>
              <Upload
                listType={"picture-circle"}
                customRequest={handleUpload}
                fileList={fileList}
                onChange={handleChange}
              >
                {!fileList[0]?.url && (
                  <div>
                    <UserOutlined style={{ fontSize: 32 }} />
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label={"Tên Shop"}
              title={"ShopName"}
              name={"name"}
              rules={[
                { required: true, message: "Vui lòng nhập tên cửa hàng!" },
              ]}
            >
              <Input placeholder="Shop" className={"account-section-input"} />
            </Form.Item>

            <Form.Item
              label={"Mô tả"}
              title={"description"}
              name={"description"}
              // rules={[{ required: false, message: "Vui lòng nhập tên cửa hàng!" }]}
            >
              <Input
                placeholder="Mô tả về shop"
                className={"account-section-input"}
              />
            </Form.Item>

            <Form.Item
              label={"Email"}
              name={"email"}
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Vui lòng nhập email!" },
              ]}
            >
              <Input placeholder="Email" className={"account-section-input"} />
            </Form.Item>
            <Form.Item
              label={"Số điện thoại"}
              name={"phone"}
              rules={[
                { required: true, message: "Vui lòng nhập tên cửa hàng!" },
                {
                  pattern: /^0[0-9]{9}$/,
                  message: "Số điện thoại không đúng!",
                },
              ]}
            >
              <Input
                placeholder="Số điện thoại"
                className={"account-section-input"}
              />
            </Form.Item>
            <AntButton
              text={"Tiếp theo"}
              style={{ width: 200 }}
              type={"primary"}
              htmlType={"submit"}
            />
          </Form>
        )}
        {step === 1 && (
          <Row>
            <AntButton
              text="Thêm địa chỉ"
              type="primary"
              style={{ marginBottom: "2rem" }}
              onClick={() => setVisible(true)}
            />
            <AddressFormModal
              visible={visible}
              handleCancel={() => setVisible(false)}
              handleOk={handleSubmitAddress}
            />
          </Row>
        )}
        {step == 2 && (
          <Row>
            <Col span={24}>
              <AntImage
                src={
                  "https://media.istockphoto.com/id/1397892955/photo/thank-you-message-for-card-presentation-business-expressing-gratitude-acknowledgment-and.jpg?s=612x612&w=0&k=20&c=7Lyf2sRAJnX_uiDy3ZEytmirul8pyJWm4l2fxiUtdvk="
                }
                width={612}
                height={344}
              />
              <p style={{ fontSize: 32 }}>
                Bạn đã đăng ký thành công! hãy chờ quản trị duyên xét duyệt nhé
              </p>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default ApplySeller;
