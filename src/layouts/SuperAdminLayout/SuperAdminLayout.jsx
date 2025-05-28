"use client";

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  UserPlus,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import logoImage from "../../assets/logo.png";
import "./SuperAdminLayout.scss";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tashkilotlar",
      path: "/organizations",
      icon: Building2,
    },
    {
      name: "Adminlar",
      path: "/admins",
      icon: Users,
    },
    {
      name: "Bo'sh ish o'rinlari",
      path: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Arizalar",
      path: "/applications",
      icon: UserCheck,
    },
    {
      name: "Nomzodlar",
      path: "/candidates",
      icon: UserPlus,
    },
  ];

  const handleLogout = () => {
    // Tokenlarni o'chirish
    Cookies.remove("user_token");
    Cookies.remove("refresh_token");
    localStorage.removeItem("user_data");

    // Toast xabari
    toast.success("Tizimdan muvaffaqiyatli chiqdingiz!", {
      position: "top-right",
      autoClose: 2000,
    });

    // Login sahifasiga yo'naltirish
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img
              src={logoImage || "/placeholder.svg"}
              alt="Jobs HR Logo"
              className="logo"
            />
            <span className="logo-text">Super Admin</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <button
                    className={`nav-link ${
                      isActiveRoute(item.path) ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="page-title">
              {navigationItems.find((item) => item.path === location.pathname)
                ?.name || "Dashboard"}
            </h1>
          </div>

          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-details">
                <span className="user-name">Super Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            <button className="logout-btn-header" onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SuperAdminLayout;
