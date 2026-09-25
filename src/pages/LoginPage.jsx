import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/httpClient.js'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', data.access_token)
      navigate('/')
    } catch (e) {
      if (e.response && e.response.status === 401) {
        setError('Credenciales inválidas')
      } else if (e.response) {
        setError(`Error del servidor (${e.response.status})`)
      } else {
        setError('Servidor no disponible. Verifica que el backend esté corriendo.')
      }
    }
  }

  return (
    <form className="card p-3 mx-auto" style={{ maxWidth: 480 }} onSubmit={submit}>
      <h2 className="h4 mb-3">Login</h2>
      <div className="mb-3">
        <label htmlFor="login-username" className="form-label">
          Usuario
        </label>
        <input
          id="login-username"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="login-password" className="form-label">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary">
        <i className="bi bi-box-arrow-in-right me-1" />
        Ingresar
      </button>
    </form>
  )
}
