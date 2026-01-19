/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/title";
import axiosInstance from "@/app/(util)/axios";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function VendorPage() {
  const [error, setError] = useState<any>({});
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // 1. Client-side Validation
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
      // 2. Axios Request (Login)
      const response = await axiosInstance.post('/vendors/login', result.data); 
      
      // 3. Save Vendor ID to LocalStorage
      // Note: This relies on your Backend Controller returning { id: 1, ... }
      if (response.data.id) {
        localStorage.setItem("vendorId", response.data.id.toString());
      } else {
        console.warn("Backend did not return an ID. Dashboard requests may fail.");
      }

      alert("Login Successful!");
      router.push("/vendor/dashBoard");
       
    } catch (err: any) { 
      setAuthError(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200" data-theme="light">  
      <form onSubmit={handleSubmit} className="mt-6">
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-80 border p-4">
          <legend className="fieldset-legend text-2xl">Login</legend>

          {/* Global Auth Error */}
          {authError && (
            <div className="text-error text-sm text-center mb-3">
              {authError}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="label">Email</label>
            <input 
              type="email" 
              name="email" 
              className="input w-full" 
              placeholder="Enter your email"
            />
          </div> 
          {error.email && <span className="text-error text-xs mt-1">{error.email}</span>}

          {/* Password Field */}
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="input w-full" 
              placeholder="Enter your password"
            />
          </div>
          {error.password && <span className="text-error text-xs mt-1">{error.password}</span>}

          {/* Submit Button */}
          <button type="submit" className="btn btn-neutral mt-4 w-full">
            Login
          </button>
        </fieldset>
      </form>
    </div>
  );
}