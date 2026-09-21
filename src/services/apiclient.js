// Cliente contra el API REST real. Reutiliza httpClient, que es el axios
// con los interceptores que agregan el token JWT en cada peticion.

import api from './httpClient.js'

const apiclient = {
  async getAll() {
    const { data } = await api.get('/blueprints')
    return data
  },

  async getByAuthor(author) {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
    return data
  },

  async getByAuthorAndName(author, name) {
    const { data } = await api.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return data
  },

  async create(blueprint) {
    const { data } = await api.post('/blueprints', blueprint)
    return data
  },
}

export default apiclient
