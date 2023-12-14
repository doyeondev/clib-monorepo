export function filterArticle(clauses) {
  let data = []
  clauses.map((clause, i) => {
    if (clause.tag === 'h2') data.push(clause)
  })
  return data
}
