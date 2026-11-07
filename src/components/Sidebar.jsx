import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bike,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  Menu,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Riders",
      path: "/riders",
      icon: Bike,
    },
    {
      name: "SMS Logs",
      path: "/sms-logs",
      icon: MessageSquare,
    },
    {
      name: "Incident Logs",
      path: "/incident-logs",
      icon: AlertTriangle,
    },
  ];

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    // Add your existing logout logic here
  };

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg transition hover:bg-red-700 active:scale-95 md:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[55] bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-[60] flex h-dvh flex-col
          border-r border-slate-700/60
          bg-slate-900 text-white shadow-2xl
          transition-all duration-300 ease-in-out

          w-72
          ${isOpen ? "md:w-72" : "md:w-20"}

          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* BRAND HEADER */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-700 px-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-yellow-300 shadow-lg shadow-red-950/40">
              <ShieldCheck size={25} />
            </div>

            <div className={`${!isOpen ? "md:hidden" : ""}`}>
              <h1 className="whitespace-nowrap text-lg font-extrabold tracking-wide">
                Road
                <span className="text-yellow-400">Safety</span>
              </h1>
              <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">
                Monitoring System
              </p>
            </div>
          </div>

          {/* DESKTOP COLLAPSE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-yellow-400 md:block"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${
                !isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p
            className={`mb-4 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500 ${
              !isOpen ? "md:hidden" : ""
            }`}
          >
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  title={!isOpen ? item.name : ""}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 rounded-xl px-3 py-3.5 transition-all duration-200 ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-yellow-400"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={21}
                        className={`shrink-0 ${
                          isActive ? "text-yellow-300" : ""
                        }`}
                      />

                      <span
                        className={`whitespace-nowrap text-sm font-semibold ${
                          !isOpen ? "md:hidden" : ""
                        }`}
                      >
                        {item.name}
                      </span>

                      {isActive && (
                        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-yellow-300" />
                      )}

                      {!isOpen && (
                        <span className="pointer-events-none absolute left-16 z-50 hidden whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100 md:block">
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* SYSTEM STATUS */}
        <div className={`mx-4 mb-5 rounded-xl border border-slate-700 bg-slate-800/70 p-4 ${
          !isOpen ? "md:hidden" : ""
        }`}>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            <span className="text-xs font-bold text-slate-200">
              System Status
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-400">
            Rider monitoring system is active.
          </p>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-slate-700 p-4">
          <Link to={'/logout'}
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={21} />

            <span className={`text-sm font-semibold ${
              !isOpen ? "md:hidden" : ""
            }`}>
              Logout
            </span>
          </Link>

          <p className={`mt-3 text-center text-[10px] text-slate-600 ${
            !isOpen ? "md:hidden" : ""
          }`}>
            RiderGuard © 2026
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
