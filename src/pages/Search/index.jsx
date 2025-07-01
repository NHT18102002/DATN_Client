import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFilterProducts } from "../../services/shop.service";
import useCallApi from "../../hook/useCallApi";
import ProductCard from "../../components/ProductCard";
import { useWindowSize } from "../../hook/useWindowSize";
import { Row, Input, Button, Rate, Select, Pagination, Col, Space } from "antd";
import { SM } from "../../constants";
import "./style.scss";

const { Option } = Select;

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage = () => {
  const windowSize = useWindowSize();
  const query = useQuery();
  const keyword = query.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [rate, setRate] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sort, setSort] = useState("DESC");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 60,
    total: 0,
  });

  const [filters, setFilters] = useState({});

  const { send: fetchSearchProducts, loading } = useCallApi({
    callApi: getFilterProducts,
    success: (res) => {
      const items = res?.data?.items || [];
      setProducts(items);
      setPagination((prev) => ({
        ...prev,
        total: res?.data?.meta?.total || 0,
      }));
    },
    error: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const loadData = (params = {}) => {
    const queryParams = {
      keyword,
      page: pagination.page,
      limit: pagination.limit,
      sortBy,
      sort,
      ...params,
    };
    fetchSearchProducts(queryParams);
  };

  useEffect(() => {
    if (keyword) {
      loadData();
      
    }
  }, [keyword, pagination.page, sortBy, sort]);

  const handleSearch = () => {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const newFilters = {
      keyword,
      page: 1, // reset về trang 1 khi filter
      priceMin: min > 0 ? min : undefined,
      priceMax: max > 0 ? max : undefined,
      rateMin: rate || undefined,
    };

    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters(newFilters);
    loadData(newFilters);
  };

  const handleReset = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setRate(0);
    setSort("DESC");
    setSortBy("sellOfQuantity");
    setPagination({ page: 1, limit: 60, total: 0 });
    setFilters({});
    loadData({ keyword, page: 1, limit: 60 });
  };

  const handlePageChange = (page) => {
    setPagination((prev) => {
      const updated = { ...prev, page };
      loadData({ ...filters, page });
      return updated;
    });
  };

  return (
    <>
      <div>
        <Row
          wrap
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f5",
            padding: "20px",
          }}
        >
          <h3 style={{ textAlign: "start" }}>
            Kết quả tìm kiếm cho từ khóa: <b>{keyword}</b>
          </h3>
          <Row
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div>Lọc theo</div>
            <Input
              placeholder="Giá tối thiểu"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: 130 }}
            />
            <Input
              placeholder="Giá tối đa"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: 130 }}
            />
            <Select
              placeholder="Đánh giá"
              onChange={setRate}
              style={{ width: 130 }}
            >
              <Option value="5">5 sao</Option>
              <Option value="4">4 sao trở lên</Option>
              <Option value="3">3 sao trở lên</Option>
              <Option value="2">2 sao trở lên</Option>
              <Option value="1">1 sao trở lên</Option>
            </Select>

            <Button type="primary" onClick={handleSearch}>
              Lọc sản phẩm
            </Button>
          </Row>
          <Row
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>Sắp xếp theo</div>

            <Space style={{ margin: "16px 0" }}>
              <Button
                type={
                  sortBy === "sellOfQuantity" && sort === "DESC"
                    ? "primary"
                    : "default"
                }
                onClick={() => {
                  setSortBy("sellOfQuantity");
                  setSort("DESC");
                }}
              >
                Bán chạy
              </Button>
              <Button
                type={
                  sortBy === "createdAt" && sort === "DESC"
                    ? "primary"
                    : "default"
                }
                onClick={() => {
                  setSortBy("createdAt");
                  setSort("DESC");
                }}
              >
                Mới nhất
              </Button>

              <Button
                type={
                  sortBy === "price" && sort === "ASC" ? "primary" : "default"
                }
                onClick={() => {
                  setSortBy("price");
                  setSort("ASC");
                }}
              >
                Giá tăng dần
              </Button>
              <Button
                type={
                  sortBy === "price" && sort === "DESC" ? "primary" : "default"
                }
                onClick={() => {
                  setSortBy("price");
                  setSort("DESC");
                }}
              >
                Giá giảm dần
              </Button>
            </Space>
            <Button onClick={handleReset}>Reset bộ lọc</Button>
          </Row>
        </Row>

        <Row
          className="shop-products"
          gutter={windowSize.width >= SM ? [32, 32] : [16, 16]}
        >
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product?.id}
              productPerOneRow={4}
            />
          ))}
        </Row>

        <Row justify="center" style={{ marginTop: 32 }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Row>
      </div>
    </>
  );
};

export default SearchPage;
