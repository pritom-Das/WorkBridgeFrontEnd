/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";

// Interface for type safety (Optional but good practice)
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/user/login");
        return;
      }

      try {
        // AXIOS REQUEST #5: Get All Services for this Vendor
        const response = await axiosInstance.get(`/customer/service`);
        setServices(response.data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);



  return (
    <div className="min-h-screen bg-base-200"  >
      {/* MAIN CONTENT - SERVICE CARDS */}
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">My Services</h1>
        
        {loading ? (
          <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : services.length === 0 ? (
          <div className="alert alert-info">You haven't created any services yet. Click "New Service" to get started!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
                <div className="card-body">
                  <h2 className="card-title justify-between">
                    {service.title}
                  
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{service.description}</p>
                  <div className="card-actions justify-between items-center mt-4 border-t pt-4">
                    <span className="text-2xl font-bold text-primary">৳ {service.price}</span>
                    <div className="flex justify-around gap-6">
                        <div><Link href={`/user/order/${service.id}`} className="btn btn-md btn-ghost border-gray-300">Order</Link></div>
                        <div><Link href={`/user/review/${service.id}`} className="btn btn-md btn-ghost border-gray-300">Review</Link></div>
                    </div>
                    
                  </div> 
                  <div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}