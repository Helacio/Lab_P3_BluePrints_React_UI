import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearSaveStatus, createBlueprint } from '../features/blueprints/blueprintsSlice.js'
import BlueprintForm from '../components/BlueprintForm.jsx'

export default function CreateBlueprintPage() {
  const dispatch = useDispatch()
  const { saveStatus, saveError } = useSelector((s) => s.blueprints)

  useEffect(() => {
    dispatch(clearSaveStatus())
  }, [dispatch])

  const onSubmit = (payload) => {
    dispatch(createBlueprint(payload))
  }

  return (
    <div className="card p-3">
      <h2 className="h4">Crear Blueprint</h2>
      {saveStatus === 'loading' && (
        <div className="alert alert-info d-flex align-items-center gap-2">
          <span className="spinner-border spinner-border-sm" />
          Guardando...
        </div>
      )}
      {saveStatus === 'succeeded' && (
        <div className="alert alert-success">
          Blueprint creado. <Link to="/">Volver a blueprints</Link>
        </div>
      )}
      {saveStatus === 'failed' && <div className="alert alert-danger">{saveError}</div>}
      <BlueprintForm onSubmit={onSubmit} />
    </div>
  )
}
