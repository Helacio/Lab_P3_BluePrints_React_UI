export default function BlueprintList({ items = [], onSelect }) {
  if (!items.length) return <p className="text-secondary">No hay blueprints para este autor.</p>
  return (
    <div className="row g-3">
      {items.map((bp) => (
        <div key={bp.name} className="col-md-6">
          <div className="card p-3 h-100">
            <h3 className="h6">{bp.name}</h3>
            <p className="mb-1">
              <strong>Autor:</strong> {bp.author}
            </p>
            <p>
              <strong>Puntos:</strong> {bp.points ? bp.points.length : 0}
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => onSelect(bp)}>
              <i className="bi bi-eye me-1" />
              Ver detalle
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
