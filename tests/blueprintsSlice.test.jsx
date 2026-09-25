import { describe, it, expect } from 'vitest'
import reducer, { deleteBlueprint } from '../src/features/blueprints/blueprintsSlice.js'
import { selectTop5ByPoints } from '../src/features/blueprints/selectors.js'

describe('blueprints slice', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.authors).toEqual([])
  })

  it('elimina optimísticamente y revierte si falla', () => {
    const state = structuredClone(reducer(undefined, { type: '@@INIT' }))
    state.byAuthor.juan = [
      { author: 'juan', name: 'casa', points: [] },
      { author: 'juan', name: 'ofi', points: [] },
    ]

    const pending = reducer(state, {
      type: 'blueprints/deleteBlueprint/pending',
      meta: { arg: { author: 'juan', name: 'casa' } },
    })
    expect(pending.byAuthor.juan.map((b) => b.name)).toEqual(['ofi'])

    const rejected = reducer(pending, {
      type: 'blueprints/deleteBlueprint/rejected',
      meta: { arg: { author: 'juan', name: 'casa' } },
      payload: 'error',
    })
    expect(rejected.byAuthor.juan.map((b) => b.name)).toEqual(['casa', 'ofi'])
    expect(rejected.saveStatus).toBe('failed')
  })

  it('agrega puntos optimísticamente al current y revierte si falla', () => {
    const state = structuredClone(reducer(undefined, { type: '@@INIT' }))
    state.current = { author: 'juan', name: 'casa', points: [{ x: 1, y: 1 }] }

    const pending = reducer(state, {
      type: 'blueprints/updateBlueprintPoints/pending',
      meta: { arg: { author: 'juan', name: 'casa', points: [{ x: 2, y: 2 }] } },
    })
    expect(pending.current.points).toHaveLength(2)

    const rejected = reducer(pending, {
      type: 'blueprints/updateBlueprintPoints/rejected',
      meta: { arg: { author: 'juan', name: 'casa', points: [{ x: 2, y: 2 }] } },
      payload: 'error',
    })
    expect(rejected.current.points).toHaveLength(1)
  })

  it('expone el thunk deleteBlueprint', () => {
    expect(deleteBlueprint({ author: 'a', name: 'b' })).toBeDefined()
  })
})

describe('selectors', () => {
  it('selectTop5ByPoints ordena por cantidad de puntos', () => {
    const state = {
      blueprints: {
        byAuthor: {
          juan: [
            { author: 'juan', name: 'chico', points: [{}, {}] },
            { author: 'juan', name: 'grande', points: [{}, {}, {}, {}, {}] },
          ],
          ana: [{ author: 'ana', name: 'medio', points: [{}, {}, {}] }],
        },
      },
    }
    const top = selectTop5ByPoints(state)
    expect(top.map((b) => b.name)).toEqual(['grande', 'medio', 'chico'])
  })
})
