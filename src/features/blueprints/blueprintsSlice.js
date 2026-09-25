import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const data = await blueprintsService.getAll()
  // Expecting API returns array of {author, name, points}
  const authors = [...new Set(data.map((bp) => bp.author))]
  return authors
})

export const fetchAllBlueprints = createAsyncThunk(
  'blueprints/fetchAllBlueprints',
  async (_, { rejectWithValue }) => {
    try {
      return await blueprintsService.getAll()
    } catch (e) {
      if (e.response?.status === 401) throw e
      return rejectWithValue('No se pudieron obtener los blueprints')
    }
  },
)

export const fetchByAuthor = createAsyncThunk(
  'blueprints/fetchByAuthor',
  async (author, { rejectWithValue }) => {
    try {
      const items = await blueprintsService.getByAuthor(author)
      return { author, items }
    } catch (e) {
      if (e.response?.status === 404) {
        return rejectWithValue(`No hay blueprints para el autor "${author}"`)
      }
      throw e
    }
  },
)

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }, { rejectWithValue }) => {
    try {
      return await blueprintsService.getByAuthorAndName(author, name)
    } catch (e) {
      if (e.response?.status === 404) {
        return rejectWithValue(`No existe el plano "${name}" del autor "${author}"`)
      }
      throw e
    }
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  return await blueprintsService.create(payload)
})

export const updateBlueprintPoints = createAsyncThunk(
  'blueprints/updateBlueprintPoints',
  async ({ author, name, points }) => {
    for (const point of points) {
      await blueprintsService.updatePoints(author, name, point)
    }
    return { author, name, points }
  },
)

export const deleteBlueprint = createAsyncThunk(
  'blueprints/deleteBlueprint',
  async ({ author, name }) => {
    await blueprintsService.delete(author, name)
    return { author, name }
  },
)

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    all: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
    detailStatus: 'idle',
    detailError: null,
    saveStatus: 'idle',
    saveError: null,
    _rollback: null,
  },
  reducers: {
    clearSaveStatus: (s) => {
      s.saveStatus = 'idle'
      s.saveError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error?.message || 'Error'
      })
      .addCase(fetchAllBlueprints.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAllBlueprints.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.all = a.payload
      })
      .addCase(fetchAllBlueprints.rejected, (s, a) => {
        s.status = 'failed'
        s.error = typeof a.payload === 'string' ? a.payload : a.error?.message || 'Error'
      })
      .addCase(fetchByAuthor.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.status = 'failed'
        s.error = typeof a.payload === 'string' ? a.payload : a.error?.message || 'Error'
      })
      .addCase(fetchBlueprint.pending, (s) => {
        s.detailStatus = 'loading'
        s.detailError = null
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.detailStatus = 'succeeded'
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.detailStatus = 'failed'
        s.detailError = typeof a.payload === 'string' ? a.payload : a.error?.message || 'Error'
      })
      .addCase(createBlueprint.pending, (s) => {
        s.saveStatus = 'loading'
        s.saveError = null
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        const bp = a.payload
        s.saveStatus = 'succeeded'
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
      })
      .addCase(createBlueprint.rejected, (s, a) => {
        s.saveStatus = 'failed'
        s.saveError = a.error?.message || 'Error'
      })
      .addCase(updateBlueprintPoints.pending, (s, a) => {
        const { author, name, points } = a.meta.arg
        s.saveStatus = 'loading'
        s.saveError = null
        // Optimistic: append points to the current blueprint right away
        if (s.current && s.current.author === author && s.current.name === name) {
          s.current.points = [...(s.current.points || []), ...points]
        }
      })
      .addCase(updateBlueprintPoints.fulfilled, (s) => {
        s.saveStatus = 'succeeded'
      })
      .addCase(updateBlueprintPoints.rejected, (s, a) => {
        const { author, name, points } = a.meta.arg
        s.saveStatus = 'failed'
        s.saveError = a.error?.message || 'Error'
        // Rollback: remove the optimistically added points
        if (s.current && s.current.author === author && s.current.name === name) {
          const n = points.length
          s.current.points = (s.current.points || []).slice(0, -n)
        }
      })
      .addCase(deleteBlueprint.pending, (s, a) => {
        const { author, name } = a.meta.arg
        s.saveStatus = 'loading'
        s.saveError = null
        // Optimistic: remove from the list, keep a copy to rollback if needed
        if (s.byAuthor[author]) {
          s._rollback = { author, items: s.byAuthor[author], all: s.all }
          s.byAuthor[author] = s.byAuthor[author].filter((bp) => bp.name !== name)
        }
        s.all = s.all.filter((bp) => !(bp.author === author && bp.name === name))
        if (s.current && s.current.author === author && s.current.name === name) {
          s.current = null
        }
      })
      .addCase(deleteBlueprint.fulfilled, (s) => {
        s._rollback = null
        s.saveStatus = 'succeeded'
      })
      .addCase(deleteBlueprint.rejected, (s, a) => {
        if (s._rollback) {
          s.byAuthor[s._rollback.author] = s._rollback.items
          s.all = s._rollback.all
          s._rollback = null
        }
        s.saveStatus = 'failed'
        s.saveError = a.error?.message || 'Error'
      })
  },
})

export const { clearSaveStatus } = slice.actions

export default slice.reducer
