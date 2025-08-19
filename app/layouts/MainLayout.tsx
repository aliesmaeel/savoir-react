import { NavLink, Outlet } from "react-router";
import Header from "./Header/Header";

export default function MainLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
