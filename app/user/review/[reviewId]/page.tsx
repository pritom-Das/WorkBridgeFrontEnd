/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/(util)/axios";

// Interface for Service Data
interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
}

export default function ReviewPage() {
  const [service, setService] = useState<Service | null>(null);
  
  // Form State
  const [rating, setRating] = useState<number>(5); // Default 5 stars
  const [comment, setComment] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const serviceId = params.reviewId as string;

  // 1. Fetch Service Details on Load
// 1. Fetch Service Details on Load
  useEffect(() => {
    // Debugging: Check if ID exists
    console.log("Current URL Params:", params); 
    console.log("Service ID found:", serviceId);

    if (!serviceId) {
      console.error("No Service ID found in URL!");
      setLoading(false); // Stop loading so we see the empty state
      return;
    }

    const fetchServiceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/customer/service/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error("Failed to fetch service details", error);
        // Optional: Redirect if 404
        // router.push('/404'); 
      } finally {
        setLoading(false); // Stop loading regardless of success/fail
      }
    };

    fetchServiceDetails();
  }, [serviceId, params]);

  // 2. Handle Review Submission
  const handleSubmitReview = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      router.push("/user/login");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a short comment.");
      return;
    }

    setSubmitting(true);

    try {
      // Backend Endpoint: @Post('review/service/:customerId/:serviceId')
      // Body: { rating: number, comment: string } matches ReviewDto
      const payload = {
        rating: Number(rating),
        comment: comment,
      };

      await axiosInstance.post(`/customer/review/service/${userId}/${serviceId}`, payload);

      alert("✅ Review posted successfully!");
      router.push("/user/service"); // Redirect back to services

    } catch (error: any) {
      console.error("Review failed", error);
      alert(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 className="card-title text-2xl font-bold mb-4">Write a Review</h2>
          
          {/* Service Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <h3 className="font-semibold text-lg text-primary">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{service.description}</p>
          </div>

          {/* Rating Input (DaisyUI Rating Component) */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Rating</span>
            </label>
            <div className="rating rating-lg gap-1 pl-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <input 
                  key={star}
                  type="radio" 
                  name="rating-2" 
                  className="mask mask-star-2 bg-orange-400" 
                  checked={rating === star}
                  onChange={() => setRating(star)}
                />
              ))}
            </div>
            <label className="label">
              <span className="label-text-alt pl-5">{rating} out of 5 stars</span>
            </label>
          </div>

          {/* Comment Input */}
          <div className="form-control w-full mb-6">
            <label className="label pr-5">
              <span className="label-text font-semibold">Comment</span>
            </label>
            <textarea 
              className="textarea textarea-bordered h-24" 
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end gap-3">
            <button 
              className="btn btn-soft btn-primary" 
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              className="btn btn-soft btn-primary px-8"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}