import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldStyles, type FieldTone } from "./input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  tone?: FieldTone;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, tone = "light", ...props }, ref) => {
    const s = fieldStyles[tone];
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className={s.label}>
            {label}
          </label>
        )}
        <textarea
          className={cn(
            // Share the control styling, swapping the fixed height for a
            // resizable multi-line box.
            s.control.replace("h-11", "min-h-[120px]").replace("h-12", "min-h-[120px]"),
            "py-3 resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
