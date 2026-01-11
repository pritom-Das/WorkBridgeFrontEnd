"use client";
import { useParams } from "next/navigation";

export default function AdminPage() {
  const params = useParams(); // { id: "whatever-is-in-url" }
  const adminId = params.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Page</h1>
      <p>Admin ID: {adminId}</p>
    </div>
  );
}
