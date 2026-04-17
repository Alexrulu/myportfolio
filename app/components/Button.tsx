import Link from 'next/link'

const cls = (className = '') => `
  relative group
  px-4 py-1.5
  text-sm font-medium text-foreground-secondary
  border border-border
  hover:text-foreground-principal hover:bg-white/5
  active:text-foreground-principal active:bg-white/5
  duration-200 cursor-pointer
  ${className}
`

const AccentBar = () => (
  <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-foreground-icons opacity-0 group-hover:opacity-100 group-active:opacity-100 duration-200" />
)

export default function Button({
  children,
  onClick,
  href,
  external = false,
  className = '',
  ...props
}: Readonly<{
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  href?: string
  external?: boolean
  className?: string
  [key: string]: unknown
}>) {
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls(className)}
        >
          <AccentBar />
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls(className)}>
        <AccentBar />
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cls(className)}
      {...props}
    >
      <AccentBar />
      {children}
    </button>
  )
}
