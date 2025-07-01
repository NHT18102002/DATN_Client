import {Col, Row} from "antd";
import {Link, useLocation} from "react-router-dom";
import './style.scss';
import {HomeOutlined, NotificationOutlined, ReadOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
const ShopSidebar = () => {
  const {pathname} = useLocation();

  return(
    <Row> 
      <Col span={24} style={{marginTop: 0}}>
        <Link to={'/manage-shop'}>
          <p className={`side-link ${pathname === '/manage-shop' && `side-link-active`}`}>
            <ShopOutlined/> Quản lý cửa hàng
          </p>
        </Link>
      </Col>
      <Col span={24}>
        <Link to={'/manage-shop/products'}>
          <p className={`side-link ${pathname === '/manage-shop/products' && `side-link-active`}`}>
            <HomeOutlined /> Quản lý sản phẩm 
          </p>
        </Link>
      </Col>
      <Col span={24}>
        <Link to={'/manage-shop/orders'}>
          <p className={`side-link ${pathname === '/manage-shop/orders' && `side-link-active`}`}>
            <ShoppingCartOutlined /> Quản lý đơn hàng
          </p>
        </Link>
      </Col>
      <Col span={24}>
        <Link to={'/manage-shop/revenue'}>
          <p className={`side-link ${pathname === '/manage-shop/revenue' && `side-link-active`}`}>
            <ReadOutlined /> Quản lý doanh thu
          </p>
        </Link>
      </Col>
    </Row>
  )
}

export default ShopSidebar