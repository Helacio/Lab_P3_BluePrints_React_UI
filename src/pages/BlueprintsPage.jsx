import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteBlueprint,
  fetchAllBlueprints,
  fetchAuthors,
  fetchByAuthor,
} from '../features/blueprints/blueprintsSlice.js'
import { selectTop5ByPoints } from '../features/blueprints/selectors.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { byAuthor, all, current, status, error } = useSelector((s) => s.blueprints)
  const top5 = useSelector(selectTop5ByPoints)
  const [authorInput, setAuthorInput] = useState('')
  const [view, setView] = useState(null)
  const items = view === 'all' ? all : view ? byAuthor[view] || [] : []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    const author = authorInput.trim()
    if (author) {
      setView(author)
      dispatch(fetchByAuthor(author))
    } else {
      setView('all')
      dispatch(fetchAllBlueprints())
    }
  }

  const retry = () => {
    if (view === 'all') dispatch(fetchAllBlueprints())
    else if (view) dispatch(fetchByAuthor(view))
  }

  const openBlueprint = (bp) => {
    navigate(`/blueprints/${bp.author}/${bp.name}`)
  }

  const removeBlueprint = (bp) => {
    dispatch(deleteBlueprint({ author: bp.author, name: bp.name }))
  }

  return (
    <div className="row g-4">
      <section className="col-lg-5 d-flex flex-column gap-3">
        <div className="card p-3">
          <h2 className="h5 mb-3">Blueprints</h2>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Author (vacío = todos)"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <button className="btn btn-primary text-nowrap" onClick={getBlueprints}><i className="bi bi-search me-1" />Get blueprints
            </button>
          </div>
          <div className="mt-3">
            <Link className="btn btn-outline-light btn-sm" to="/blueprints/new"><i className="bi bi-plus-circle me-1" />Nuevo blueprint
            </Link>
          </div>
        </div>

        <div className="card p-3">
          <h3 className="h6">
            {view === 'all' ? 'Todos los blueprints:' : view ? `${view}'s blueprints:` : 'Results'}
          </h3>
          {status === 'loading' && (
            <div className="d-flex align-items-center gap-2 text-secondary">
              <span className="spinner-border spinner-border-sm" />
              Cargando...
            </div>
          )}
          {status === 'failed' &&
            (localStorage.getItem('token') ? (
              <div className="alert alert-danger d-flex align-items-center justify-content-between gap-2">
                <span>{error}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={retry}><i className="bi bi-arrow-repeat me-1" />Reintentar
                </button>
              </div>
            ) : (
              <div className="alert alert-warning d-flex align-items-center justify-content-between gap-2">
                <span>
                  Logueate primero para ver los blueprints{' '}
                  <small className="text-secondary">
                    (usa las credenciales usuario: <strong>student</strong> contraseña:{' '}
                    <strong>student123</strong>)
                  </small>
                </span>
                <Link className="btn btn-outline-warning btn-sm" to="/login"><i className="bi bi-box-arrow-in-right me-1" />Login
                </Link>
              </div>
            ))}
          {status !== 'loading' && status !== 'failed' && !items.length && (
            <p className="text-gold mb-0">Sin resultados.</p>
          )}
          {!!items.length && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-2">
                <thead>
                  <tr>
                    <th>Blueprint name</th>
                    {view === 'all' && <th>Author</th>}
                    <th className="text-end">Number of points</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={`${bp.author}/${bp.name}`}>
                      <td>{bp.name}</td>
                      {view === 'all' && <td>{bp.author}</td>}
                      <td className="text-end">{bp.points?.length || 0}</td>
                      <td className="text-end text-nowrap">
                        <button
                          className="btn btn-outline-light btn-sm me-1"
                          onClick={() => openBlueprint(bp)}
                        >
                          <i className="bi bi-folder2-open me-1" />
                          Open
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeBlueprint(bp)}
                        >
                          <i className="bi bi-trash me-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="fw-bold mb-0 mt-2">Total user points: {totalPoints}</p>
        </div>

        <div className="card p-3">
          <h3 className="h6">Top 5 por puntos</h3>
          {top5.length === 0 ? (
            <p className="text-gold mb-0">Aún no hay blueprints cargados.</p>
          ) : (
            <ol className="mb-0">
              {top5.map((bp) => (
                <li key={`${bp.author}/${bp.name}`}>
                  <strong>{bp.name}</strong> ({bp.author}) — {bp.points?.length || 0} puntos
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="col-lg-7">
        <div className="card p-3">
          <label htmlFor="current-blueprint-name" className="form-label">
            Current blueprint
          </label>
          <input
            id="current-blueprint-name"
            className="form-control mb-3"
            readOnly
            value={current?.name || ''}
            placeholder="—"
          />
          <BlueprintCanvas points={current?.points || []} />
        </div>
      </section>
    </div>
  )
}
