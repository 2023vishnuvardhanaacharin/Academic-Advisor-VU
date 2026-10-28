import { google } from '@ai-sdk/google'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { buildSystemPrompt, MODES, type Mode } from '@/lib/prompts'
import { retrieve } from '@/lib/retrieve'
import { getStudent } from '@/lib/students'
import type { AdvisorMetadata } from '@/lib/types'

export const maxDuration = 60

function textOf(message: UIMessage) {
  return message.parts.map((p) => (p.type === 'text' ? p.text : '')).join(' ')
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
    return new Response(
      'Gemini is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart the app.',
      { status: 503 },
    )
  }

  const body = (await req.json()) as { messages: UIMessage[]; mode?: string; studentId?: string }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : []
  const mode: Mode = MODES.some((m) => m.id === body.mode) ? (body.mode as Mode) : 'rag-profile'
  const student = getStudent(body.studentId)

  const recentUserText = messages
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map(textOf)
    .join(' ')
    .slice(0, 2000)

  const hits = mode === 'rag' || mode === 'rag-profile' ? retrieve(recentUserText, 8) : []
  const startedAt = Date.now()
  const abortSignal = AbortSignal.any([req.signal, AbortSignal.timeout(55_000)])

  const result = streamText({
    model: google('gemini-3.6-flash'),
    system: buildSystemPrompt(mode, hits, student),
    messages: await convertToModelMessages(messages),
    temperature: 0.2,
    abortSignal,
  })

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }): AdvisorMetadata | undefined => {
      if (part.type === 'start') {
        return {
          mode,
          studentLabel: mode === 'rag-profile' ? student.label : undefined,
          sources: hits.map((h, i) => ({
            ref: `S${i + 1}`,
            source: h.source,
            location: h.location,
            excerpt: h.text.slice(0, 420),
          })),
        }
      }
      if (part.type === 'finish') return { durationMs: Date.now() - startedAt }
      return undefined
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error)
      if (/timeout|timed out|deadline/i.test(message)) return 'The request timed out. Please try again.'
      if (/high demand|overloaded|503/i.test(message)) return 'The Gemini model is busy right now. Please try again in a few seconds.'
      if (/api key|permission|401|403/i.test(message)) return 'The Gemini API key was rejected. Check GOOGLE_GENERATIVE_AI_API_KEY in project settings.'
      return 'Something went wrong while generating the answer. Please try again.'
    },
  })
}
