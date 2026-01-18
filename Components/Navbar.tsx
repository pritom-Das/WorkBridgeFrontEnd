"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // 1. Define links and mark which ones are ONLY for Super Admins
 const allLinks = [
  { name: "Manage Vendors", path: "/admin/vendors", roles: ["admin", "super-admin"] },
  { name: "Manage Customers", path: "/admin/customers", roles: ["admin", "super-admin"] },
  { name: "Manage Services", path: "/admin/services", roles: ["admin", "super-admin"] },
  { name: "Admins", path: "/admin/add-admin", roles: ["super-admin"] },
];


  // 2. Logic: Super Admin sees everything. Admin sees only superOnly: false.
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
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
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

      <div className="navbar-end">
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