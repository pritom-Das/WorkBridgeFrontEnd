"use client";

import Title from "@/components/Title";
import { useParams } from "next/navigation"; 

export default function ServicePage() {
  const { id } = useParams();

  return (
    <div>
      <Title text="Vendor service" />
      <p>Service ID: {id}</p>
    </div>
  );
}