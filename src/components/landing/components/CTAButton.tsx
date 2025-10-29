import Link from "next/link";

export function CTAButton() {
  return (
    <div className="mb-6">
      <Link
        href="/onboarding"
        className="text-white px-16 py-5 rounded-xl font-semibold text-xl transition-transform duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-fit mx-auto block animate-gradient-flow"
      >
        Get Started
      </Link>
    </div>
  );
}
