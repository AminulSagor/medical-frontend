"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Star, ThumbsUp, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { 
  getProductReviews, 
  getProductRatingSummary,
  markReviewHelpful 
} from "@/service/public/review.service";
import { 
  Review, 
  ReviewSummary, 
  ReviewsResponse 
} from "@/types/review/review.types";
import ReviewFormModal from "./review-form-modal";
import { format } from "date-fns";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [meta, setMeta] = useState<ReviewsResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [reviewsData, summaryData] = await Promise.all([
        getProductReviews(productId, { page, limit: 5 }),
        getProductRatingSummary(productId)
      ]);
      
      setReviews(reviewsData.items);
      setMeta(reviewsData.meta);
      setSummary(summaryData);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleHelpful = async (reviewId: string) => {
    if (helpfulIds.has(reviewId)) return;
    
    try {
      await markReviewHelpful(reviewId);
      setHelpfulIds(prev => new Set(prev).add(reviewId));
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      ));
    } catch (err) {
      console.error("Failed to mark review as helpful:", err);
    }
  };

  const onReviewSubmitted = () => {
    fetchData(); // Refresh reviews after submission
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="mt-16 border-t border-slate-100 pt-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Side: Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>
          
          {summary && (
            <div className="mt-6">
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-black">
                  {parseFloat(summary.averageRating).toFixed(1)}
                </span>
                <div className="mb-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={s <= Math.round(parseFloat(summary.averageRating)) ? "text-primary" : "text-slate-200"}
                        fill={s <= Math.round(parseFloat(summary.averageRating)) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-light-slate">
                    Based on {summary.reviewsCount} reviews
                  </p>
                </div>
              </div>

              {/* distribution bars */}
              <div className="mt-8 space-y-3">
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = summary.ratingDistribution[s as keyof ReviewSummary["ratingDistribution"]] || 0;
                  const percentage = summary.reviewsCount > 0 ? (count / summary.reviewsCount) * 100 : 0;
                  return (
                    <div key={s} className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-700 w-3">{s}</span>
                      <div className="relative h-2 flex-1 rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute h-full rounded-full bg-primary"
                        />
                      </div>
                      <span className="text-sm font-medium text-light-slate w-8 text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-slate-100 pt-10">
            <h3 className="text-lg font-bold text-black">Share your thoughts</h3>
            <p className="mt-2 text-sm text-light-slate leading-relaxed">
              Have you used this product? Your clinical feedback helps other practitioners make better decisions.
            </p>
            <Button 
              className="mt-6 w-full justify-center" 
              shape="pill"
              onClick={() => setIsModalOpen(true)}
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Right Side: Review List */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">
              User Feedback
              {meta ? <span className="ml-2 font-normal text-light-slate">({meta.total})</span> : null}
            </h3>
          </div>

          <div className="mt-8 space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                        {review.user.photo ? (
                          <img src={review.user.photo} alt={review.user.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary uppercase font-bold">
                            {review.user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-black">{review.user.name}</div>
                        <div className="text-xs text-light-slate">
                          {format(new Date(review.createdAt), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= review.rating ? "text-primary" : "text-slate-200"}
                          fill={s <= review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-slate-700">
                    {review.comment}
                  </p>

                  <div className="mt-6 flex items-center gap-6">
                    <button 
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-2 text-xs font-semibold transition ${
                        helpfulIds.has(review.id) ? "text-primary" : "text-light-slate hover:text-black"
                      }`}
                    >
                      <ThumbsUp size={14} />
                      Helpful ({review.helpfulCount})
                    </button>
                    <button className="flex items-center gap-2 text-xs font-semibold text-light-slate hover:text-black transition">
                      <MessageSquare size={14} />
                      Reply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <MessageSquare size={32} />
                </div>
                <h4 className="mt-4 text-lg font-bold text-black">No reviews yet</h4>
                <p className="mt-2 text-sm text-light-slate max-w-xs">
                  Be the first to review this product and share your experience with the community.
                </p>
                <Button className="mt-6" variant="secondary" onClick={() => setIsModalOpen(true)}>
                  Write the First Review
                </Button>
              </div>
            )}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="mt-10 flex justify-center border-t border-slate-100 pt-10">
               {/* Simplified pagination for now */}
               <div className="flex gap-2">
                 {[...Array(meta.totalPages)].map((_, i) => (
                   <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-10 w-10 rounded-xl font-bold transition ${
                      page === i + 1 ? "bg-primary text-white" : "bg-slate-50 text-light-slate hover:bg-slate-100"
                    }`}
                   >
                     {i + 1}
                   </button>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productId={productId}
        onSubmitted={onReviewSubmitted}
      />
    </section>
  );
}
