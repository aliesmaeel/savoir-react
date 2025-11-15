import { NavLink, Outlet } from "react-router";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import ScrollToTop from "~/components/ScrollToTop/ScrollToTop";

export default function MainLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
