import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import './style.scss'
const SearchBar = () => {
  const { Search } = Input;
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value) => {
    console.log("Từ khóa tìm kiếm:", value);
    // Gọi API hoặc truyền keyword vào query
    navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <Search
    className="search"
      placeholder="Tìm kiếm sản phẩm..."
      enterButton
      size="large"
      // width={}
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onSearch={handleSearch}
      allowClear
    />
  );
};

export default SearchBar;
