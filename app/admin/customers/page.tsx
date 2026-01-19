"use client";

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface customers {
  id: number;
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  isActive: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<customers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Customers logic
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/customers', {
          withCredentials: true,
        });
        setCustomers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
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
      await axios.delete(`http://localhost:3000/admin/customer/${id}`, {
        withCredentials: true,
      });

      // 3. Update the UI state
      setCustomers((prevCustomers) => prevCustomers.filter((c) => c.id !== id));

      // 4. Show Success Message
      Swal.fire({
        title: "Deleted!",
        text: "The customer has been removed.",
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
      <h1 className="text-2xl font-bold mb-5">Manage Customers</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
           
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover">
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.gender}</td>
              <td>{customer.phoneNumber}</td>        
              <td>
                {/* 4. Attach the handleDelete function */}
                <button 
                  onClick={() => handleDelete(customer.id)}
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