import {Form, Input, Modal} from "antd";
import {useEffect} from "react";

const EditOrderForm = ({ data, handleSubmit, visible, handleCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(data)
  }, [data, form])

  return (
    <Modal
      title={"Edit order"}
      open={visible}
      onCancel={handleCancel}
      onOk={() => {
        form.validateFields().then(values => {
          handleSubmit(values)
        })
      }}
    >
      <Form
        layout={"vertical"}
        form={form}
        initialValues={data}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="Avatar"
          name="thumbnail"
          rules={[{required: true, message: 'Please input your thumbnail!'}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="Phone"
          name="description"
          rules={[{required: true, message: 'Please input your phone number!'}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="Address"
          name="price"
          rules={[{required: true, message: 'Please input your address!'}]}
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditOrderForm