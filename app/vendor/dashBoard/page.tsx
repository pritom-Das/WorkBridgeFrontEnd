/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(util)/axios"; 
import Footer from "@/components/footer";

// Interface for type safety
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
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        router.push("/vendor/login");
        return;
      }

      try {
        const response = await axiosInstance.get(`/vendors/${vendorId}/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/vendors/logout');
      localStorage.removeItem("vendorId");
      router.push("/vendor/login");
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/vendor/login");
    }
  };

  return (
    // Change min-h-screen to flex col so footer stays at bottom
    <div className="min-h-screen flex flex-col bg-base-200">
      
      {/* NAVBAR */}
      <div className="navbar shadow-sm text-white" data-theme="dark">
        <div className="navbar-start">
          <a className="text-3xl px-4 font-bold">Work Bridge</a>
        </div>
        <div className="navbar-center lg:flex">
          <ul className="menu menu-horizontal px-1 gap-3 ">
            <li>
              <Link href="/vendor/service/create" className="btn btn-outline text-white hover:bg-white hover:text-gray-800">
                + New Service
              </Link>
            </li>
            <li> 
              <Link href="/vendor/review" className="btn btn-outline text-white hover:bg-white hover:text-gray-800 " >
                Review
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-3 px-4">
          <Link href="/vendor/profile" className="btn btn-outline text-white hover:bg-white hover:text-gray-800">
            Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-error text-white">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - Grow to fill space */}
      <div className="p-8 max-w-7xl mx-auto w-full flex-grow">
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
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{service.description}</p>
                  <div className="card-actions justify-between items-center mt-4 border-t pt-4">
                    <span className="text-2xl font-bold text-primary">৳ {service.price}</span>
                    <Link href={`/vendor/service/edit/${service.id}`} className="btn btn-sm btn-ghost border-gray-300">Edit Details</Link>
                  </div> 
                </div>
              </div>
            ))}
          </div>
        )}
      </div> 
      <Footer />
    </div>
  );
}