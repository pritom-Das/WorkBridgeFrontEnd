"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";  
import axiosInstance from "@/app/(util)/axios";
import { z } from "zod";
 
const serviceSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  price: z.any(), 
});

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>({});
 
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axiosInstance.get(`/vendors/service/${params.id}`);
        const data = response.data;
        
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
        });
      } catch (err) {
        console.error("Failed to fetch service", err);
        alert("Could not load service details");
        router.push("/vendor/dashBoard");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchService();
  }, [params.id, router]);
 
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     
    const result = serviceSchema.safeParse(formData);
    if (!result.success) {
      const err: any = {};
      result.error.issues.forEach(i => { err[i.path[0]] = i.message });
      setError(err);
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      await axiosInstance.put(`/vendors/service/${params.id}`, payload);
      
      alert("Service Updated Successfully!");
      router.push("/vendor/dashBoard");

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update service");
    }
  };

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 p-8" data-theme="light">
      
     
      <div className="mb-8">
        <Link href="/vendor/dashBoard" className="btn btn-outline bg-white">
          ← Back to Dashboard
        </Link>
      </div>
 
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-base-100 p-8 rounded-box shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Service</h2>
          
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
                value={formData.title}
                onChange={handleChange}
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
                value={formData.price}
                onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {error.description && <span className="text-error text-xs mt-1">{error.description}</span>}
            </div>

            {/* Update Button */}
            <button type="submit" className="btn btn-primary w-full text-white text-lg font-bold">
              Update Service
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}