import { useState } from 'react'

export default function BlueprintForm({ onSubmit }) {
  const [author, setAuthor] = useState('')
  const [name, setName] = useState('')
  const [pointsJSON, setPointsJSON] = useState('[{"x":10,"y":10},{"x":40,"y":60}]')

  const handle = (e) => {
    e.preventDefault()
    try {
      const points = JSON.parse(pointsJSON)
      onSubmit({ author, name, points })
    } catch (e) {
      alert('JSON de puntos inválido')
    }
  }

  return (
    <form onSubmit={handle} className="card p-3">
      <h3 className="mt-0">Crear Blueprint</h3>
      <div className="row g-3">
        <div className="col">
          <label htmlFor="bp-author" className="form-label">
            Autor
          </label>
          <input
            id="bp-author"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="juan.perez"
          />
        </div>
        <div className="col">
          <label htmlFor="bp-name" className="form-label">
            Nombre
          </label>
          <input
            id="bp-name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mi-dibujo"
          />
        </div>
      </div>
      <div className="mt-3">
        <label htmlFor="bp-points" className="form-label">
          Puntos (JSON)
        </label>
        <textarea
          id="bp-points"
          className="form-control"
          rows="5"
          value={pointsJSON}
          onChange={(e) => setPointsJSON(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <button className="btn btn-primary">
          <i className="bi bi-save me-1" />
          Guardar
        </button>
      </div>
    </form>
  )
}
