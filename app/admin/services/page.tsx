"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  isApproved: boolean;
  vendor: {
    name: string;
    email: string;
  };
  approvedBy?: {
    name: string;
  };
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/services', { withCredentials: true });
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Approval Logic
  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: "Approve this service?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      confirmButtonColor: "#22c55e",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:3000/admin/approve-service/${id}`, {}, { withCredentials: true });
        
        Swal.fire("Approved!", "Service is now live.", "success");
        // Refresh the list to show updated status and admin name
        fetchServices(); 
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Failed to approve", "error");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Services...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Service Management</h1>
      
      <div className="overflow-x-auto rounded-lg border border-base-300 shadow-sm">
        <table className="table table-zebra w-full">
          {/* Head */}
          <thead className="bg-base-200">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Vendor Details</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="hover">
              
                <td>
                  <div className="font-bold">{service.title}</div>
                  <div className="text-xs opacity-50">{service.description}</div>
                </td>

                {/* Price */}
                <td>${service.price}</td>

                {/* Vendor Info */}
                <td>
                  <div className="text-sm font-semibold">{service.vendor.name}</div>
                  <div className="text-xs italic">{service.vendor.email}</div>
                </td>

                {/* Status Badge */}
                <td>
                  {service.isApproved ? (
                    <span className="badge badge-success badge-outline">Approved</span>
                  ) : (
                    <span className="badge badge-warning badge-outline">Pending</span>
                  )}
                </td>

                {/* Approved By */}
                <td>
                  {service.isApproved ? (
                    <span className="text-sm font-medium text-primary">
                      {service.approvedBy?.name || "Admin"}
                    </span>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
                </td>

                {/* Action Button */}
                <td>
                  {!service.isApproved ? (
                    <button 
                      onClick={() => handleApprove(service.id)}
                      className="btn btn-success btn-xs"
                    >
                      Approve
                    </button>
                  ) : (
                    <button className="btn btn-disabled btn-xs">No Action</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}