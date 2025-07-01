import { useEffect, useState } from "react";
// import {getProductMedia, updateProductDetails} from "../../../../../services/product.service.js";
import { updateProductDetail } from "../../../../../services/shop.service.js";
import { Button, message, notification, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import useCallApi from "../../../../../hook/useCallApi.js";
import Spinner from "../../../../../components/common/Spinner/index.jsx";

const Media = ({ productDetail }) => {
  const [medias, setMedias] = useState(
    (productDetail?.medias || []).map((url) => ({
      uid: url,
      name: url.split("/").pop(), // chỉ tên file cuối
      status: "done",
      url: url,
    }))
  );
  const uploadInstance = axios.create();

  useEffect(() => {
    if (productDetail?.medias) {
      const converted = productDetail.medias.map((url) => ({
        uid: url,
        name: url.split("/").pop(),
        status: "done",
        url: url,
      }));
      setMedias(converted);
    } else {
      setMedias([]); // reset nếu không có medias
    }
  }, [productDetail]);

  const handleSaveMedias = () => {
    try {
      updateProductDetail(productDetail.id, {
        medias: [...medias?.map((item) => item?.url)],
      }).then((res) => {
        if (res.status === 200) {
          // fetchMedia(productId);
          notification.success({
            message: "Updated",
            description: "Thành công",
          });
        } else
          notification.error({
            message: "Not updated",
            description: "Không thành công",
          });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    console.log("file", file);

    formData.append("file", file);
    formData.append("upload_preset", "pjxg2rxo");
    try {
      uploadInstance
        .post(
          "https://api.cloudinary.com/v1_1/ddpcz77k4/image/upload",
          formData
        )
        .then((res) => {
          if (res) {
            onSuccess(file);
            const data = res?.data?.url;
            // console.log("data",data)
            message.success(`${file.name} tải file thành công.`);
            setMedias((prevMedias) =>
              [
                ...prevMedias,
                {
                  uid: data,
                  name: data,
                  status: "done",
                  url: data,
                },
              ].filter((e) => e?.uid === e?.url)
            );
          } else {
            message.error(`${file.name} tải file thành công.`);
          }
        });
    } catch (e) {
      message.error(`${file.name} tải file thành công.`);
    }
  };

  return (
    <div>
      <>
        <Upload
          customRequest={handleUpload}
          listType="picture-card"
          fileList={medias}
          onChange={({ fileList }) => setMedias(fileList)}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
        <Button type="primary" onClick={handleSaveMedias}>
          Save
        </Button>
      </>
    </div>
  );
};

export default Media;
