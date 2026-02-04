import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center border border-transparent font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-4 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        delux: "bg-yellow-500",
        top: "bg-slate-700 text-muted",
        new: "bg-green-700",
        featured: "bg-red-700",
        male: "bg-blue-700",
        female: "bg-pink-700",
        unisex: "bg-neutral-700",
        unassigned: "bg-neutral-700",
        valid: "border-blue-500 bg-blue-500/20 text-blue-700",
        pending: "border-yellow-500 bg-yellow-500/20 text-yellow-700",
      },
    },
    defaultVariants: {
      variant: "top",
    },
  },
);

function Badge({
  className,
  variant = "top",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
