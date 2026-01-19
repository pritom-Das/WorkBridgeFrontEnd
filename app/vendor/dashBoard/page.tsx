"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Tell Backend to delete the HttpOnly cookie
      await axiosInstance.post('/vendors/logout');

      // 2. Clear Frontend ID
      localStorage.removeItem("vendorId");

      // 3. Redirect to Login
      router.push("/vendor/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Optional: Force redirect even if backend fails
      router.push("/vendor/login");
    }
  };

  return (
    <div className="navbar bg-gray-500 shadow-sm text-white">
      <div className="navbar-start">
        <a className="text-xl px-4 font-bold">Work Bridge</a>
      </div>

      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            {/* Use Link for client-side navigation */}
            <Link 
              href="/vendor/service/create" 
              className="btn btn-outline text-white hover:bg-white hover:text-gray-800"
            >
              New Service
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end space-between gap-4 px-2">
        {/* Profile Link */}
        <Link href="/vendor/profile" className="btn btn-outline text-white hover:bg-white hover:text-gray-800">
          Profile
        </Link>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="btn btn-error text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}