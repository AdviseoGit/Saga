import clsx from 'clsx'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        'group relative flex flex-col items-start',
        className,
      )}
    >
      {children}
    </div>
  )
}

Card.Title = function CardTitle({
  as: Component = 'h2',
  href,
  children,
}: {
  as?: React.ElementType
  href?: string
  children: React.ReactNode
}) {
  return (
    <Component
      className={clsx(
        'text-base font-semibold tracking-tight text-zinc-800',
      )}
    >
      {href ? <Card.Link href={href}>{children}</Card.Link> : children}
    </Component>
  )
}

Card.Description = function CardDescription({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p
      className={clsx(
        'relative z-10 mt-2 text-sm text-zinc-600',
      )}
    >
      {children}
    </p>
  )
}

Card.Cta = function CardCta({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500',
      )}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="ml-1 h-4 w-4 stroke-current"
      >
        <path
          d="M6.75 5.75 9.25 8l-2.5 2.25"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

Card.Link = function CardLink({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'a'>) {
  return (
    <>
      <div
        className={clsx(
          'absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl',
        )}
      />
      <a {...props}>
        <span
          className={clsx(
            'absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl',
          )}
        />
        <span className="relative z-10">{children}</span>
      </a>
    </>
  )
}