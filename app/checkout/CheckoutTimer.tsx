"use client";

import * as React from "react";
import { Clock } from "lucide-react";

interface CheckoutTimerProps {
  initialSeconds: number;
  onExpire: () => void;
}

export const CheckoutTimer = React.memo(
  ({ initialSeconds, onExpire }: CheckoutTimerProps) => {
    const [timeLeft, setTimeLeft] = React.useState(initialSeconds);

    React.useEffect(() => {
      if (timeLeft <= 0) {
        onExpire();
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [timeLeft, onExpire]);

    if (timeLeft <= 0) return null;

    const m = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");

    return (
      <div className="animate-in slide-in-from-top-4 fade-in mb-6 flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm font-medium text-blue-800 shadow-sm backdrop-blur-sm">
        <Clock size={18} className="animate-pulse text-blue-600" />
        <span>Sản phẩm và ưu đãi đang được giữ an toàn cho bạn trong:</span>
        <span className="text-base font-bold tracking-wider text-red-600">
          {m}:{s}
        </span>
      </div>
    );
  },
);

CheckoutTimer.displayName = "CheckoutTimer";
