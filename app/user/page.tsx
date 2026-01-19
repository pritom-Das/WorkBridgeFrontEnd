"use client";
import Title from "@/components/title";
import Link from "next/link";
import axiosInstance from "../(util)/axios";
import { useRouter } from "next/navigation";


export default function UserPage() {
    const router = useRouter();
    const handleLogout = async () => {
    try {
      // 1. Tell Backend to delete the HttpOnly cookie
      await axiosInstance.post('/customer/logout');
 
      // 2. Clear Frontend ID
      localStorage.removeItem("userId");

      // 3. Redirect to Login
      router.push("/user/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Optional: Force redirect even if backend fails
      router.push("/user/login");
    }
  };
return (
    <div>
    <Title text="User Dashboard" />
    <p>This is the User dashboard.</p>
    <p>User Profile.</p>
    <Link href="/user/profile"> <button className="btn btn-primary">User Profile.</button></Link>
     <button 
          onClick={handleLogout} 
          className="btn btn-error text-white"
        >
          Logout
        </button>
    </div>
);
}