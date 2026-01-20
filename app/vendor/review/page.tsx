"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/(util)/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VendorReviewsPage() {
  const [servicesWithReviews, setServicesWithReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        router.push("/vendor/login");
        return;
      }

      try { 
        const response = await axiosInstance.get(`/vendors/${vendorId}/reviews`);
        setServicesWithReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [router]);
 
  const isVerified = (review: any, serviceOrders: any[]) => { 
    if (!review.customer || !serviceOrders || serviceOrders.length === 0) {
      return false; 
    } 
    return serviceOrders.some((order: any) => order.customer?.id === review.customer.id);
  };

  if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 p-8" data-theme="light">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/vendor/dashBoard" className="btn btn-outline bg-white">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-700">Customer Reviews</h1>
      </div>

      {servicesWithReviews.length === 0 ? (
        <div className="alert alert-info max-w-5xl mx-auto shadow-md">
          <span>No reviews received yet.</span>
        </div>
      ) : (
        <div className="grid gap-8 max-w-5xl mx-auto">
          {servicesWithReviews.map((service) => (
            <div key={service.id} className="card bg-base-100 shadow-xl border border-gray-200">
              <div className="card-body">
                
                {/* Service Name & Price */}
                <h2 className="card-title text-2xl border-b pb-3 mb-4 flex justify-between">
                  <span>Service: <span className="text-primary">{service.title}</span></span>
                  <span className="text-sm text-gray-500 font-normal">৳{service.price}</span>
                </h2>

                {/* Reviews List */}
                <div className="space-y-4">
                  {service.reviews.map((review: any) => {
                     
                    const verified = isVerified(review, service.orders);

                    return (
                      <div key={review.id} className="bg-base-200 p-4 rounded-xl relative">
                         
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                             
                            <div className="flex items-center gap-2">
                              <div className="rating rating-sm">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <input 
                                    key={star} 
                                    type="radio" 
                                    className="mask mask-star-2 bg-orange-400" 
                                    checked={star === review.rating} 
                                    readOnly 
                                  />
                                ))}
                              </div>
                              <span className="font-bold text-gray-700">{review.rating}/5</span>
                            </div>
 
                            {verified && (
                              <div className="badge badge-success gap-1 text-white text-xs font-semibold shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-3 h-3 stroke-current">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Verified Purchase
                              </div>
                            )}
                          </div>

                          {/* Date */}
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Comment */}
                        <p className="text-gray-700 italic">"{review.comment || "No comment."}"</p>

                        {/* Customer Name */}
                        <div className="text-right text-xs text-gray-500 font-bold mt-2">
                          — {review.customer ? review.customer.name : "Anonymous"}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}