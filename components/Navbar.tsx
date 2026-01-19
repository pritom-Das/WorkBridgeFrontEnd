/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Pusher from "pusher-js"; // Import Pusher
import { FaBell } from "react-icons/fa"; // Import Bell Icon

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // --- New State for Notifications ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // --- Pusher Listener Logic ---
    // Only subscribe if the user is an admin or super-admin
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

  const allLinks = [
    { name: "Manage Vendors", path: "/admin/vendors", roles: ["admin", "super-admin"] },
    { name: "Manage Customers", path: "/admin/customers", roles: ["admin", "super-admin"] },
    { name: "Manage Services", path: "/admin/services", roles: ["admin", "super-admin"] },
    { name: "Admins", path: "/admin/add-admin", roles: ["super-admin"] },
  ];

  const filteredLinks = allLinks.filter(
    (link) => userRole && link.roles.includes(userRole)
  );

  const active = (path: string) =>
    pathname === path ? "font-bold text-primary" : "";

  const links = filteredLinks.map((link) => (
    <li key={link.path}>
      <Link href={link.path} className={active(link.path)}>
        {link.name}
      </Link>
    </li>
  ));

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/admin/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userRole");
      setUserRole(null);
      router.push("/login");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8" data-theme="dark">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {links}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold italic text-primary">WorkBridge</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {links}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {/* --- Notification Bell Section --- */}
        {userRole && (userRole === "admin" || userRole === "super-admin") && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <FaBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="badge badge-xs badge-primary indicator-item">{unreadCount}</span>
                )}
              </div>
            </div>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-64 bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h3 className="font-bold text-sm">Notifications</h3>
                <div className="max-h-48 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <div key={i} className="py-2 border-b border-base-100 last:border-0 text-xs">
                        <p className="font-semibold text-primary">{n.message}</p>
                        <p className="opacity-70">By: {n.vendorName}</p>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-center opacity-50 text-xs">No new updates</p>
                  )}
                </div>
                <button 
                  onClick={() => setUnreadCount(0)} 
                  className="btn btn-xs btn-block btn-ghost mt-2"
                >
                  Clear Count
                </button>
              </div>
            </div>
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
          <Link href="/login" className="btn btn-primary btn-sm px-6">Login</Link>
        )}
      </div>
    </div>
  );
}