import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { SiteFooter } from './SiteFooter'
import { pageTransition } from '@/lib/motion'

/** App shell: shared header + route-level page transitions (Motion dissolve) + footer. */
export function SiteLayout() {
  const location = useLocation()

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <SiteFooter />
    </>
  )
}
