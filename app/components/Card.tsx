import Icon from "./Icon";

interface CardProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  title?: string
}

export default function Card({
  children,
  className,
  icon,
  title
}: Readonly<CardProps>) {
  return (
    <div className={`${className} relative group border border-border hover:bg-white/5 duration-200 p-4`}>

      {/* Accent bar izquierdo */}
      <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-foreground-icons opacity-0 group-hover:opacity-100 duration-200" />

      {(icon || title) && (
        <div className="flex items-center gap-2.5 mb-3">
          {icon && <Icon>{icon}</Icon>}
          {title && (
            <p className="text-sm font-semibold text-foreground-principal">
              {title}
            </p>
          )}
        </div>
      )}

      <div className="text-sm text-foreground-secondary leading-relaxed">
        {children}
      </div>

    </div>
  )
}