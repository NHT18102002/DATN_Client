import { Modal, Form, Input, Rate, Image, Upload, Button, message } from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  createReview,
  getReviewByOrder,
  updateReview,
} from "../../../../../services/review.service";

const ReviewModal = ({ open, onClose, orderItems, orderItemId }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileListMap, setFileListMap] = useState({});
  const [existingReviews, setExistingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const uploadInstance = axios.create();

  useEffect(() => {
    const fetchReview = async () => {
      if (!orderItemId) return;
      try {
        setLoading(true);
        const res = await getReviewByOrder(orderItemId);
        setExistingReviews(res?.data?.data?.items || []);
      } catch (err) {
        console.error("Lỗi khi lấy review:", err);
        setExistingReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchReview();
  }, [orderItemId, open]);

  const handleUpload = (detailId, options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pjxg2rxo");

    uploadInstance
      .post("https://api.cloudinary.com/v1_1/ddpcz77k4/image/upload", formData)
      .then((res) => {
        const uploadedUrl = res?.data?.url;
        if (uploadedUrl) {
          file.status = "done";
          file.url = uploadedUrl;
          message.success(`${file.name} tải file thành công.`);
          onSuccess(file);
        } else {
          message.error(`${file.name} tải file thất bại.`);
          onError("Không có URL");
        }
      })
      .catch((e) => {
        message.error(`${file.name} tải file thất bại.`);
        onError(e);
      });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const createPromises = orderItems.map((item) => {
        const detailId = item?.PriceProductDetail?.id;
        const productId =
          item?.PriceProductDetail?.productDetail?.productId?.id;

        const payload = {
          rate: values.rate?.[detailId],
          content: values.comment?.[detailId],
          medias: (fileListMap?.[detailId] || []).map((file) => file?.url),
          productId,
          priceProductDetailId: detailId,
          orderItemId,
        };

        return createReview(payload);
      });

      await Promise.all(createPromises);
      message.success("Gửi đánh giá thành công!");
      resetForm();
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      message.error("Gửi đánh giá thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const detailId = editingReview.priceProductDetailId;

      const payload = {
        rate: values.rate?.[detailId],
        content: values.comment?.[detailId],
        medias: (fileListMap?.[detailId] || []).map((file) => file?.url),
      };

      await updateReview(editingReview.id, payload);
      message.success("Cập nhật đánh giá thành công!");
      resetForm();
    } catch (err) {
      console.error("Lỗi khi cập nhật đánh giá:", err);
      message.error("Cập nhật đánh giá thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setFileListMap({});
    setEditing(false);
    setEditingReview(null);
    onClose();
  };

  const renderExistingReviews = () =>
    existingReviews.map((review) => (
      <div
        key={review.id}
        style={{
          marginBottom: 30,
          marginLeft: 10,
          borderBottom: "1px solid #ccc",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          {/* <div>{item}</div> */}
          <Image
            src={
              review?.orderItem?.PriceProductDetail?.productDetail?.productId
                ?.thumbnail
            }
            style={{ height: 78, width: 78, objectFit: "cover" }}
            preview={false}
          />
          <div>
            <p style={{ fontSize: 13, fontWeight: 500 }}>
              {
                review?.orderItem?.PriceProductDetail?.productDetail?.productId
                  ?.name
              }
            </p>

            {review?.orderItem?.PriceProductDetail?.selectionOptions && (
              <div>
                Phân loại:{" "}
                {review.orderItem.PriceProductDetail.selectionOptions
                  .map(
                    (attr) =>
                      `${attr.title}: ${attr.options
                        ?.map((opt) => opt.name)
                        .join(", ")}`
                  )
                  .join(", ")}
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div>
            <Rate
              disabled
              defaultValue={review?.rate}
              style={{ fontSize: 14 }}
            />
          </div>
        </div>
        <p style={{ marginBottom: 8 }}>{review?.content}</p>
        {review?.medias?.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {review.medias.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        )}
        <Button
          style={{ marginTop: 10, marginBottom: 20}}
          type="link"
          onClick={() => {
            setEditing(true);
            // console.log(existingReviews);
            setEditingReview(review);
            form.setFieldsValue({
              rate: { [review.priceProductDetailId]: review.rate },
              comment: { [review.priceProductDetailId]: review.content },
            });
            setFileListMap({
              [review.priceProductDetailId]: review.medias.map((url, idx) => ({
                uid: `${idx}`,
                name: `image-${idx}`,
                status: "done",
                url,
              })),
            });
          }}
        >
          Sửa
        </Button>
      </div>
    ));

  const renderReviewForm = () => {
    const itemsToRender = editing ? [editingReview] : orderItems;

    return (
      <Form form={form} layout="vertical">
        {itemsToRender.map((item) => {
          const detailId = editing
            ? item.priceProductDetailId
            : item?.PriceProductDetail?.id;
          const product = editing
            ? item?.orderItem?.PriceProductDetail?.productDetail?.productId
            : item?.PriceProductDetail?.productDetail?.productId;

          return (
            <div key={detailId} style={{ marginBottom: 30 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                {/* <div>{item}</div> */}
                <Image
                  src={product?.thumbnail}
                  style={{ height: 78, width: 78, objectFit: "cover" }}
                  preview={false}
                />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>
                    {product?.name}
                  </p>

                  {item?.orderItem?.PriceProductDetail?.selectionOptions && (
                    <div>
                      Phân loại:{" "}
                      {item.orderItem.PriceProductDetail.selectionOptions
                        .map(
                          (attr) =>
                            `${attr.title}: ${attr.options
                              ?.map((opt) => opt.name)
                              .join(", ")}`
                        )
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <label style={{ width: 160 }}>Chất lượng sản phẩm:</label>
                <Form.Item
                  name={["rate", detailId]}
                  rules={[{ required: true, message: "Chọn số sao đánh giá" }]}
                  style={{ margin: 0 }}
                >
                  <Rate />
                </Form.Item>
              </div>

              <Form.Item name={["comment", detailId]}>
                <Input.TextArea
                  rows={3}
                  placeholder="Nhận xét về sản phẩm..."
                />
              </Form.Item>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Hình ảnh sản phẩm:
                </label>
                <Upload
                  customRequest={(options) => handleUpload(detailId, options)}
                  listType="picture-card"
                  fileList={fileListMap[detailId] || []}
                  onChange={({ fileList }) => {
                    setFileListMap((prev) => ({
                      ...prev,
                      [detailId]: fileList,
                    }));
                  }}
                >
                  {(fileListMap[detailId]?.length || 0) < 5 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>
            </div>
          );
        })}
      </Form>
    );
  };

  return (
    <Modal
      open={open}
      title="Đánh giá sản phẩm"
      onCancel={resetForm}
      onOk={
        existingReviews.length === 0
          ? handleSubmit
          : editing
          ? handleUpdateReview
          : undefined
      }
      okButtonProps={{ disabled: existingReviews.length > 0 && !editing }}
      confirmLoading={submitting}
      okText={editing ? "Cập nhật" : "Gửi đánh giá"}
      cancelText="Hủy"
      width={800}
    >
      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : existingReviews.length > 0 && !editing ? (
        renderExistingReviews()
      ) : (
        renderReviewForm()
      )}
    </Modal>
  );
};

export default ReviewModal;
