/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simple frontend validation
  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/login", 
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { 
          withCredentials: true 
        }
      );

      console.log("Login successful:", res.data);

      // 1. SAVE the role so the Navbar can find it
      localStorage.setItem("userRole", res.data.role); 

      // 2. REDIRECT using window.location to force Navbar to refresh
      window.location.href = "/admin/vendors"; 

    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen " data-theme="light">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Admin Login</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <label className="label mt-4">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}

              <button type="submit" className="btn btn-neutral mt-4 w-full">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}