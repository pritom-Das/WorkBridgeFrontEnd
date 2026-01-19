"use client";

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Vendor {
  id: number;
  name: string;
  email: string;
  services: any[];
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Vendors logic
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/vendors', {
          withCredentials: true,
        });
        setVendors(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // 2. DELETE Functionality
 const handleDelete = async (id: number) => {
  // 1. Show the Warning/Confirmation Dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this vendor deletion!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33", // Red for delete
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  });

  // 2. If the user confirmed
  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3000/admin/vendors/${id}`, {
        withCredentials: true,
      });

      // 3. Update the UI state
      setVendors((prevVendors) => prevVendors.filter((v) => v.id !== id));

      // 4. Show Success Message
      Swal.fire({
        title: "Deleted!",
        text: "The vendor has been removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err: any) {
      console.error("Delete error:", err);
      
      // 5. Show Error Message
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Something went wrong.",
        icon: "error"
      });
    }
  }
};

  if (loading) return <p className="p-10">Loading vendors list...</p>;
  if (error) return <p className="p-10 text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto p-10">
      <h1 className="text-2xl font-bold mb-5">Manage Vendors</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Active services</th>
            <th>Pending services</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="hover">
              <td>{vendor.id}</td>
              <td>{vendor.name}</td>
              <td>{vendor.email}</td>
              <td>
                <div className="badge badge-success gap-2">
                  {vendor.services ? vendor.services.filter(s => s.isApproved).length : 0}
                </div>
              </td>
              <td>
                <div className="badge badge-warning gap-2">
                  {vendor.services ? vendor.services.filter(s => !s.isApproved).length : 0}
                </div>
              </td>
              <td>
                {/* 4. Attach the handleDelete function */}
                <button 
                  onClick={() => handleDelete(vendor.id)}
                  className="btn btn-error btn-xs btn-outline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}