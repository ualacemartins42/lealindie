import { Background } from '@/components/layout/Background'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { MetricsProvider } from '@/hooks/useSiteMetrics'
import { ThemeProvider } from '@/hooks/useTheme'

export default function App() {
  return (
    <ThemeProvider>
      <MetricsProvider>
        <Background />
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </MetricsProvider>
    </ThemeProvider>
  )
}
