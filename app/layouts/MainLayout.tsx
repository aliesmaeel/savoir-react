import { NavLink, Outlet } from "react-router";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function MainLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
