import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteBlueprint,
  fetchBlueprint,
  updateBlueprintPoints,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintDetailPage() {
  const { author, name } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: bp, detailStatus, detailError, saveStatus, saveError } = useSelector(
    (s) => s.blueprints,
  )
  const [newPoints, setNewPoints] = useState([])

  useEffect(() => {
    dispatch(fetchBlueprint({ author, name }))
  }, [author, name, dispatch])

  const retry = () => dispatch(fetchBlueprint({ author, name }))

  const addPoint = (p) => setNewPoints((prev) => [...prev, p])

  const savePoints = () => {
    if (!newPoints.length) return
    dispatch(updateBlueprintPoints({ author: bp.author, name: bp.name, points: newPoints }))
    setNewPoints([])
  }

  const remove = () => {
    dispatch(deleteBlueprint({ author, name }))
    navigate('/')
  }

  if (detailStatus === 'loading' || !bp) {
    return (
      <div className="card p-3 d-flex align-items-center gap-2">
        <span className="spinner-border spinner-border-sm" />
        Cargando...
      </div>
    )
  }

  if (detailStatus === 'failed') {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between gap-2">
        <span>{detailError}</span>
        <button className="btn btn-outline-danger btn-sm" onClick={retry}>
          <i className="bi bi-arrow-repeat me-1" />
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card p-3">
          <h2 className="h4 mb-3">{bp.name}</h2>
          <p className="mb-1">
            <strong>Autor:</strong> {bp.author}
          </p>
          <p className="mb-3">
            <strong>Puntos:</strong> {(bp.points?.length || 0) + newPoints.length}
          </p>
          <BlueprintCanvas points={[...(bp.points || []), ...newPoints]} onCanvasClick={addPoint} />
          <p className="text-secondary mt-2 mb-0">
            Haz click en el lienzo para agregar puntos al plano.
          </p>
        </div>
      </div>

      <div className="col-lg-5 d-flex flex-column gap-3">
        <div className="card p-3">
          <h3 className="h6">Puntos nuevos ({newPoints.length})</h3>
          {newPoints.length === 0 ? (
            <p className="text-secondary mb-0">Aún no has agregado puntos.</p>
          ) : (
            <ol className="mb-2">
              {newPoints.map((p, i) => (
                <li key={i}>
                  ({p.x}, {p.y})
                </li>
              ))}
            </ol>
          )}
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              disabled={newPoints.length === 0}
              onClick={savePoints}
            >
              <i className="bi bi-save me-1" />
              Guardar puntos
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={newPoints.length === 0}
              onClick={() => setNewPoints([])}
            >
              <i className="bi bi-x-circle me-1" />
              Descartar
            </button>
          </div>
          {saveStatus === 'loading' && (
            <div className="alert alert-info mt-3 mb-0 d-flex align-items-center gap-2">
              <span className="spinner-border spinner-border-sm" />
              Guardando...
            </div>
          )}
          {saveStatus === 'failed' && (
            <div className="alert alert-danger mt-3 mb-0">{saveError}</div>
          )}
        </div>

        <div className="card p-3">
          <button className="btn btn-outline-danger w-100" onClick={remove}>
            <i className="bi bi-trash me-1" />
            Eliminar blueprint
          </button>
          <Link className="btn btn-outline-light w-100 mt-2" to="/">
            <i className="bi bi-arrow-left me-1" />
            Volver a blueprints
          </Link>
        </div>
      </div>
    </div>
  )
}
