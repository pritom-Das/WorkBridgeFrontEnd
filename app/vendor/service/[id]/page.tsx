"use client";

import Title from "@/components/title";
import { useParams } from "next/navigation"; 

export default function VendorServicePage() {
  const { id } = useParams();

  return (
    <div>
      <Title text="Vendor service" />
      <p>Vendor ID: {id}</p>
    </div>
  );
}