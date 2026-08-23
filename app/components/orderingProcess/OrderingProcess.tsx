import * as React from "react";
import { Check } from "lucide-react";

// config
import { CHECKOUT_STEPS } from "@/app/config/checkoutSteps.config";

export type CheckoutStep = 1 | 2 | 3;

interface OrderingProcessProps {
  currentStep: CheckoutStep;
}

export default function OrderingProcess({ currentStep }: OrderingProcessProps) {
  return (
    <nav
      aria-label="Tiến trình đặt hàng"
      className="my-6 flex items-center justify-center gap-2 sm:gap-3"
    >
      {CHECKOUT_STEPS.map((item, index) => {
        const isCompleted = currentStep > item.step;
        const isActive = currentStep === item.step;

        return (
          <React.Fragment key={item.step}>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  isCompleted || isActive
                    ? "bg-(--primaryCus) text-white"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 stroke-3" />
                ) : (
                  item.step
                )}
              </span>

              <span
                className={`text-xs font-bold transition-colors ${
                  isActive
                    ? "text-(--primaryCus)"
                    : isCompleted
                      ? "text-neutral-800"
                      : "text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </div>

            {index < CHECKOUT_STEPS.length - 1 && (
              <div
                className={`h-px w-6 transition-colors sm:w-10 ${
                  currentStep > item.step
                    ? "bg-(--primaryCus)"
                    : "bg-neutral-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
