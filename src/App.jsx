import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import PublicLayout from './layouts/PublicLayout'

const About = lazy(() => import('./pages/About'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Articles = lazy(() => import('./pages/Articles'))
const Contact = lazy(() => import('./pages/Contact'))
const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PracticeAreaDetail = lazy(() => import('./pages/PracticeAreaDetail'))
const PracticeAreas = lazy(() => import('./pages/PracticeAreas'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Team = lazy(() => import('./pages/Team'))

function RouteFallback() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="sr-only">Carregando página…</span>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/areas-de-atuacao" element={<PracticeAreas />} />
            <Route path="/areas-de-atuacao/:slug" element={<PracticeAreaDetail />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/artigos" element={<Articles />} />
            <Route path="/artigos/:slug" element={<ArticleDetail />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
