import { Check, Circle } from "lucide-react";

export const checkItemForm = (isValid: boolean, text: string) => (
  <div className="flex items-center gap-1.5 transition-all duration-200">
    {isValid ? (
      <Check className="h-3 w-3 shrink-0 text-emerald-500" />
    ) : (
      <Circle className="h-2.5 w-2.5 shrink-0 text-neutral-300" />
    )}
    <span
      className={`text-[11px] transition-colors duration-200 ${
        isValid ? "font-medium text-emerald-600" : "text-neutral-400"
      }`}
    >
      {text}
    </span>
  </div>
);
