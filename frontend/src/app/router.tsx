import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import NotFoundPage from "../components/common/NotFoundPage";

import HomePage from "../features/products/HomePage";
import ProductsPage from "../features/products/ProductsPage";
import ProductDetailsPage from "../features/products/ProductDetailsPage";
import ComparePage from "../features/products/ComparePage";
import CartPage from "../features/cart/CartPage";
import WishlistPage from "../features/wishlist/WishlistPage";
import CheckoutPage from "../features/checkout/CheckoutPage";
import OrderConfirmationPage from "../features/checkout/OrderConfirmationPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ProfilePage from "../features/auth/ProfilePage";
import OrdersPage from "../features/orders/OrdersPage";
import OrderDetailsPage from "../features/orders/OrderDetailsPage";
import RecommendationsPage from "../features/recommendations/RecommendationsPage";

import AdminDashboard from "../features/admin/AdminDashboard";
import AdminProductsPage from "../features/admin/AdminProductsPage";
import AdminCategoriesPage from "../features/admin/AdminCategoriesPage";
import AdminOrdersPage from "../features/admin/AdminOrdersPage";
import AdminInventoryPage from "../features/admin/AdminInventoryPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:id", element: <ProductDetailsPage /> },
      { path: "/compare", element: <ComparePage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/order-confirmation/:id", element: <OrderConfirmationPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/orders/:id", element: <OrderDetailsPage /> },
      { path: "/recommendations", element: <RecommendationsPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "categories", element: <AdminCategoriesPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "inventory", element: <AdminInventoryPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);