import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-md active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline: "border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary active:scale-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-glow-secondary active:scale-95",
        ghost: "hover:bg-muted hover:text-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        // New game-themed variants
        hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-extrabold text-lg shadow-glow-md hover:shadow-glow-lg hover:scale-105 active:scale-95 transition-all",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-glow-success active:scale-95",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-glow-accent active:scale-95",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 active:scale-95",
        glass: "glass text-foreground hover:bg-muted/40 border border-primary/20 active:scale-95",
        game: "bg-gradient-to-r from-secondary to-warning text-secondary-foreground font-extrabold shadow-glow-secondary hover:shadow-lg hover:scale-105 active:scale-95 transition-all",
        module: "bg-card border-2 border-border text-foreground hover:border-primary hover:shadow-glow-sm active:scale-95 transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
