import React, { useState } from "react";
import { Drawer } from "@mui/material";
import {
  Map,
  Users,
  TriangleAlert,
  ChartColumn,
  Menu,
  X,
  UserCog2,
} from "lucide-react";
import Search from "./dashboard/Search";
import { NavLink, useLocation } from "react-router-dom";
import MapSettings from "./dashboard/MapSettings";
import Legends from "./analytics/Legends";
import MapReport from "./sidebar/MapReport";

const drawerWidth = 300;

function Sidebar({ zoom, setZoom, mapType, setMapType, onLocationSelect }) {
  const location = useLocation();

  const [open, setOpen] = useState(() => window.innerWidth >= 768);

  // Get logged-in user's data
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const isSuperuser = userData?.is_superuser === true;

  const menus = [
    {
      name: "Map",
      path: "/dashboard",
      icon: <Map size={38} strokeWidth={2.2} />,
    },

    // Show only to superusers
    ...(isSuperuser
      ? [
          {
            name: "Residents",
            path: "/residents",
            icon: <Users size={38} strokeWidth={2.2} />,
          },
          // {
          //   name: "Dengue Reports",
          //   path: "/dengue-cases",
          //   icon: <TriangleAlert size={38} strokeWidth={2.2} />,
          // },
          // {
          //   name: "Analytics",
          //   path: "/analytics",
          //   icon: <ChartColumn size={38} strokeWidth={2.2} />,
          // },
        ]
      : []),

    // Show only to non-superusers
    ...(!isSuperuser
      ? [
          {
            name: "Profile Settings",
            path: "/profile",
            icon: <UserCog2 size={38} strokeWidth={2.2} />,
          },
        ]
      : []),

    // {
    //   name: "Awareness",
    //   path: "/awareness-page",
    //   icon: <TriangleAlert size={38} strokeWidth={2.2} />,
    // },
  ];

  const toggleSidebar = () => {
    const newState = !open;

    setOpen(newState);

    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: { open: newState },
      }),
    );
  };

  // Close sidebar only on mobile when clicking a menu
  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);

      window.dispatchEvent(
        new CustomEvent("sidebar-toggle", {
          detail: { open: false },
        }),
      );
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-3 z-[99999] flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700"
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? (
          <X size={26} strokeWidth={2.5} />
        ) : (
          <Menu size={26} strokeWidth={2.5} />
        )}
      </button>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          zIndex: 9999,
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            zIndex: 9999,
            borderRight: "none",
            backgroundColor: "#fff",
            overflowY: "auto",
            transition: "all .3s ease",

            // Full width on mobile
            "@media (max-width: 767px)": {
              width: "100%",
            },
          },
        }}
      >
        <div className="hide-scrollbar flex h-full flex-col border-r-2 border-gray-200">
          {/* Search and Navigation Title */}
          <div className="mt-24 px-4">
            {/* <Search /> */}

            <p className="mt-4 text-lg font-bold text-gray-900">Navigation</p>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {menus.map((menu) => {
                const active = location.pathname === menu.path;

                return (
                  <NavLink
                    key={menu.name}
                    to={menu.path}
                    onClick={handleMenuClick}
                  >
                    <div
                      className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 transition-all ${
                        active
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
                          : "border-gray-200 bg-white text-gray-900 hover:border-emerald-500 hover:bg-emerald-50"
                      }`}
                    >
                      <div
                        className={active ? "text-white" : "text-emerald-700"}
                      >
                        {menu.icon}
                      </div>

                      <p className="mt-3 text-center text-sm font-semibold">
                        {menu.name}
                      </p>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* Page-Specific Content */}
            {location.pathname === "/dashboard" ? (
              <>
                <MapReport onLocationSelect={onLocationSelect} />

                <MapSettings
                  zoom={zoom}
                  setZoom={setZoom}
                  mapType={mapType}
                  setMapType={setMapType}
                />
              </>
            ) : (
              <Legends />
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default Sidebar;
