/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";

// Define the shape of the Service data
interface Service {
  id: string;
  title: string;
  description: string;
  price: string; // TypeORM decimals often come back as strings
}

export default function OrderPage() {
  const [service, setService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false); // To show loading state on the button
  
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string; // Get ID from URL

  // 1. Fetch Service Details on Load
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        // Calls your backend: @Get('service/:id')
        console.log("Fetching service details for ID:", serviceId);
        const response = await axiosInstance.get(`/customer/service/${serviceId}`);
        console.log("Service details fetched:", response.data);
        setService(response.data);
      } catch (error) {
        console.error("Failed to fetch service details", error);
        alert("Could not load service details.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // 2. Handle Order Submission
  const handleConfirmOrder = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please login first.");
      router.push("/user/login");
      return;
    }

    setOrdering(true);

    try {
      // Backend expects: POST /customer/order/:userId
      // Body: { serviceId: string, quantity: number }
      const payload = {
        serviceId: serviceId,
        quantity: Number(quantity),
      };

      await axiosInstance.post(`/customer/order/${userId}`, payload);

      // Success Feedback
      alert("✅ Service ordered successfully!");
      
      // Redirect to Home/Service page
      router.push("/user/service"); 

    } catch (error: any) {
      console.error("Order failed", error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setOrdering(false);
    }
  };

  // Helper to calculate total price
  const unitPrice = service ? parseFloat(service.price) : 0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!service) {
    return <div className="p-10 text-center">Service not found.</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-2">Confirm Order</h2>
          
          {/* Service Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h3 className="font-semibold text-lg text-primary">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            <div className="mt-2 font-bold text-gray-700">
              Unit Price: ৳ {unitPrice}
            </div>
          </div>

          {/* Quantity Input Section */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Quantity</span>
            </label>
            <input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="input input-bordered w-full" 
            />
          </div>

          {/* Total Price Display */}
          <div className="divider"></div>
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-primary">৳ {totalPrice}</span>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end ">
            <button 
              className="btn btn-soft btn-primary" 
              onClick={() => router.back()}
              disabled={ordering}
            >
              Cancel
            </button>
            <button 
              className="btn btn-soft btn-primary"
              onClick={handleConfirmOrder}
              disabled={ordering}
            >
              {ordering ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Confirm Purchase"
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}