import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! [&>svg]:stroke-[2.25px]",
  {
    variants: {
      variant: {
        default:
          "h-5 rounded-4xl px-2 py-0.5 text-xs bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        pill: "rounded-full ring-1 ring-inset text-xs font-medium",
        badge: "rounded-md ring-1 ring-inset text-xs font-medium",
        secondary:
          "h-5 rounded-4xl px-2 py-0.5 text-xs bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "h-5 rounded-4xl px-2 py-0.5 text-xs bg-destructive/20 text-destructive focus-visible:ring-destructive/20 focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "h-5 rounded-4xl px-2 py-0.5 text-xs border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
      },
      color: {
        gray: "",
        brand: "",
        error: "",
        warning: "",
        success: "",
        slate: "",
        blue: "",
        indigo: "",
        purple: "",
        pink: "",
        orange: "",
      },
      size: {
        sm: "py-0.5 px-2 text-xs",
        md: "py-0.5 px-2.5 text-sm",
        lg: "py-1 px-3 text-sm",
      },
    },
    compoundVariants: [
      { variant: "pill", size: "sm", className: "py-0.5 px-2 text-xs" },
      { variant: "pill", size: "md", className: "py-0.5 px-2.5 text-sm" },
      { variant: "pill", size: "lg", className: "py-1 px-3 text-sm" },
      { variant: "badge", size: "sm", className: "py-0.5 px-1.5 text-xs" },
      { variant: "badge", size: "md", className: "py-0.5 px-2 text-sm" },
      { variant: "badge", size: "lg", className: "py-1 px-2.5 text-sm rounded-lg" },
      { variant: "pill", color: "gray", className: "bg-utility-neutral-50 text-utility-neutral-700 ring-utility-neutral-200" },
      { variant: "pill", color: "brand", className: "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200" },
      { variant: "pill", color: "error", className: "bg-utility-red-50 text-utility-red-700 ring-utility-red-200" },
      { variant: "pill", color: "warning", className: "bg-utility-yellow-50 text-utility-yellow-700 ring-utility-yellow-200" },
      { variant: "pill", color: "success", className: "bg-utility-green-50 text-utility-green-700 ring-utility-green-200" },
      { variant: "pill", color: "slate", className: "bg-utility-slate-50 text-utility-slate-700 ring-utility-slate-200" },
      { variant: "pill", color: "blue", className: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200" },
      { variant: "pill", color: "indigo", className: "bg-utility-indigo-50 text-utility-indigo-700 ring-utility-indigo-200" },
      { variant: "pill", color: "purple", className: "bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200" },
      { variant: "pill", color: "pink", className: "bg-utility-pink-50 text-utility-pink-700 ring-utility-pink-200" },
      { variant: "pill", color: "orange", className: "bg-utility-orange-50 text-utility-orange-700 ring-utility-orange-200" },
      { variant: "badge", color: "gray", className: "bg-utility-neutral-50 text-utility-neutral-700 ring-utility-neutral-200" },
      { variant: "badge", color: "brand", className: "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200" },
      { variant: "badge", color: "error", className: "bg-utility-red-50 text-utility-red-700 ring-utility-red-200" },
      { variant: "badge", color: "warning", className: "bg-utility-yellow-50 text-utility-yellow-700 ring-utility-yellow-200" },
      { variant: "badge", color: "success", className: "bg-utility-green-50 text-utility-green-700 ring-utility-green-200" },
      { variant: "badge", color: "slate", className: "bg-utility-slate-50 text-utility-slate-700 ring-utility-slate-200" },
      { variant: "badge", color: "blue", className: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200" },
      { variant: "badge", color: "indigo", className: "bg-utility-indigo-50 text-utility-indigo-700 ring-utility-indigo-200" },
      { variant: "badge", color: "purple", className: "bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200" },
      { variant: "badge", color: "pink", className: "bg-utility-pink-50 text-utility-pink-700 ring-utility-pink-200" },
      { variant: "badge", color: "orange", className: "bg-utility-orange-50 text-utility-orange-700 ring-utility-orange-200" },
    ],
    defaultVariants: {
      variant: "default",
      color: "gray",
      size: "md",
    },
  }
)

function Badge({
  className,
  variant = "default",
  color = "gray",
  size = "md",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, color, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

function BadgeDot({ className }: { className?: string }) {
  return (
    <span className={cn("size-1.5 rounded-full", className)} />
  )
}

function BadgeIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("pointer-events-none size-3 shrink-0 stroke-[3px]", className)}>
      {children}
    </span>
  )
}

export { Badge, badgeVariants, BadgeDot, BadgeIcon }
