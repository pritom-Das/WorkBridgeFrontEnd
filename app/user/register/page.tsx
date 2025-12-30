/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";
import { useState } from "react";
import { z } from "zod";
import Footer from "@/components/footer";
import Title from "@/components/Title";
 
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(11, { message: "Phone number must be at least 11 digits" }),
});
 
export default function VendorRegister() {
  const [error, setError] = useState<any>({});
 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    console.log("Register Success:", result.data);
    alert("Registration Successful!");
  };
 
  return (
    <div>
      <Title text="User Registration" />
      <form onSubmit={handleSubmit} style={{ textAlign: 'center',marginTop: '160px'}}>
 
        <div>
          <label>Name: </label>
          <input type="text" name="name" style={{ border: '1px solid #ccc' }} />
          {error.name && <span style={{ color: 'red' }}> {error.name}</span>}
        </div>
        <br />
 
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
 
        <div>
          <label>Address: </label>
          <input type="text" name="address" style={{ border: '1px solid #ccc' }} />
          {error.address && <span style={{ color: 'red' }}> {error.address}</span>}
        </div>
        <br />
 
        <div>
          <label>Phone: </label>
          <input type="text" name="phone" style={{ border: '1px solid #ccc' }} />
          {error.phone && <span style={{ color: 'red' }}> {error.phone}</span>}
        </div>
        <br />

 
        <button type="submit" className="login-btn">Register</button>
      </form>
      <div>
        <Footer />
      </div>
    </div>
   
  );
}
 