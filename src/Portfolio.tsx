import { Header } from './components/Header'
import { SiteFooter } from './components/SiteFooter'
import { Hero } from './sections/Hero'
import { AboutSection } from './sections/AboutSection'
import { WorkSection } from './sections/WorkSection'
import { LabSection } from './sections/LabSection'
import { PathSection } from './sections/PathSection'
import { RecognitionSection } from './sections/RecognitionSection'
import { SkillsSection } from './sections/SkillsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { TestimonialsSection } from './sections/TestimonialsSection'
import { ContactSection } from './sections/ContactSection'
import { KoiPondSection } from './pond/KoiPondSection'
import { useSeo } from './hooks/useSeo'

/** Single-page sumi-e portfolio: hero → about → work → pond → path →
 *  skills → certifications → recognition → lab → voices → contact.
 *  After the pond, sections alternate plain / tinted — keep it that way when
 *  adding one (the tint is the `section--alt` class). */
export function Portfolio() {
  useSeo({
    title: 'Kamlesh Kumar — AI Full-Stack Software Engineer · Helsinki',
    description:
      'Kamlesh Kumar is an AI full-stack engineer in Helsinki, Finland — PCI DSS payment systems, a recruitment platform run as its only engineer, and open-source database internals. MSc Computer Science, University of Helsinki. Open to roles where ownership matters.',
    canonical: 'https://kamleshkumar.eu/',
  })
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <AboutSection />
        <WorkSection />
        <KoiPondSection />
        <PathSection />
        <SkillsSection />
        <CertificationsSection />
        <LabSection />
        <RecognitionSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
