import { Header } from './components/Header'
import { SiteFooter } from './components/SiteFooter'
import { Hero } from './sections/Hero'
import { WorkSection } from './sections/WorkSection'
import { LabSection } from './sections/LabSection'
import { PathSection } from './sections/PathSection'
import { TestimonialsSection } from './sections/TestimonialsSection'
import { ContactSection } from './sections/ContactSection'
import { KoiPondSection } from './pond/KoiPondSection'
import { useSeo } from './hooks/useSeo'

/** Single-page sumi-e portfolio: hero → work → pond → path → lab → voices → contact. */
export function Portfolio() {
  useSeo({
    title: 'Kamlesh Kumar — AI Full-Stack Engineer · Helsinki',
    description:
      'Kamlesh Kumar is an AI full-stack engineer in Helsinki, Finland — PCI DSS payment systems, a recruitment platform run as its only engineer, and open-source database internals. MSc Computer Science, University of Helsinki. Open to roles where ownership matters.',
    canonical: 'https://kamleshkumar.eu/',
  })
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <WorkSection />
        <KoiPondSection />
        <PathSection />
        <LabSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
