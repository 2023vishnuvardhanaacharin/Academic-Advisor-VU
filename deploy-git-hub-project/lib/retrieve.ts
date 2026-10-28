import chunksData from './knowledge/chunks.json'

export type Chunk = { id: string; source: string; location: string; text: string }

const chunks = chunksData as Chunk[]

const STOPWORDS = new Set(
  'a an the and or of to in on for with is are was were be been can could i my me we our you your it its this that these those do does did what which who when where how will would should shall may might at by from as if not no yes so than then there their they them about into over under any all more most some such only also just get take next'.split(
    ' ',
  ),
)

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
}

const docTokens = chunks.map((c) => tokenize(`${c.source} ${c.location} ${c.text}`))
const avgLen = docTokens.reduce((s, t) => s + t.length, 0) / docTokens.length
const docFreq = new Map<string, number>()
for (const tokens of docTokens) {
  for (const t of new Set(tokens)) docFreq.set(t, (docFreq.get(t) ?? 0) + 1)
}
const termFreqs = docTokens.map((tokens) => {
  const tf = new Map<string, number>()
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
  return tf
})

const K1 = 1.4
const B = 0.75

export function retrieve(query: string, k = 8): (Chunk & { score: number })[] {
  const qTokens = [...new Set(tokenize(query))]
  if (qTokens.length === 0) return []
  const N = chunks.length
  const codes = (query.match(/\b[A-Za-z]{3,4}\s?\d{3}\b/g) ?? []).map((c) => c.replace(/\s/g, '').toUpperCase())

  const scored = chunks.map((chunk, i) => {
    const tf = termFreqs[i]
    const len = docTokens[i].length
    let score = 0
    for (const q of qTokens) {
      const f = tf.get(q)
      if (!f) continue
      const df = docFreq.get(q) ?? 0
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5))
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * len) / avgLen)))
    }
    for (const code of codes) if (chunk.text.toUpperCase().includes(code)) score += 4
    return { ...chunk, score }
  })

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

export const knowledgeStats = {
  chunks: chunks.length,
  sources: [...new Set(chunks.map((c) => c.source))],
}
