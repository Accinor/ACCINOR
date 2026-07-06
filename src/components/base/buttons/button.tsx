"use client"

import Link from "next/link"
import { isValidElement, type FC, type MouseEventHandler, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export type ButtonColor = "primary" | "secondary" | "tertiary" | "destructive" | "link"
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

const base =
  "group/button relative inline-flex items-center justify-center font-semibold whitespace-nowrap rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#ffb81b]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none"

// Colors respect the ACCINOR identity: a single confident gold accent on deep navy.
const colors: Record<ButtonColor, string> = {
  primary: "bg-[#ffb81b] text-[#050a30] hover:bg-[#e5a318] shadow-sm shadow-[#ffb81b]/25 hover:shadow-md hover:shadow-[#ffb81b]/30",
  secondary: "bg-card/60 text-foreground border border-border hover:bg-card hover:border-[#ffb81b]/40",
  tertiary: "text-foreground/80 hover:bg-[#ffb81b]/10 hover:text-foreground",
  destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25",
  link: "text-[#ffb81b] underline-offset-4 hover:underline",
}

const sizes: Record<ButtonSize, string> = {
  xs: "h-8 gap-1.5 px-3 text-xs",
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2 px-5 text-base",
  xl: "h-12 gap-2.5 px-6 text-base",
}

const iconSize: Record<ButtonSize, string> = {
  xs: "size-4", sm: "size-4", md: "size-4", lg: "size-5", xl: "size-5",
}

type IconProp = FC<{ className?: string }> | ReactNode

interface ButtonProps {
  color?: ButtonColor
  size?: ButtonSize
  className?: string
  children?: ReactNode
  iconLeading?: IconProp
  iconTrailing?: IconProp
  isLoading?: boolean
  showTextWhileLoading?: boolean
  /** When set, renders a Next.js Link styled as a button (no nested <a><button>). */
  href?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: MouseEventHandler
  target?: string
  rel?: string
  title?: string
  "aria-label"?: string
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function renderIcon(icon: IconProp | undefined, cls: string) {
  if (!icon) return null
  if (isValidElement(icon)) return icon
  const Ico = icon as FC<{ className?: string }>
  return <Ico className={cls} />
}

export function Button({
  color = "primary",
  size = "md",
  className,
  children,
  iconLeading,
  iconTrailing,
  isLoading = false,
  showTextWhileLoading = false,
  href,
  type,
  disabled,
  onClick,
  target,
  rel,
  title,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const hideText = isLoading && !showTextWhileLoading
  const icls = iconSize[size]
  const classes = cn(base, colors[color], sizes[size], className)

  const inner = (
    <>
      {isLoading && <Spinner className={cn(icls, hideText && "absolute")} />}
      {!isLoading && renderIcon(iconLeading, cn(icls, "shrink-0"))}
      {children != null && <span className={cn("transition-inherit-all", hideText && "invisible")}>{children}</span>}
      {!isLoading && renderIcon(iconTrailing, cn(icls, "shrink-0"))}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} target={target} rel={rel} title={title} aria-label={ariaLabel}>
        {inner}
      </Link>
    )
  }

  return (
    <button
      type={type ?? "button"}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={classes}
      title={title}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  )
}
