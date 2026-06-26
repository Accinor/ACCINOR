export function SectionDivider() {
  return (
    <div className="relative h-24 md:h-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-section/0 via-section/30 to-section/0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
        <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-[#ffb81b]/40 to-transparent" />
        <div className="size-1.5 rounded-full bg-[#ffb81b]/40" />
        <div className="size-2 rounded-full bg-[#ffb81b]/20" />
        <div className="size-1.5 rounded-full bg-[#ffb81b]/40" />
        <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-[#ffb81b]/40 to-transparent" />
      </div>
      <svg
        className="absolute bottom-0 w-full h-auto text-section/20"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 40V0c240 20 480 30 720 30s480-10 720-30v40H0z" />
      </svg>
    </div>
  )
}
