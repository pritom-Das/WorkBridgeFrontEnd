"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa'; // Ensure react-icons is installed

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminManagement() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/alladmins', { withCredentials: true });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async (id: string, name: string, role: string) => {
    // 1. Prevent deleting Super-Admins from the UI
    if (role === 'super-admin') {
      Swal.fire("Action Denied", "Super Admins cannot be deleted.", "warning");
      return;
    }

    // 2. Confirmation Dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to remove ${name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/admin/delete/${id}`, { withCredentials: true });
        
        Swal.fire("Deleted!", "The admin has been removed.", "success");
        fetchAdmins(); // Refresh the list
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Failed to delete admin", "error");
      }
    }
  };

  const validateForm = () => {
    const { name, password } = formData;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      Swal.fire("Invalid Name", "Name must contain only letters and spaces", "error");
      return false;
    }
    if (password.length < 6) {
      Swal.fire("Short Password", "Password must be at least 6 characters long", "error");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/;
    if (!passwordRegex.test(password)) {
      Swal.fire("Weak Password", "Must contain at least one uppercase letter and one special character", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/admin/create', formData, { withCredentials: true });
      Swal.fire({ title: "Success!", text: "Admin added successfully", icon: "success", timer: 1500, showConfirmButton: false });
      setFormData({ name: '', email: '', password: '' }); 
      fetchAdmins();
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create admin", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDE: FORM */}
        <div className="lg:col-span-4">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-primary mb-4">Add Admin</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Full Name</span></label>
                  <input type="text" placeholder="John Doe" className="input input-bordered focus:input-primary" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Email Address</span></label>
                  <input type="email" placeholder="admin@workbridge.com" className="input input-bordered focus:input-primary" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Temporary Password</span></label>
                  <input type="password" placeholder="••••••••" className="input input-bordered focus:input-primary" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
                <button type="submit" className={`btn btn-primary w-full mt-4 ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? 'Creating...' : 'Register Admin'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: TABLE */}
        <div className="lg:col-span-8">
          <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
            <div className="p-6 bg-base-100 border-b border-base-300 flex justify-between items-center">
              <h2 className="text-xl font-bold">System Administrators</h2>
              <div className="badge badge-primary">{admins.length} Admins</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Admin Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover">
                      <td><div className="font-bold">{admin.name}</div></td>
                      <td className="text-sm opacity-70">{admin.email}</td>
                      <td>
                        <span className={`badge badge-sm ${admin.role === 'super-admin' ? 'badge-secondary' : 'badge-ghost'}`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="text-xs">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        {admin.role !== 'super-admin' && (
                          <button 
                            onClick={() => handleDelete(admin.id, admin.name, admin.role)}
                            className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                            title="Delete Admin"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}