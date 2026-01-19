/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axiosInstance from "@/app/(util)/axios";

// Zod Schema
const serviceSchema = z.object({
  title: z.string().min(3, "Service title is too short"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  price: z.string().regex(/^\d+$/, "Price must be a number"), 
});

export default function CreateServicePage() {
  const [error, setError] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true); // 1. Add Loading State
  const [vendorId, setVendorId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("vendorId");
    
    if (!id) {
      // 2. If no ID, redirect immediately without showing the form
      // You can keep the alert if you want, but often a silent redirect is smoother
      alert("Please login first"); 
      router.push("/vendor/login");
    } else {
      // 3. If ID exists, stop loading and show the form
      setVendorId(id);
      setIsLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData);

    const result = serviceSchema.safeParse(rawData);
    if (!result.success) {
      const err: any = {};
      result.error.issues.forEach(i => { err[i.path[0]] = i.message });
      setError(err);
      return;
    }

    setError({});

    try {
      const payload = { 
        title: result.data.title,         
        description: result.data.description,
        price: Number(result.data.price)  
      };
      
      await axiosInstance.post(`/vendors/${vendorId}/services`, payload);
      
      alert("Service Created Successfully!");
      router.push("/vendor/dashBoard");
      
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create service");
    }
  };

  // 4. BLOCK RENDER: If loading, show nothing (or a spinner)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 5. Normal Render (Only happens after check passes)
  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-base-200" data-theme="light">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <fieldset className="fieldset bg-base-100 p-6 rounded-box shadow-lg">
          <legend className="fieldset-legend text-2xl font-bold">Create New Service</legend>

          <label className="label">Service Title</label>
          <input 
            name="title" 
            type="text" 
            className="input input-bordered w-full" 
            placeholder="e.g. AC Repair" 
          />
          {error.title && <span className="text-error text-xs">{error.title}</span>}

          <label className="label">Price (BDT)</label>
          <input 
            name="price" 
            type="number" 
            className="input input-bordered w-full" 
            placeholder="e.g. 500" 
          />
          {error.price && <span className="text-error text-xs">{error.price}</span>}

          <label className="label">Description</label>
          <textarea 
            name="description" 
            className="textarea textarea-bordered h-24 w-full" 
            placeholder="Describe the service..."
          ></textarea>
          {error.description && <span className="text-error text-xs">{error.description}</span>}

          <button type="submit" className="btn btn-primary mt-4 w-full">Publish Service</button>
        </fieldset>
      </form>
    </div>
  );
}