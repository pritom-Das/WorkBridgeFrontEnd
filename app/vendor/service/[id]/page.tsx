"use client";

import Title from "@/components/Title";
import { useParams } from "next/navigation"; 

export default function LibrarianPage() {
  const { id } = useParams();

  return (
    <div>
      <Title text="Vendor service" />
      <p>Vendor ID: {id}</p>
    </div>
  );
}