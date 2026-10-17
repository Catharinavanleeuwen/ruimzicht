import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring motion-safe:active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-card shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        chip: "rounded-full border border-border bg-card text-foreground shadow-xs hover:bg-accent aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background",
        swatch:
          "rounded-full text-person-foreground ring-offset-2 ring-offset-card hover:opacity-90 aria-pressed:ring-2 aria-pressed:ring-foreground",
        cell: "h-auto min-h-16 w-full min-w-0 flex-col items-start justify-between gap-1 rounded-md border border-dashed border-border bg-card/60 p-1.5 text-left whitespace-normal hover:border-primary/60 hover:bg-accent md:min-h-20 md:p-2 data-[status=thuis]:border-solid data-[status=thuis]:border-status-home/60 data-[status=thuis]:bg-status-home/15 data-[status=weg]:border-solid data-[status=weg]:bg-status-away/15 data-[status=misschien]:border-solid data-[status=misschien]:border-status-maybe/70 data-[status=misschien]:bg-status-maybe/15 data-[now=true]:ring-2 data-[now=true]:ring-primary data-[now=true]:ring-offset-2 data-[now=true]:ring-offset-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6 text-base",
        icon: "size-10",
        chip: "h-11 px-4",
        cell: "",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
