/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import axiosInstance from "@/app/(util)/axios";
import Title from "@/components/title";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function UserPage() {
  const [error, setError] = useState<any>({});
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const err: any = {};
      result.error.issues.forEach((i) => {
        err[i.path[0]] = i.message;
      });
      setError(err);
      return;
    }

    setError({});
    setAuthError("");

    try {
      // 2. Axios Request (Login)
      const response = await axiosInstance.post("/customer/login", result.data);

      // 3. Save User ID to LocalStorage
      if (response.data.id && response.data.role) {
        localStorage.setItem("userId", response.data.id.toString());
        localStorage.setItem("userRole", response.data.role);
        console.log("User ID saved:", response.data.id);
        console.log("User role saved:", response.data.role);
      }
       else {
        console.warn("Backend did not return an ID. Dashboard requests may fail.");
      }
      alert("Login Successful!");
      window.location.href = "/user/service";
    } catch (err: any) {
      setAuthError(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200" data-theme="light">
      
      
      <form onSubmit={handleSubmit} className="">
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-80 border p-4 shadow-sm">
          <legend className="fieldset-legend text-2xl text-center">User Login</legend>

          {/* Global Auth Error */}
          {authError && (
            <div className="text-error text-sm text-center mb-3 font-medium">
              {authError}
            </div>
          )}

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              className="input w-full border-base-300"
              placeholder="Enter your email"
            />
            {error.email && <span className="text-error text-xs mt-1">{error.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              className="input w-full border-base-300"
              placeholder="Enter your password"
            />
            {error.password && <span className="text-error text-xs mt-1">{error.password}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-neutral mt-6 w-full">
            Login
          </button>
                    {/* Link Moved Inside Here */}
          <div className="text-center mt-4 text-sm">Don't have an account?{" "}
            <Link href="/user/register" className="link link-primary">
              Register here
            </Link>
          </div>


        </fieldset>
      </form>
    </div>
  );
}