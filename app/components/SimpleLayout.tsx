import { Container } from './Container'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-base text-zinc-600">
          {intro}
        </p>
      </header>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </Container>
  )
}