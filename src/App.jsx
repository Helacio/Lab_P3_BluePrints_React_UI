import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import BlueprintsPage from './pages/BlueprintsPage.jsx'
import BlueprintDetailPage from './pages/BlueprintDetailPage.jsx'
import CreateBlueprintPage from './pages/CreateBlueprintPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import logoLight from './assets/logo-eci-light.png'
import logoDark from './assets/logo-eci-dark.png'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const navBtn = `btn btn-sm ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'}`

  return (
    <div className="container py-4">
      <header className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <h1 className="h3 mb-0 app-title">ECI - Laboratorio de Blueprints en React</h1>
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="Logo Escuela Colombiana de Ingeniería"
            style={{ height: 44 }}
          />
        </div>
        <nav className="d-flex gap-2 align-items-center">
          <NavLink className={navBtn} to="/" end>
            <i className="bi bi-grid me-1" />
            Blueprints
          </NavLink>
          <NavLink className={navBtn} to="/blueprints/new">
            <i className="bi bi-plus-circle me-1" />
            Nuevo Blueprint
          </NavLink>
          <NavLink className={navBtn} to="/login">
            <i className="bi bi-box-arrow-in-right me-1" />
            Login
          </NavLink>
          <button
            className={`btn btn-sm ${theme === 'dark' ? 'btn-outline-warning' : 'btn-outline-secondary'}`}
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} />
          </button>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<BlueprintsPage />} />
        <Route
          path="/blueprints/new"
          element={
            <PrivateRoute>
              <CreateBlueprintPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/blueprints/:author/:name"
          element={
            <PrivateRoute>
              <BlueprintDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
