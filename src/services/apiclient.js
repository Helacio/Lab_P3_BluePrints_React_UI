// Cliente contra el API REST real. Reutiliza httpClient, que es el axios
// con los interceptores que agregan el token JWT en cada peticion.

import api from './httpClient.js'

const unwrap = ({ data }) => data.data

const apiclient = {
  async getAll() {
    const res = await api.get('/api/blueprints')
    return unwrap(res)
  },

  async getByAuthor(author) {
    const res = await api.get(`/api/blueprints/${encodeURIComponent(author)}`)
    return unwrap(res)
  },

  async getByAuthorAndName(author, name) {
    const res = await api.get(
      `/api/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return unwrap(res)
  },

  async create(blueprint) {
    const res = await api.post('/api/blueprints', blueprint)
    return unwrap(res)
  },

  async updatePoints(author, name, point) {
    const res = await api.put(
      `/api/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}/points`,
      point,
    )
    return unwrap(res)
  },

  async delete(author, name) {
    const res = await api.delete(
      `/api/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return res.data?.data ?? null
  },
}

export default apiclient
