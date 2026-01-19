"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/(util)/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        router.push("/vendor/login");
        return;
      }

      try {
        // AXIOS REQUEST #4: Get Vendor Profile
        const response = await axiosInstance.get(`/vendors/${vendorId}/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        alert("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 p-8" data-theme="light">
      {/* Navigation Bar */}
      <div className="mb-8">
        <Link href="/vendor/dashBoard" className="btn btn-outline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-4 border-b pb-2">My Profile</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label text-gray-500 font-bold text-sm">Full Name</label>
              <p className="text-xl">{profile?.name}</p>
            </div>

            <div>
              <label className="label text-gray-500 font-bold text-sm">Email Address</label>
              <p className="text-xl">{profile?.email}</p>
            </div>

            <div>
              <label className="label text-gray-500 font-bold text-sm">Phone Number</label>
              {/* ⚠️ Access nested profile object */}
              <p className="text-xl">{profile?.profile?.phone || "N/A"}</p>
            </div>

            <div>
              <label className="label text-gray-500 font-bold text-sm">Address</label>
              {/* ⚠️ Access nested profile object */}
              <p className="text-xl">{profile?.profile?.address || "N/A"}</p>
            </div> 
            
          </div>
        </div>
      </div>
    </div>
  );
}