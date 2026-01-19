/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Pusher from "pusher-js";
import { FaBell } from "react-icons/fa";
import axiosInstance from "@/app/(util)/axios";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Sync role from localStorage on mount
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Pusher Logic: Only for Admins
    if (role === "admin" || role === "super-admin") {
      const pusher = new Pusher("917780bd81fdea3caf31", {
        cluster: "ap2",
      });

      const channel = pusher.subscribe("admin-channel");
      
      channel.bind("new-service", (data: any) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        pusher.unsubscribe("admin-channel");
      };
    }
  }, []);

  // --- Unified Navigation Links ---
  const allLinks = [
    // Admin & Super Admin Links
    { name: "Manage Vendors", path: "/admin/vendors", roles: ["admin", "super-admin"] },
    { name: "Manage Customers", path: "/admin/customers", roles: ["admin", "super-admin"] },
    { name: "Manage Services", path: "/admin/services", roles: ["admin", "super-admin"] },
    { name: "Admins", path: "/admin/add-admin", roles: ["super-admin"] },
    
    // Customer Links (Note: role name should match backend 'customer')
    { name: "Services", path: "/user/service", roles: ["customer"] },
    { name: "Profile", path: "/user/profile", roles: ["customer"] },
  ];

  // Filter links based on the logged-in user's role
  const filteredLinks = allLinks.filter(
    (link) => userRole && link.roles.includes(userRole)
  );

  const active = (path: string) =>
    pathname === path ? "font-bold text-white btn btn-primary" : "";

  const links = filteredLinks.map((link) => (
    <li key={link.path}>
      <Link href={link.path} className={active(link.path)}>
        {link.name}
      </Link>
    </li>
  ));

  const handleLogout = async () => {
    try {
      // Note: You might need different logout endpoints if they are separate for users/admins
      await axios.post("http://localhost:3002", {}, { withCredentials: true });
      
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userRole");
      await axiosInstance.post('/customer/logout');
      setUserRole(null);
      router.push("/");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8" data-theme="dark">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden ">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[50] mt-3 w-52 p-2 shadow">
            {links}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold italic text-primary">WorkBridge</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 ">
          {links}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {/* Notification Bell (Visible only to Admins) */}
        {(userRole === "admin" || userRole === "super-admin") && (
          <div className="dropdown dropdown-end mr-2">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <FaBell className="h-5 w-5" />
                {unreadCount > 0 && <span className="badge badge-xs badge-primary indicator-item">{unreadCount}</span>}
              </div>
            </div>
            {/* ... Notification Dropdown Content ... */}
          </div>
        )}

        {userRole ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Role</p>
              <p className={`text-xs font-bold ${userRole === 'super-admin' ? 'text-secondary' : 'text-primary'}`}>
                {userRole.toUpperCase()}
              </p>
            </div>
            <button onClick={handleLogout} className="btn btn-error btn-outline btn-sm">
              Logout
            </button>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-primary btn-sm px-6">
              Login
            </div>
            <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-base-200 mt-2">
              <li className="menu-title text-xs uppercase opacity-50 px-4 py-2">Choose Account Type</li>
              <li><Link href="/login">Admin Portal</Link></li>
              <li><Link href="/vendor/login">Vendor Portal</Link></li>
              <li><Link href="/user/login">Customer Portal</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}