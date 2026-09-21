// Datos de prueba en memoria. Se usan cuando VITE_USE_MOCK=true,
// para poder trabajar en la interfaz sin tener el backend levantado.

let blueprints = [
  {
    author: 'juan',
    name: 'plano-casa',
    points: [
      { x: 40, y: 40 },
      { x: 240, y: 40 },
      { x: 240, y: 200 },
      { x: 40, y: 200 },
      { x: 40, y: 40 },
      { x: 140, y: 120 },
      { x: 240, y: 40 },
    ],
  },
  {
    author: 'juan',
    name: 'plano-oficina',
    points: [
      { x: 60, y: 60 },
      { x: 60, y: 300 },
      { x: 200, y: 300 },
      { x: 200, y: 180 },
      { x: 320, y: 180 },
      { x: 320, y: 60 },
      { x: 60, y: 60 },
    ],
  },
  {
    author: 'hernan',
    name: 'plano-apartamento',
    points: [
      { x: 80, y: 80 },
      { x: 300, y: 80 },
      { x: 300, y: 260 },
      { x: 200, y: 260 },
      { x: 200, y: 180 },
      { x: 80, y: 180 },
    ],
  },
  {
    author: 'hernan',
    name: 'plano-triangulo',
    points: [
      { x: 120, y: 60 },
      { x: 300, y: 280 },
      { x: 60, y: 280 },
      { x: 120, y: 60 },
    ],
  },
]

// Si el autor ya devolvió una copia de los datos, se la damos.
// Asi el estado de Redux no comparte la misma referencia que el mock.
const clone = (value) => JSON.parse(JSON.stringify(value))

const apimock = {
  async getAll() {
    return clone(blueprints)
  },

  async getByAuthor(author) {
    return clone(blueprints.filter((bp) => bp.author === author))
  },

  async getByAuthorAndName(author, name) {
    const found = blueprints.find((bp) => bp.author === author && bp.name === name)
    if (!found) {
      throw new Error(`No existe el plano ${name} del autor ${author}`)
    }
    return clone(found)
  },

  async create(blueprint) {
    const alreadyExists = blueprints.some(
      (bp) => bp.author === blueprint.author && bp.name === blueprint.name,
    )
    if (alreadyExists) {
      throw new Error(`Ya existe el plano ${blueprint.name} del autor ${blueprint.author}`)
    }
    blueprints.push(clone(blueprint))
    return clone(blueprint)
  },
}

export default apimock
