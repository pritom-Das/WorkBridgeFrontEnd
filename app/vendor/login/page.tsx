"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
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
      // POST to /vendors/login
      const response = await axiosInstance.post('/vendors/login', result.data);
      
      if (response.status === 200 || response.status === 201) {
        // Redirect to dummy dashboard page
        alert("Login Successful!");
        router.push("/vendor/dashBoard");
      }
    } catch (err: any) {
      // Show error messages for invalid credentials or server issues
      setAuthError(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div>
      <Title text="Vendor Login" />
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '160px' }}>
        {authError && <p style={{ color: 'red', marginBottom: '10px' }}>{authError}</p>}
        
        <div>
          <label>Email: </label>
          <input type="email" name="email" style={{ border: '1px solid #ccc' }} />
          {error.email && <span style={{ color: 'red' }}> {error.email}</span>}
        </div>
        <br />
        
        <div>
          <label>Password: </label>
          <input type="password" name="password" style={{ border: '1px solid #ccc' }} />
          {error.password && <span style={{ color: 'red' }}> {error.password}</span>}
        </div>
        <br />
        
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}