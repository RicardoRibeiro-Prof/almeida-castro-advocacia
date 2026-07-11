import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import PublicLayout from './layouts/PublicLayout'
import About from './pages/About'
import ArticleDetail from './pages/ArticleDetail'
import Articles from './pages/Articles'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PracticeAreaDetail from './pages/PracticeAreaDetail'
import PracticeAreas from './pages/PracticeAreas'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Team from './pages/Team'

export default function App() {
  return (
    <>
      <ScrollToTop />
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
    </>
  )
}
