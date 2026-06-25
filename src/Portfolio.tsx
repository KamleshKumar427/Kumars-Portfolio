import { Header } from './components/Header'
import { SiteFooter } from './components/SiteFooter'
import { Hero } from './sections/Hero'
import { WorkSection } from './sections/WorkSection'
import { LabSection } from './sections/LabSection'
import { PathSection } from './sections/PathSection'
import { ContactSection } from './sections/ContactSection'
import { KoiPondSection } from './pond/KoiPondSection'

/** Single-page sumi-e portfolio: hero → work → pond → path → lab → contact. */
export function Portfolio() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <WorkSection />
        <KoiPondSection />
        <PathSection />
        <LabSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
