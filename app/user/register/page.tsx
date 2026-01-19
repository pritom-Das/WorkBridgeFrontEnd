/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" }),
  address: z.string().min(5, { message: "Address is required" }),
  phoneNumber: z.string().min(11, { message: "Phone number must be at least 11 digits" }),
  gender: z.string().refine(
    (val) => ['male', 'female', 'other'].includes(val),
    { message: "Please select a gender" }
  ),
  role: z.string().refine(
    (val) => ['customer', 'vendor'].includes(val),
    { message: "Please select a role" }
  )
});

export default function UserRegister() {
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
      const response = await axiosInstance.post('/customer/register', result.data);
      if (response.status === 201 || response.status === 200) {
        alert("Registration Successful!");
        router.push("/user/login");
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 py-10" data-theme="light">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-96 border p-6 shadow-sm">
          <legend className="fieldset-legend text-2xl font-bold ">User Registration</legend>

          {/* Server Error Message */}
          {serverError && (
            <div className="text-error text-sm text-center mb-4 font-medium">
              {serverError}
            </div>
          )}

          {/* Name Field */}
          <div className="w-full">
            <label className="label">Name</label>
            <input type="text" name="name" className="input w-full" placeholder="Full Name" />
            {error.name && <span className="text-error text-xs mt-1 block">{error.name}</span>}
          </div>

          {/* Email Field */}
          <div className="w-full">
            <label className="label">Email</label>
            <input type="email" name="email" className="input w-full" placeholder="email@example.com" />
            {error.email && <span className="text-error text-xs mt-1 block">{error.email}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Password Field */}
            <div className="w-full">
              <label className="label">Password</label>
              <input type="password" name="password" className="input w-full" placeholder="******" />
              {error.password && <span className="text-error text-xs mt-1 block">{error.password}</span>}
            </div>
            {/* Phone Field */}
            <div className="w-full">
              <label className="label">Phone</label>
              <input type="text" name="phoneNumber" className="input w-full" placeholder="01XXXXXXXXX" />
              {error.phoneNumber && <span className="text-error text-xs mt-1 block">{error.phoneNumber}</span>}
            </div>
          </div>

          {/* Address Field */}
          <div className="w-full">
            <label className="label">Address</label>
            <input type="text" name="address" className="input w-full" placeholder="Your Address" />
            {error.address && <span className="text-error text-xs mt-1 block">{error.address}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Gender Field */}
            <div className="w-full">
              <label className="label">Gender</label>
              <select name="gender" className="select w-full">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {error.gender && <span className="text-error text-xs mt-1 block">{error.gender}</span>}
            </div>

            {/* Role Field */}
            <div className="w-full">
              <label className="label">Role</label>
              <select name="role" className="select w-full">
                <option value="">Select</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
              {error.role && <span className="text-error text-xs mt-1 block">{error.role}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-neutral mt-6 w-full">
            Register
          </button>

          {/* Login Link */}
          <div className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/user/login" className="link link-primary">
              Login here
            </Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
}