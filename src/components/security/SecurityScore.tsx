import { Shield } from "lucide-react";
import { GlowEffect } from "@/components/ui";
import { getScoreColor } from "@/data/securityData";

interface SecurityScoreProps {
  score: number;
}

export function SecurityScore({ score }: SecurityScoreProps) {
  return (
    <GlowEffect variant="modal" glowColor="emerald" intensity="subtle">
      <div className="bg-slate-800/90 backdrop-blur rounded-xl p-6 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Shield className="w-6 h-6 mr-2 text-emerald-400" />
            Security Score
          </h2>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              score >= 80
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                : score >= 60
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">
          {score >= 80
            ? "Excellent security! Your account is well protected."
            : score >= 60
              ? "Good security. Consider enabling more features."
              : "Improve your security by enabling additional features."}
        </p>
      </div>
    </GlowEffect>
  );
}
