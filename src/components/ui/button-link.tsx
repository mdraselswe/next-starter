import type { VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

type Variants = VariantProps<typeof buttonVariants>;

/** Button-styled link to a page of this site (checked by typedRoutes). */
export function ButtonLink<T extends string>({
  variant,
  size,
  className,
  ...props
}: Variants & LinkProps<T> & Omit<ComponentProps<"a">, keyof LinkProps<T>>) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Button-styled link to another site, `tel:` or `mailto:`. */
export function ButtonAnchor({ variant, size, className, ...props }: Variants & ComponentProps<"a">) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
