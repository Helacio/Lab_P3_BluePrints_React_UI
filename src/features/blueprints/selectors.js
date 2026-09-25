import { createSelector } from '@reduxjs/toolkit'

const selectByAuthor = (state) => state.blueprints.byAuthor
const selectAll = (state) => state.blueprints.all

export const selectAllBlueprints = createSelector(
  [selectByAuthor, selectAll],
  (byAuthor, all) => {
    const seen = new Set()
    return [...Object.values(byAuthor).flat(), ...(all || [])].filter((bp) => {
      const key = `${bp.author}/${bp.name}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  },
)

export const selectTop5ByPoints = createSelector([selectAllBlueprints], (all) =>
  [...all]
    .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
    .slice(0, 5),
)
