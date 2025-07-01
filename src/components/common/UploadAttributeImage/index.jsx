import { Upload, Button, message, Image } from "antd";
import { UploadOutlined, FileImageFilled } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";

const UploadAttributeImage = ({
  multiple = false,
  setFormValue,
  defaultImage,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    if (defaultImage) {
      setPreviewImage(defaultImage);
    }
  }, [defaultImage]);
  const uploadInstance = axios.create();

  const handleUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pjxg2rxo");

    uploadInstance
      .post(
        "https://api.cloudinary.com/v1_1/ddpcz77k4/image/upload",
        formData,
        { onUploadProgress: onProgress }
      )
      .then((res) => {
        if (res?.data?.url) {
          const imageUrl = res.data.url;
          onSuccess(file);
          setFormValue(imageUrl);
          setPreviewImage(imageUrl); // hiển thị ảnh
          console.log("setFormValue", setFormValue);
          message.success(`${file.name} đã được tải lên.`);
        } else {
          onError(new Error("Tải lên thất bại"));
          message.error(`${file.name} tải lên thất bại.`);
        }
      })
      .catch(() => {
        onError(new Error("Tải lên thất bại"));
        message.error(`${file.name} tải lên thất bại.`);
      });
  };

  return (
    <Upload
      name="file"
      multiple={multiple}
      showUploadList={false}
      customRequest={handleUpload}
      accept="image/*"
    >
      {previewImage ? (
        <Image
          key={previewImage}
          src={previewImage}
          alt="Ảnh upload"
          style={{ width: 25, height: 25, objectFit: "cover" }}
          preview={false}
        />
      ) : (
        <Button
          icon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <FileImageFilled style={{ fontSize: 13, color: "#0d6efd" }} />
            </div>
          }
          style={{ width: 25, height: 25, borderRadius: 0, padding: 0 }}
        />
      )}
    </Upload>
  );
};

export default UploadAttributeImage;
