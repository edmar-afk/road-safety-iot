import React from "react";
import { Link } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import logo from "../assets/images/logo.jpg";

function Header() {
  // Get userData from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // Display first_name or fallback
  const displayName = userData.first_name?.trim() || "Administrator";

  return (
    <div className="fixed px-4 md:px-12 py-5 flex flex-row items-center justify-between w-full bg-emerald-700 z-[99999]">
      <div className="flex flex-row items-center gap-24 ml-14 md:ml-8">
        <p className="text-2xl font-extrabold text-white">DengueWatch</p>
      </div>

      <div className="flex flex-row items-center gap-2">
        <img src={logo} className="w-8 rounded-full" alt="Logo" />

        <div className="flex flex-row items-center gap-2">
          <Link
            to="/logout"
            className="flex items-center justify-center text-white hover:text-red-300 transition-colors"
            title="Logout"
          >
            <Logout fontSize="medium" />
          </Link>

          <p className="text-md text-white font-semibold hidden md:block">
            {displayName}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Header;
