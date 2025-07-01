import Homepage from "../../pages/Homepage/index.jsx";
import Shop from "../../pages/Shop/index.jsx";
import Contact from "../../pages/Contact/index.jsx";
import About from "../../pages/About/index.jsx";
import SignIn from "../../pages/SignIn/index.jsx";
import SignUp from "../../pages/SignUp/index.jsx";
import ProductDetail from "../../pages/Product/[id]/index.jsx";
import MyAccount from "../../pages/MyAccount/index.jsx";
import Notifications from "../../pages/Notifications/index.jsx";
import Orders from "../../pages/Orders/index.jsx";
import Cart from "../../pages/Cart/index.jsx";
import Address from "../../pages/Address/index.jsx";
import PaymentSuccess from "../../pages/PaymentSuccess/PaymentSuccess/index.jsx";
import ShopDetail from "../../pages/Shop/[id]/index.jsx";
import Category from "../../pages/Category/[id]/index.jsx";
import VnPaySuccess from "../../pages/PaymentSuccess/VnPaySuccess/index.jsx";
import SearchPage from "../../pages/Search/index.jsx";
import ApplySeller from "../../pages/ApplySeller/index.jsx";
import ManageShop from "../../pages/ManageShop/index.jsx";
import ManageProduct from "../../pages/ManageShop/ManageProduct/index.jsx";
import ManageOrders from "../../pages/ManageShop/Orders/index.jsx";
export const MENU = [
  {
    name: "Home",
    path: "/",
    element: <Homepage />,
  },


  {
    path: "/shop/:id",
    element: <ShopDetail />,
  },

  {
    path: "/category/:id",
    element: <Category />,
  },

  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    name: "Contact",
    path: "/contact",
    element: <Contact />,
  },
  {
    name: "About",
    path: "/about",
    element: <About />,
  },
  {
    name: "",
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    name: "",
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    name: "",
    path: "/my-account",
    element: <MyAccount />,
  },

  {
    name: "",
    path: "/search",
    element: <SearchPage />,
  },
  {
    name: "",
    path: "/address",
    element: <Address />,
  },
  {
    name: "",
    path: "/notifications",
    element: <Notifications />,
  },
  {
    name: "",
    path: "/cart",
    element: <Cart />,
  },
  {
    name: "",
    path: "/orders",
    element: <Orders />,
  },
  {
    name: "",
    path: "/cart/payment-success",
    element: <PaymentSuccess />,
  },

  {
    name: "",
    path: "/cart/vn-pay/payment-success",
    element: <VnPaySuccess />,
  },

  {
    name: "",
    path: "/apply-shop",
    element: <ApplySeller />,
  },

  {
    name: "",
    path: "/manage-shop",
    element: <ManageShop />,
  },

  {
    name: "",
    path: "/manage-shop/products",
    element: <ManageProduct />,
  },

  {
    name: "",
    path: "/manage-shop/orders",
    element: <ManageOrders />,
  },
];
