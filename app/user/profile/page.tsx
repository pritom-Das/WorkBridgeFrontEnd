/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Title from "@/components/title";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/(util)/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

const handleDelete = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  if (confirm("Are you sure you want to delete your account?")) {
    try {
      // 1. Delete from DB
      await axiosInstance.delete(`/customer/profile/delete/${userId}`);
      
      // 2. Clear EVERYTHING from localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole"); // Navbar depends on this!
      localStorage.clear(); // Safety measure to clear all keys
      alert("Account deleted successfully.");
      window.location.href = "/"; 
    } catch (error) {
      console.error("Delete failed", error);
    }
  }
};


  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/user");
        return;
      }
 
      try {
        // AXIOS REQUEST #4: Get User Profile
        const response = await axiosInstance.get(`/customer/profile/${userId}`);
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
    <div>


        <div className="min-h-screen bg-base-200 p-8" data-theme="light">

 
      <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-4 border-b pb-2">My Profile</h2>
         
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label text-gray-500 font-bold text-sm">Full Name</label>
              <p className="text-xl">{profile?.name}</p>
            </div>

             <div>
              <label className="label text-gray-500 font-bold text-sm">Gender</label>
              <p className="text-xl">{profile?.gender || "N/A"}</p>
            </div>

            <div>
              <label className="label text-gray-500 font-bold text-sm">Email Address</label>
              <p className="text-xl">{profile?.email}</p>
            </div>
 
            <div>
              <label className="label text-gray-500 font-bold text-sm">Phone Number</label>
              <p className="text-xl">{profile?.phoneNumber || "N/A"}</p>
            </div>
 
            <div>
              <label className="label text-gray-500 font-bold text-sm">Address</label>
              <p className="text-xl">{profile?.address || "N/A"}</p>
            </div>

              <div>
              <label className="label text-gray-500 font-bold text-sm">Role</label>
              <p className="text-xl">{profile?.role || "N/A"}</p>
            </div>


           <div className="mt-6 flex space-x-4 justify-between">
            <Link href="/user/profile/edit" className="btn btn-primary mr-2">Edit Profile</Link>
            <button className="btn btn-secondary" onClick={handleDelete}>
              Delete Account</button>
           </div>
          </div>
        </div>
      </div>
    </div>




    </div>
    
);
}