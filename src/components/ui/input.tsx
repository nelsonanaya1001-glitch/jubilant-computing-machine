import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * `tone` selects the surface the field sits on. Defaults to "light" so the
 * admin and client-portal screens keep their existing look; the dark marketing
 * pages opt in explicitly.
 */
export type FieldTone = "light" | "dark";

export const fieldStyles: Record<FieldTone, { label: string; control: string; error: string }> = {
  light: {
    label: "block text-sm font-medium text-gray-700 mb-1.5",
    control:
      "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
    error: "mt-1 text-xs text-red-600",
  },
  dark: {
    label: "block text-sm font-medium text-white/70 mb-2",
    control:
      "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/25 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all",
    error: "mt-1.5 text-xs text-red-400",
  },
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  tone?: FieldTone;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, tone = "light", ...props }, ref) => {
    const s = fieldStyles[tone];
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className={s.label}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            s.control,
            error &&
              (tone === "dark"
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                : "border-red-500 focus:border-red-500 focus:ring-red-500/20"),
            className
          )}
          ref={ref}
          id={id}
          {...props}
        />
        {error && <p className={s.error}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
