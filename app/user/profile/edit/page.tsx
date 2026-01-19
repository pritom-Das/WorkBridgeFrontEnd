/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import Title from "@/components/title";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";

// 1. Define the Validation Schema (Similar to Register)
const updateProfileSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(5, { message: "Address is required" }),
  phoneNumber: z.string().min(11, { message: "Phone number must be at least 11 digits" }),
  gender: z.string().refine(
    (val) => ['male', 'female', 'other'].includes(val),
    { message: "Please select a valid gender" }
  )
});

export default function EditProfile() {
  const [error, setError] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const router = useRouter();

  // Fetch current user data to pre-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/user/login");
        return;
      }

      try {
        const response = await axiosInstance.get(`/customer/profile/${userId}`);
        setInitialData(response.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setServerError("Error loading profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // 2. Validate using Zod (Same method as Register)
    const result = updateProfileSchema.safeParse(data);

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
    const userId = localStorage.getItem("userId");

    try {
      // 3. Send update request
      const response = await axiosInstance.post(`/customer/profile/${userId}/updateProfile`, result.data);

      if (response.status === 200 || response.status === 201) {
        alert("Profile updated successfully!");
        router.push("/user/profile");
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || "An error occurred during update.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-base-200" data-theme="light">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <fieldset className="fieldset bg-base-100 p-6 rounded-box shadow-lg">
          <legend className="fieldset-legend text-2xl font-bold">Edit Profile</legend>

          {serverError && (
            <div className="alert alert-error text-sm mb-4">
              <span>{serverError}</span>
            </div>
          )}

          {/* Name */}
          <label className="label">Full Name</label>
          <input 
            name="name" 
            type="text" 
            defaultValue={initialData?.name}
            className="input input-bordered w-full" 
            placeholder="Your Name" 
          />
          {error.name && <span className="text-error text-xs">{error.name}</span>}

          {/* Email */}
          <label className="label">Email Address</label>
          <input 
            name="email" 
            type="email" 
            defaultValue={initialData?.email}
            className="input input-bordered w-full" 
            placeholder="email@example.com" 
          />
          {error.email && <span className="text-error text-xs">{error.email}</span>}

          {/* Gender */}
          <label className="label">Gender</label>
          <select 
            name="gender" 
            defaultValue={initialData?.gender}
            className="select select-bordered w-full"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {error.gender && <span className="text-error text-xs">{error.gender}</span>}

          {/* Phone */}
          <label className="label">Phone Number</label>
          <input 
            name="phoneNumber" 
            type="text" 
            defaultValue={initialData?.phoneNumber}
            className="input input-bordered w-full" 
            placeholder="017XXXXXXXX" 
          />
          {error.phoneNumber && <span className="text-error text-xs">{error.phoneNumber}</span>}

          {/* Address */}
          <label className="label">Address</label>
          <textarea 
            name="address" 
            defaultValue={initialData?.address}
            className="textarea textarea-bordered h-20 w-full" 
            placeholder="Your current address..."
          ></textarea>
          {error.address && <span className="text-error text-xs">{error.address}</span>}

          <div className="flex gap-2 mt-6">
            <button type="submit" className="btn btn-primary flex-1">Save Changes</button>
            <button type="button" onClick={() => router.push("/user/profile")} className="btn">Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}