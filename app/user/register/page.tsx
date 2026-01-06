/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";
import { useState } from "react";
import { z } from "zod";
import Footer from "@/components/footer";
import Title from "@/components/title";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";
 
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),
  address: z.string().min(5, { message: "Address is required" }),
  phoneNumber: z.string().min(11, { message: "Phone number must be at least 11 digits" }),
    gender: z.string().refine(
    (val) => ['male', 'female', 'other'].includes(val),
    { message: "Please select a valid gender" }
  ),
    role: z.string().refine(
    (val) => ['customer', 'vendor'].includes(val),
    { message: "Please select a valid role" }
  )
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
      // Send data to backend POST /customer/register
      const response = await axiosInstance.post('/customer/register', result.data);
      
      if (response.status === 201 || response.status === 200) {
        alert("Registration Successful!");
        router.push("/user/login"); // Redirect to login page on success
      }
    } catch (err: any) {
      // Show error message if insertion fails
      console.log(err);
      setServerError(err.response?.data?.message || "An error occurred during registration.");
    }
  };
 
  return (
    <div>
      <Title text="User Registration" />
      {serverError && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{serverError}</p>}
      <form onSubmit={handleSubmit} style={{ textAlign: 'center',marginTop: '160px'}}>
 
        <div>
          <label>Name: </label>
          <input type="text" name="name" style={{ border: '1px solid #ccc' }} />
        </div>
        {error.name && <span style={{ color: 'red' }}> {error.name}</span>}
        <br />
 
        <div>
          <label>Email: </label>
          <input type="email" name="email" style={{ border: '1px solid #ccc' }} />
        </div>
        {error.email && <span style={{ color: 'red' }}> {error.email}</span>}
        <br />
 
        <div>
          <label>Password: </label>
          <input type="password" name="password" style={{ border: '1px solid #ccc' }} />
        </div>
        {error.password && <span style={{ color: 'red' }}> {error.password}</span>}
        <br />
 
        <div>
          <label>Address: </label>
          <input type="text" name="address" style={{ border: '1px solid #ccc' }} />
        </div>
        {error.address && <span style={{ color: 'red' }}> {error.address}</span>}
        <br />
 
        <div>
          <label>Phone: </label>
          <input type="text" name="phoneNumber" style={{ border: '1px solid #ccc' }} />
        </div>
        {error.phoneNumber && <span style={{ color: 'red' }}> {error.phoneNumber}</span>}
        <br />

        <div>
          <label>Gender: </label>
          <select name="gender" style={{ border: '1px solid #ccc' }}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {error.gender && <span style={{ color: 'red' }}> {error.gender}</span>}
        <br />

        <div>
          <label>Role: </label>
          <select name="role" style={{ border: '1px solid #ccc' }}>
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        {error.role && <span style={{ color: 'red' }}> {error.role}</span>}
        <br />

        <button type="submit" className="login-btn">Register</button>
      </form>
      <div>
        <Footer />
      </div>
    </div>
   
  );
}
 