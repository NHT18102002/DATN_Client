import Dragger from "antd/es/upload/Dragger.js";
import { InboxOutlined } from "@ant-design/icons";
import { notification, message } from "antd";
import axios from "axios";

const Uploader = ({ multiple = false, setFormValue }) => {
  const uploadInstance = axios.create();
  const handleUpload = (options) => {
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
            onSuccess(file);
            const data = res?.data?.url;
            setFormValue(data);
            console.log(data);
          } else {
            onError(`${file.name} file upload failed.`);
          }
        });
    } catch (e) {
      message.error(`${file.name} tải file thành công.`);
    }
  };

  return (
    <Dragger
      name="file"
      multiple={multiple}
      customRequest={handleUpload}
      onChange={(info) => {
        const { status } = info.file;
        console.log({ info });
        if (status === "done") {
          console.log("done");
          message.success(`${info.file.name} tải file thành công.`);
        } else if (status === "error") {
          console.log("error");
          message.error(`${info.file.name} tải file thành công.`);
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click để upload ảnh </p>
      <p className="ant-upload-hint">
        Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công
        ty hoặc các tệp bị cấm khác.
      </p>
    </Dragger>
  );
};

export default Uploader;
