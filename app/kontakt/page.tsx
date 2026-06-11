import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakta Fråga Saga – Frågor och Feedback',
  description:
    'Har du frågor, feedback eller vill du samarbeta med Fråga Saga? Här hittar du våra kontaktuppgifter. Vi uppskattar all input som kan förbättra vår tjänst.',
  keywords: ['kontakta fråga saga', 'kontakt', 'feedback', 'samarbete', 'support'],
  robots: 'index, follow',
  openGraph: {
    title: 'Kontakta Fråga Saga – Frågor och Feedback',
    description: 'Har du frågor eller feedback? Kontakta oss här.',
    url: 'https://fragasaga.se/kontakt',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Kontakta oss
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Vi vill gärna höra från dig
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Har du feedback på vår tjänst, frågor om en analys, eller är du
            intresserad av ett samarbete? Tveka inte att höra av dig.
          </p>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-lg font-bold text-[#0f172a]">
            Generella frågor och feedback
          </h2>
          <p className="mt-2 text-base font-medium text-slate-700">
            För allmänna frågor, förslag eller feedback, vänligen maila oss på:
          </p>
          <a
            href="mailto:hej@fragasaga.se"
            className="mt-4 inline-block text-lg font-bold text-[#6366f1] hover:underline"
          >
            hej@fragasaga.se
          </a>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-lg font-bold text-[#0f172a]">
            Samarbeten & Press
          </h2>
          <p className="mt-2 text-base font-medium text-slate-700">
            Är du journalist eller intresserad av att samarbeta med oss?
            Kontakta oss via mail:
          </p>
          <a
            href="mailto:press@fragasaga.se"
            className="mt-4 inline-block text-lg font-bold text-[#6366f1] hover:underline"
          >
            press@fragasaga.se
          </a>
        </div>
      </div>
    </main>
  );
}
