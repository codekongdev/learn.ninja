"use client"

import Link from "next/link"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/** A Next.js link that looks like a button, for moving between pages without a full reload. */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof Link> &
  Pick<NonNullable<Parameters<typeof buttonVariants>[0]>, "variant" | "size">) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
