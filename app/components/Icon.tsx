export default function Icon ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <span className="px-2 py-1 border border-border text-foreground-icons">
      {children}
    </span>
  )
}