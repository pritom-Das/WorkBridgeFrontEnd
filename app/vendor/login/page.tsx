"use client";
import Title from "@/components/Title";
import { useState } from "react";
import z from "zod";

 
const loginSchema = z.object({
  email: z.string().email({message:"Invalid email"}),
  password: z.string().min(6, {message:"Password must be at least 6 characters"}),
});

export default function VendorPage() {
  const [error, setError] = useState<any>({});

  const handleSubmit =  (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);

  const result = loginSchema.safeParse(data);
    if (!result.success) {
       const err: any = {};
      result.error.issues.forEach(i => {err[i.path[0]] = i.message});
      
      setError(err);
      return;
    } 
    setError({});
    console.log("Success:", result.data);
  };

  return (
    <div>
       <Title text="Vendor Login"/>
      <form onSubmit={handleSubmit} style={{textAlign: 'center', marginTop: '160px'}}>
        <div>
          <label>Email: </label>
          <input type="email" name="email" style={{ border: '1px solid #ccc' }}/> 
          {error.email && <span style={{color: 'red'}}> {error.email}</span>}
        </div>
        <br/>
        <div>
          <label>Password: </label>
          <input type="password" name="password" style={{ border: '1px solid #ccc' }}/>
          {error.password && <span style={{color: 'red'}}> {error.password}</span>}
        </div>
        <br/>
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}
