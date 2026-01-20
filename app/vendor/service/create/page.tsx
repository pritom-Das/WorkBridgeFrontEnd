 
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axiosInstance from "@/app/(util)/axios";
 
const serviceSchema = z.object({
  title: z.string().min(3, "Service title is too short"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  price: z.string().regex(/^\d+$/, "Price must be a number"), 
});

export default function CreateServicePage() {
  const [error, setError] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("vendorId");
    
    if (!id) {
      alert("Please login first"); 
      router.push("/vendor/login");
    } else {
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-8" data-theme="light">
       
      <div className="mb-8">
        <Link href="/vendor/dashBoard" className="btn btn-outline bg-white">
          ← Back to Dashboard
        </Link>
      </div>
 
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-base-100 p-8 rounded-box shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Service</h2>
          
          <form onSubmit={handleSubmit}>
            
            {/* Title Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text text-gray-500">Service Title</span>
              </label>
              <input 
                name="title" 
                type="text" 
                className="input input-bordered w-full bg-white" 
                placeholder="e.g. AC Repair" 
              />
              {error.title && <span className="text-error text-xs mt-1">{error.title}</span>}
            </div>

            {/* Price Field */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text text-gray-500">Price (BDT)</span>
              </label>
              <input 
                name="price" 
                type="number" 
                className="input input-bordered w-full bg-white" 
                placeholder="e.g. 500" 
              />
              {error.price && <span className="text-error text-xs mt-1">{error.price}</span>}
            </div>

            {/* Description Field */}
            <div className="form-control w-full mb-8">
              <label className="label">
                <span className="label-text text-gray-500">Description</span>
              </label>
              <textarea 
                name="description" 
                className="textarea textarea-bordered h-32 w-full bg-white text-base" 
                placeholder="Describe the service..."
              ></textarea>
              {error.description && <span className="text-error text-xs mt-1">{error.description}</span>}
            </div>

            {/* Publish Button */}
            <button type="submit" className="btn btn-primary w-full text-white text-lg font-bold">
              Publish Service
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}