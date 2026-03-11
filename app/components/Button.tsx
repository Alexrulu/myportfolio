export default function Button({
  children,
  onClick,
  className = '',
  ...props
}: Readonly<{
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className?: string
}>) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group
        px-4 py-1.5
        text-sm font-medium text-foreground-secondary
        border border-border
        hover:text-foreground-principal hover:bg-white/5
        duration-200 cursor-pointer
        ${className}
      `}
      {...props}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-foreground-icons opacity-0 group-hover:opacity-100 duration-200" />
      {children}
    </button>
  )
}