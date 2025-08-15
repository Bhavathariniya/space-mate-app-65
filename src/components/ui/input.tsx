import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, error, icon, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Ensure the event is properly handled
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none",
            "[-webkit-appearance:none]",
            "[-moz-appearance:textfield]",
            "leading-normal",
            "touch-manipulation",
            "selection:bg-primary/10",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            "sm:h-10 sm:text-sm",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
          style={{
            WebkitUserModify: "read-write-plaintext-only",
            WebkitTapHighlightColor: "transparent",
            fontFamily: "inherit",
            ...props.style,
          }}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
