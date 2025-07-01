import { Card, notification } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import AntButton from "../../../common/Button";
import { useState } from "react";
import UpdateAddressFormModal from "../UpdateAddressFormModal";
import {
  updateAddress,
  deleteAddress,
} from "../../../../services/address.service";
import { DeleteFilled } from "@ant-design/icons";
import DeleteModal from "../DeleteModal";

const AddressSelectCard = ({ address, onClick, selected, fetchAddress }) => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmitAddress = (data) => {
    try {
      updateAddress(address?.id, {
        ...data,
        username: data?.email,
      }).then((res) => {
        if (res.status === 200) {
          setVisible(false);
          notification.success({
            header: "Success",
            message: "Thành công!",
          });
          fetchAddress();
        } else {
          notification.error({
            header: "Error",
            message: "Không thành công!",
          });
        }
      });
    } catch (e) {
      // console.log(e)
      notification.error({
        header: "Error",
        message: "Không thành công!",
      });
    }
  };

  const handleDelete = () => {
    try {
      deleteAddress(address?.id).then((res) => {
        // console.log({ res });
        if (res?.status === 200) {
          notification.success({
            message: "Success",
            description: "Deleted successfully",
          });
          setShowDeleteModal(false);
          fetchAddress();
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
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <AntButton
              text="Chỉnh sửa"
              theme="light"
              style={{ fontSize: 12, padding: 5, height: 30, color: "#0d6efd" }}
              onClick={() => (setVisible(true), setIsEdit(true))}
              // onClick={handleSetAddressDefault}
              // disabled={addressSelected?.isDefault}
            />
            {
              <DeleteFilled
                className="icon-delete-btn"
                style={{ color: "red", fontSize: 20 }}
                onClick={() => {setShowDeleteModal(true)}}
              />
            }
          </div>
        }
        style={{
          width: "100%",
          textAlign: "left",
          border:
            address?.id === selected?.id
              ? "1px solid #0d6efd"
              : "1px solid #d9d9d9",
        }}
        onClick={onClick}
      >
        <div>
          <span style={{ fontWeight: 600 }}>{address?.fullname}</span> |
          <span style={{ color: "#0d6efd", marginLeft: 2 }}>
            {address?.phone}
          </span>
        </div>
        <div style={{ marginBottom: 0 }}>
          <HomeOutlined
            style={{ color: "#0d6efd", marginRight: 5, fontSize: 16 }}
          />
          {address?.detail}
        </div>
        <div style={{ marginTop: 0 }}>
          {address?.commune}, {address?.district}, {address?.provice}{" "}
          {/* {address?.country} */}
        </div>
        {address?.isDefault && (
          <div style={{ color: "#0d6efd", paddingBottom: 0, marginBottom: 0 }}>
            Mặc định
          </div>
        )}
      </Card>

      <DeleteModal
        show={showDeleteModal}
        title={""}
        content={"Bạn có chắc muốn xoá địa chỉ này?"}
        handleDelete={handleDelete}
        handleCancel={() => {
          setShowDeleteModal(false);
        }}
      />

      <UpdateAddressFormModal
        isEdit={isEdit}
        data={address}
        visible={visible}
        handleCancel={() => setVisible(false)}
        handleOk={handleSubmitAddress}
      />
    </>
  );
};

export default AddressSelectCard;
