"use client"

import type { FC, ReactElement, ReactNode } from "react"
import { isValidElement } from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/50 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset hover:bg-primary/80 before:absolute before:inset-px before:border before:border-white/12 before:[mask-image:linear-gradient(to_top,transparent,black_0%)] before:rounded-[calc(var(--radius)-1px)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground border-input bg-input/30 hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "text-tertiary hover:bg-primary_hover hover:text-tertiary_hover aria-expanded:bg-muted",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 bg-destructive/20 hover:bg-destructive/30 focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  iconLeading?: FC<{ className?: string }> | ReactNode
  iconTrailing?: FC<{ className?: string }> | ReactNode
  isLoading?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  isLoading: loading,
  children,
  ...props
}: ButtonProps) {
  const isIcon = (IconLeading || IconTrailing) && !children

  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      data-icon-only={isIcon || undefined}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "pointer-events-none [&>*:not([data-icon=loading]):not([data-text])]:invisible"
      )}
      {...props}
    >
      {isValidElement(IconLeading) && IconLeading}
      {IconLeading && typeof IconLeading === "function" && <IconLeading data-icon="leading" className="pointer-events-none size-4 shrink-0" />}

      {loading && (
        <svg
          fill="none"
          data-icon="loading"
          viewBox="0 0 20 20"
          className="pointer-events-none size-4 shrink-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
          <circle
            className="origin-center animate-spin stroke-current"
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
            strokeDasharray="12.5 50"
            strokeLinecap="round"
          />
        </svg>
      )}

      {children && <span data-text className="transition-inherit-all px-0.5">{children}</span>}

      {isValidElement(IconTrailing) && IconTrailing}
      {IconTrailing && typeof IconTrailing === "function" && <IconTrailing data-icon="trailing" className="pointer-events-none size-4 shrink-0" />}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
