import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "barbie";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-cente cursor-pointer rounded-full active:scale-95 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 font-heading",
          {
            "bg-linear-to-r from-pink-500 to-purple-500 text-white shadow-lg":
              variant === "default" || variant === "barbie",
            "border-2 border-pink-500 bg-white text-pink-500 hover:bg-pink-50":
              variant === "outline",
            "hover:bg-pink-100 text-pink-600": variant === "ghost",
            "h-12 px-8 py-3 text-lg": size === "default",
            "h-10 px-6 py-2 text-base": size === "sm",
            "h-14 px-12 py-4 text-xl": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
