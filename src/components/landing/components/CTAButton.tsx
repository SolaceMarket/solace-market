"use client";

import { useState } from "react";

export function CTAButton() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleGetStarted = () => {
    if (!showEmailInput) {
      setShowEmailInput(true);
      return;
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual waitlist API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setIsSubscribed(true);
      setEmail("");
      setShowEmailInput(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      console.error("Failed to subscribe to waitlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="mb-6">
        <div className="text-emerald-400 px-12 py-4 md:px-16 md:py-5 rounded-xl font-semibold text-lg md:text-xl w-fit mx-auto block border-2 border-emerald-400/30 bg-emerald-400/10">
          ✓ Thanks! You're on the waitlist
        </div>
      </div>
    );
  }

  if (showEmailInput) {
    return (
      <div className="mb-6 space-y-4">
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white px-6 py-3 rounded-xl font-semibold text-lg transition-transform duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-gradient-flow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setShowEmailInput(false)}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={handleGetStarted}
        className="text-white px-12 py-4 md:px-16 md:py-5 rounded-xl font-semibold text-lg md:text-xl transition-transform duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-fit mx-auto block animate-gradient-flow"
      >
        Get Started
      </button>
    </div>
  );
}
