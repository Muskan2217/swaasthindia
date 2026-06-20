// src/components/doctor-profile/ReviewsSection.tsx
import type { PatientReview, DoctorProfile } from "@/lib/doctor-profile-data";
import { Star, MessageSquare } from "lucide-react";

interface Props {
  reviews: PatientReview[];
  rating: DoctorProfile["rating"];
  reviewCount: DoctorProfile["reviewCount"];
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function RatingSummary({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const bars = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 6  },
    { stars: 2, pct: 2  },
    { stars: 1, pct: 2  },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-[#F7F8FC] rounded-2xl p-5 mb-5">
      {/* Big number */}
      <div className="flex flex-col items-center flex-shrink-0">
        <span className="text-5xl font-extrabold text-[#0D1B3E]">{rating}</span>
        <StarRating rating={rating} size={16} />
        <span className="text-xs text-gray-500 mt-1">{reviewCount} reviews</span>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 w-full space-y-1.5">
        {bars.map(({ stars, pct }) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-4 text-right">{stars}</span>
            <Star size={11} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-6">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: PatientReview }) {
  return (
    <div className="bg-[#F7F8FC] rounded-xl p-4">
      <div className="flex items-start gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: review.avatarColor }}
        >
          {review.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#0D1B3E]">{review.patientName}</p>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          <StarRating rating={review.rating} size={12} />
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}

export default function ReviewsSection({ reviews, rating, reviewCount }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-[#1A3FA4]" />
        <h2 className="text-lg font-bold text-[#0D1B3E]">Patient Reviews</h2>
      </div>

      <RatingSummary rating={rating} reviewCount={reviewCount} />

      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <button className="mt-4 w-full text-sm font-semibold text-[#1A3FA4] border border-[#1A3FA4]/20 rounded-xl py-2.5 hover:bg-blue-50 transition-colors">
        View All Reviews
      </button>
    </div>
  );
}
