import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
    
    const variants = {
      solid: "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90",
      outline: "border border-border bg-transparent hover:bg-secondary/80 hover:border-muted-foreground/20 text-foreground",
      ghost: "bg-transparent hover:bg-secondary/80 text-muted-foreground hover:text-foreground",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-9 w-9 p-0 flex-shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
