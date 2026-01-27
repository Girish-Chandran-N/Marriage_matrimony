import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

// Since we are not fully installing cva/tailwind-merge, we will do manual class concatenation
// or minimal robust approach.

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean

    variant?: "default" | "outline" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        let variantStyles = ""
        switch (variant) {
            case "default":
                variantStyles = "bg-blue-600 text-white hover:bg-blue-700"
                break;
            case "destructive":
                variantStyles = "bg-red-600 text-white hover:bg-red-700"
                break;
            case "outline":
                variantStyles = "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900"
                break;
            case "ghost":
                variantStyles = "hover:bg-gray-100 text-gray-900"
                break;
            case "link":
                variantStyles = "text-blue-600 underline-offset-4 hover:underline"
                break;
        }

        let sizeStyles = ""
        switch (size) {
            case "default":
                sizeStyles = "h-10 px-4 py-2"
                break;
            case "sm":
                sizeStyles = "h-9 rounded-md px-3"
                break;
            case "lg":
                sizeStyles = "h-11 rounded-md px-8"
                break;
            case "icon":
                sizeStyles = "h-10 w-10"
                break;
        }

        return (
            <Comp
                className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className || ""}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }

export function buttonVariants({ variant = "default" }: { variant?: ButtonProps["variant"] } = {}) {
    // Replicating the logic from the component
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2" // Added default size styles to base for simplicity in this helper

    let variantStyles = ""
    switch (variant) {
        case "default":
            variantStyles = "bg-blue-600 text-white hover:bg-blue-700"
            break;
        case "destructive":
            variantStyles = "bg-red-600 text-white hover:bg-red-700"
            break;
        case "outline":
            variantStyles = "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900"
            break;
        case "ghost":
            variantStyles = "hover:bg-gray-100 text-gray-900"
            break;
        case "link":
            variantStyles = "text-blue-600 underline-offset-4 hover:underline"
            break;
        default:
            variantStyles = "bg-blue-600 text-white hover:bg-blue-700"
    }

    return `${baseStyles} ${variantStyles}`
}
