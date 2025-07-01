import {Modal} from "antd";

const DeleteModal = ({ show, handleCancel, handleDelete, title, content, ...rest }) => {
  return (
    <Modal
      title={title}
      open={show}
      onOk={handleDelete}
      onCancel={handleCancel}
      {...rest}
    >
      <p>{content}</p>
    </Modal>
  )
}

export default DeleteModal;