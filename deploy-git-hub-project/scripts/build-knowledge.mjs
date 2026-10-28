import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { extractText, getDocumentProxy } from 'unpdf'
import { read, utils } from 'xlsx'

const chunks = []
let id = 0

function pushChunks(source, label, text, size = 1400, overlap = 200) {
  const clean = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  if (!clean) return
  for (let start = 0; start < clean.length; start += size - overlap) {
    const piece = clean.slice(start, start + size).trim()
    if (piece.length > 60) chunks.push({ id: `c${id++}`, source, location: label, text: piece })
    if (start + size >= clean.length) break
  }
}

async function addPdf(path, source) {
  const pdf = await getDocumentProxy(new Uint8Array(readFileSync(path)))
  const { text } = await extractText(pdf, { mergePages: false })
  text.forEach((pageText, i) => pushChunks(source, `Page ${i + 1}`, pageText))
}

function addWorkbook(path, source) {
  const wb = read(readFileSync(path))
  for (const name of wb.SheetNames) {
    const rows = utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '' })
    const lines = rows
      .map((r) => r.map((c) => String(c).trim()).filter(Boolean).join(' | '))
      .filter(Boolean)
    pushChunks(source, `Sheet "${name}"`, lines.join('\n'), 1600, 250)
  }
}

function addSemesterSpread(path, source) {
  const wb = read(readFileSync(path))
  for (const name of wb.SheetNames) {
    const rows = utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '' })
    const semRow = rows.find((r) => r.some((c) => String(c).trim() === 'S1'))
    if (!semRow) continue
    const sems = semRow.map((c) => String(c).trim()).filter((v) => /^S\d$/.test(v))
    const headerRow = rows.find((r) => r.some((c) => String(c).trim() === 'Course Code'))
    const codeCols = []
    headerRow.forEach((c, i) => {
      if (String(c).trim() === 'Course Code') codeCols.push(i)
    })
    const semCols = codeCols.map((col, i) => ({ sem: sems[i] ?? `S${i + 1}`, col }))
    const firstCode = Math.min(...codeCols)
    const bySem = {}
    for (const r of rows.slice(rows.indexOf(headerRow) + 1)) {
      const basket = r.slice(0, firstCode).map((c) => String(c).trim()).filter(Boolean).join(' ')
      for (const { sem, col } of semCols) {
        const code = String(r[col] ?? '').trim()
        const title = String(r[col + 1] ?? '').trim()
        if (!code && !title) continue
        const pre = String(r[col + 2] ?? '').trim()
        const [L, T, P, C] = [3, 4, 5, 6].map((k) => String(r[col + k] ?? '').trim())
        ;(bySem[sem] ||= []).push(
          `${code} ${title} | Basket: ${basket || '-'} | Pre-req: ${pre || 'Nil'} | L-T-P-C: ${L}-${T}-${P}-${C}`,
        )
      }
    }
    for (const [sem, list] of Object.entries(bySem)) {
      pushChunks(source, `Sheet "${name}" - Semester ${sem.slice(1)}`, `Semester ${sem.slice(1)} courses (${name}):\n${list.join('\n')}`, 1800, 200)
    }
  }
}

await addPdf('data/student-handbook-aug-2026.pdf', 'Student Handbook (Aug 2026)')
await addPdf('data/sop-student-aug-2026.pdf', 'Student SOP (Aug 2026)')
addSemesterSpread('data/Semester_Spread_Structures_Sept_2026-efc3d7.xlsx', 'Semester Spread Structures (Sept 2026)')
addWorkbook('data/Semester_Spread_Structures_Sept_2026-efc3d7.xlsx', 'Semester Spread Structures (Sept 2026)')
addWorkbook('data/Minor_Courses_for_BTech_Students-604425.xlsx', 'Minor Courses for B.Tech Students')

mkdirSync('lib/knowledge', { recursive: true })
writeFileSync('lib/knowledge/chunks.json', JSON.stringify(chunks))
const counts = chunks.reduce((a, c) => ((a[c.source] = (a[c.source] || 0) + 1), a), {})
console.log('chunks', chunks.length, counts)
