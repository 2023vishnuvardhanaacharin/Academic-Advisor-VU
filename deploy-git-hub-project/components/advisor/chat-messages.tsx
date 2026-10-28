'use client'

import type { ChatStatus } from 'ai'
import { BookOpen, Clock, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MODES } from '@/lib/prompts'
import type { AdvisorMessage } from '@/lib/types'

const SCENARIOS = [
  { tag: 'Follow-up', text: 'Can I take Machine Learning next semester?' },
  { tag: 'Regulation', text: 'What is the minimum attendance required to sit for end-semester exams?' },
  { tag: 'Prerequisite', text: 'What are the prerequisites for Optimization Techniques for Data Science?' },
  { tag: 'Minor', text: 'Which minor courses are available for B.Tech students and how many credits are needed?' },
  { tag: 'Missing info', text: 'What is the exact fee for re-registering a failed course?' },
  { tag: 'Conflict', text: 'Is Object Oriented Programming in semester 3 or semester 4?' },
]

type Props = { messages: AdvisorMessage[]; status: ChatStatus; onAsk: (text: string) => void }

export function ChatMessages({ messages, status, onAsk }: Props) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, status])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="relative h-40 w-full shrink-0 sm:h-48">
          <Image src="/images/campus.png" alt="Vidyashilp University campus building" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-primary-foreground">
            <h1 className="text-balance text-xl font-semibold sm:text-2xl">Ask your academic advisor</h1>
            <p className="mt-1 text-sm opacity-90">Grounded in the Student Handbook, SOP, semester structures and minor courses.</p>
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-sm font-semibold">Try a test scenario</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {SCENARIOS.map((s) => (
              <li key={s.text}>
                <button
                  type="button"
                  onClick={() => onAsk(s.text)}
                  className="flex h-full w-full flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary hover:bg-secondary"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{s.tag}</span>
                  <span>{s.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4" aria-live="polite">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {status === 'submitted' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Retrieving documents and thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: AdvisorMessage }) {
  const text = message.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">{text}</div>
      </div>
    )
  }

  const meta = message.metadata
  const modeLabel = MODES.find((m) => m.id === meta?.mode)?.label

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        {modeLabel && <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">{modeLabel}</span>}
        {meta?.studentLabel && <span>Profile: {meta.studentLabel}</span>}
        {meta?.durationMs !== undefined && (
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {(meta.durationMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>
      <div className="prose-advisor text-sm leading-relaxed">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      {meta?.sources && meta.sources.length > 0 && (
        <details className="rounded-lg border bg-muted/50 text-xs">
          <summary className="flex cursor-pointer items-center gap-1.5 px-3 py-2 font-medium">
            <BookOpen className="size-3.5" aria-hidden="true" />
            {meta.sources.length} retrieved sources
          </summary>
          <ol className="flex flex-col gap-2 border-t p-3">
            {meta.sources.map((s) => (
              <li key={s.ref} className="rounded-md bg-card p-2">
                <p className="font-semibold text-primary">
                  [{s.ref}] {s.source} <span className="font-normal text-muted-foreground">— {s.location}</span>
                </p>
                <p className="mt-1 line-clamp-4 whitespace-pre-line text-muted-foreground">{s.excerpt}</p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  )
}
