"use client";

import { useState } from "react";
import { Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Dialog from "@/components/dialogs/dialog";
import Button from "@/components/buttons/button";
import { submitReview } from "@/service/public/review.service";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/token/cookie_utils";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSubmitted?: () => void;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  productId,
  onSubmitted,
}: ReviewFormModalProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if logged in
    const token = getToken();
    if (!token) {
      setError("Please sign in to submit a review.");
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
      return;
    }

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitReview({
        productId,
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
      onSubmitted?.();
      setTimeout(() => {
        onClose();
        // Reset form
        setRating(0);
        setComment("");
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="md">
      <div className="p-2">
        <h2 className="text-2xl font-bold text-black">Write a Review</h2>
        <p className="mt-2 text-sm text-light-slate">
          Share your clinical experience with this product to help others.
        </p>

        {success ? (
          <div className="mt-10 flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-black">Review Submitted!</h3>
            <p className="mt-2 text-sm text-light-slate">
              Thank you for your feedback. Your review will be visible once approved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-bold text-black">Overall Rating</label>
              <div className="mt-3 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="group transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        s <= (hoverRating || rating) ? "text-primary" : "text-slate-200"
                      }`}
                      fill={s <= (hoverRating || rating) ? "currentColor" : "none"}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-bold text-primary">
                    {rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="text-sm font-bold text-black">
                Your Clinical Feedback
              </label>
              <textarea
                id="comment"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the build quality? Did it meet your expectations in a clinical setting?"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 outline-none ring-primary/20 transition-all focus:border-primary focus:bg-white focus:ring-4"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-light-slate">
                <span>Minimum 10 characters</span>
                <span>{comment.length} characters</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 justify-center h-12"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-[2] justify-center h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
}
