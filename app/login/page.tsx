/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import axiosInstance from "@/app/(util)/axios";
import Title from "@/components/title";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function UserPage() {
  const [error, setError] = useState<any>({});
  const [authError, setAuthError] = useState("");
  const [loginType, setLoginType] = useState("customer"); // 1. Added loginType state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Zod Validation
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const err: any = {};
      result.error.issues.forEach(i => { err[i.path[0]] = i.message });
      setError(err);
      return;
    }

    setError({});
    setAuthError("");

    try {
      // 2. DYNAMIC ENDPOINT based on loginType (admin, customer, or vendor)
      const response = await axiosInstance.post(`/${loginType}/login`, result.data);
      
      if (response.status === 200 || response.status === 201) {
        // 3. Save role to localStorage for the Navbar
        localStorage.setItem("userRole", response.data.role);
        
        alert("Login Successful!");

        // 4. DYNAMIC REDIRECT based on role
        const role = response.data.role;
        if (role === "admin" || role === "super-admin") {
          window.location.href = "/admin/vendors";
        } else if (role === "vendor") {
          router.push("/vendor/dashBoard");
        } else {
          window.location.href = "/user"; // Customer redirect
        }
      }
    } catch (err: any) {
      // CUSTOMIZED ERROR HANDLING
      const status = err.response?.status;
      if (status === 404) {
        setAuthError("Invalid User Role or Selection.");
      } 
      else if (status === 401) {
        setAuthError("Incorrect email or password.");
      }
      else {
        setAuthError(err.response?.data?.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Title text={`${loginType.toUpperCase()} Login`} />
      
      <form onSubmit={handleSubmit} className="card bg-white shadow-xl p-8 w-96 mt-4 border-2 border-gray-200">
        {authError && <p className="text-error text-center mb-4 font-bold">{authError}</p>}
        
        {/* 5. Added User Type Selection Dropdown */}
        <div className="form-control mb-4">
          <label className="label font-bold">Log in as</label>
          <select 
            className="select select-bordered w-full text-white"
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label ">Email: </label>
          <input 
            type="email" 
            name="email" 
            className="input input-bordered text-white" 
          />
          {error.email && <span className="text-error text-xs mt-1"> {error.email}</span>}
        </div>
        
        <div className="form-control mt-4">
          <label className="label">Password: </label>
          <input 
            type="password" 
            name="password" 
            className="input  input-bordered text-white" 
          />
          {error.password && <span className="text-error text-xs mt-1"> {error.password}</span>}
        </div>
        
        <button type="submit" className="btn btn-primary mt-8">Login</button>
      </form>
    </div>
  );
}