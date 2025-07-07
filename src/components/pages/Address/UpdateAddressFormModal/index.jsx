import { Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { DISTRICTS, PROVINCES, WARDS } from "../Data/address.js";

const UpdateAddressFormModal = ({
  data,
  visible,
  handleCancel,
  handleOk,
  isEdit,
}) => {
  const [form] = Form.useForm();
  const [provinceId, setProvinceId] = useState();
  const [districtId, setDistrictId] = useState();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(data);
    // console.log("dâta", data);
  }, [data, form]);

  return (
    <Modal
      title={isEdit ? "Sửa địa chỉ" : "Thêm địa chỉ"}
      open={visible}
      onCancel={handleCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          handleOk({
            ...values,
            country: "Vietnam",
          });
          // form.resetFields();
        });
      }}
    >
      <Form form={form} layout={"vertical"}>
        {() => (
          <>
            <Form.Item
              label={"Họ và tên"}
              name={"fullname"}
              rules={[
                { required: true, message: "Nhập họ và tên!" },
              ]}
            >
              <Input
                placeholder="Họ và tên"
                className={"account-section-input"}
              />
            </Form.Item>
            <Form.Item
              label={"Số điện thoại"}
              name={"phone"}
              rules={[
                { required: true, message: "Nhập số điện thoại!" },
                {
                  pattern: /^0[0-9]{9}$/,
                  message: "Số điện thoạn không hợp lệ!",
                },
              ]}
            >
              <Input
                placeholder="Số điện thoại"
                className={"account-section-input"}
              />
            </Form.Item>
            <Form.Item
              label={"Tỉnh/thành phố"}
              name={"provice"}
              rules={[
                { required: true, message: "vui lòng nhập Tỉnh/thành phố!" },
              ]}
            >
              <Select
                placeholder="Tỉnh/thành phố"
                onSelect={(value, option) => {
                  // console.log(option);
                  if (option?.key !== provinceId) {
                    setProvinceId(option?.key);
                    setDistrictId(null); // Reset districtId để ẩn ward
                    form.setFieldsValue({
                      district: null,
                      commune: null,
                    });
                  }
                }}
              >
                {PROVINCES.map((province) => {
                  return (
                    <Select.Option key={province.code} value={province?.name}>
                      {province?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {provinceId && (
              <Form.Item
                label={"Quận/huyện"}
                name={"district"}
                rules={[
                  { required: true, message: "vui lòng nhập Quận/huyện!" },
                ]}
              >
                <Select
                  placeholder="Quận/huyện"
                  onChange={(value, option) => {
                    setDistrictId(option?.key);
                  }}
                >
                  {DISTRICTS.filter(
                    (district) => district.province_code === Number(provinceId)
                  ).map((district) => (
                    <Select.Option key={district.code} value={district.name}>
                      {district.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {provinceId && districtId && (
              <Form.Item
                label={"Phường/xã"}
                name={"commune"}
                rules={[
                  { required: true, message: "vui lòng nhập Phường/xã!" },
                ]}
              >
                <Select placeholder="Phường/xã">
                  {WARDS.filter(
                    (ward) => ward.district_code === Number(districtId)
                  ).map((ward) => (
                    <Select.Option key={ward.code} value={ward.name}>
                      {ward.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {provinceId && districtId && (
              <Form.Item
                label={"Địa chỉ cụ thể"}
                name={"detail"}
                rules={[
                  { required: true, message: "Nhập địa chỉ cụ thể!" },
                ]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateAddressFormModal;
