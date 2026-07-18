import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "../lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-tight transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"

    const variants = {
      primary: "bg-lake-blue text-white hover:brightness-110 px-8 py-4 text-[14px]",
      secondary: "bg-off-black text-white hover:brightness-125 px-8 py-4 text-[14px]",
      ghost: "bg-transparent text-off-black border border-off-black hover:bg-off-black hover:text-white px-8 py-4 text-[14px]",
      outline: "bg-transparent border border-ash text-off-black hover:border-off-black px-8 py-4 text-[14px]",
      danger: "bg-coral text-off-black hover:brightness-105 px-8 py-4 text-[14px]"
    }

    const sizes = {
      sm: "h-10 px-6 text-[12px]",
      md: "h-12 px-8 text-[14px]",
      lg: "h-14 px-10 text-[15px]"
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], size !== "md" ? sizes[size] : "", className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
