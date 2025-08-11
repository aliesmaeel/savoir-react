import { NavLink, Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <div className="flex items-center justify-center gap-[10px] w-full px-[16px] py-[10px] bg-white">
        <NavLink
          to="/"
          className={({ isActive }) =>
            ` text-[18px] font-semibold hover:underline ${
              isActive ? "text-blue-600" : "text-black"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            ` text-[18px] font-semibold hover:underline ${
              isActive ? "text-blue-600" : "text-black"
            }`
          }
        >
          About
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
