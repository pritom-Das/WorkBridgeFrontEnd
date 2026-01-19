/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axiosInstance from "@/app/(util)/axios";
<<<<<<< HEAD
import Footer from "@/components/footer";
import Title from "@/components/title";
=======
import Link from "next/link"; // Added for navigation
>>>>>>> vendor

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(11, { message: "Phone number must be at least 11 digits" }),
});

export default function VendorRegister() {
  const [error, setError] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const err: any = {};
      result.error.issues.forEach((i) => {
        err[i.path[0]] = i.message;
      });
      setError(err);
      return;
    }

    setError({});
    setServerError("");

    try {
      // Axios Request #1: Register
      await axiosInstance.post('/vendors', result.data);
      
      alert("Registration Successful! Please Login.");
      router.push("/vendor/login"); // Redirect to login to get Cookie/ID

    } catch (err: any) {
      setServerError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    // Updated classes to match Login Page style (bg-base-200)
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 py-10" data-theme="light">
      
      <form onSubmit={handleSubmit}>
        {/* Updated classes to match Login Page style (bg-base-100) */}
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-80 border p-4 shadow-sm">
          <legend className="fieldset-legend text-2xl font-bold">Vendor Registration</legend>

          {/* Server Error Message */}
          {serverError && (
            <div className="text-error text-sm text-center mb-2 font-medium">
              {serverError}
            </div>
          )}

          {/* Name Field */}
          <div className="w-full">
            <label className="label">Name</label>
            <input 
              type="text" 
              name="name" 
              className="input w-full" 
              placeholder="Vendor Name" 
            />
            {error.name && <span className="text-error text-xs mt-1 block">{error.name}</span>}
          </div>

          {/* Email Field */}
          <div className="w-full">
            <label className="label">Email</label>
            <input 
              type="email" 
              name="email" 
              className="input w-full" 
              placeholder="Email Address" 
            />
            {error.email && <span className="text-error text-xs mt-1 block">{error.email}</span>}
          </div>

          {/* Password Field */}
          <div className="w-full">
            <label className="label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="input w-full" 
              placeholder="Password" 
            />
            {error.password && <span className="text-error text-xs mt-1 block">{error.password}</span>}
          </div>

          {/* Address Field */}
          <div className="w-full">
            <label className="label">Address</label>
            <input 
              type="text" 
              name="address" 
              className="input w-full" 
              placeholder="Business Address" 
            />
            {error.address && <span className="text-error text-xs mt-1 block">{error.address}</span>}
          </div>

          {/* Phone Field */}
          <div className="w-full">
            <label className="label">Phone</label>
            <input 
              type="text" 
              name="phone" 
              className="input w-full" 
              placeholder="Phone Number" 
            />
            {error.phone && <span className="text-error text-xs mt-1 block">{error.phone}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-neutral mt-6 w-full">
            Register
          </button>

          {/* Login Link for better UX */}
          <div className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/vendor/login" className="link link-primary">
              Login here
            </Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
}