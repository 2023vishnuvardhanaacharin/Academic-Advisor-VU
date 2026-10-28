'use client'

import { ArrowUp, Square } from 'lucide-react'
import { useState } from 'react'

type Props = { onSubmit: (text: string) => void; onStop: () => void; busy: boolean }

export function ChatComposer({ onSubmit, onStop, busy }: Props) {
  const [input, setInput] = useState('')

  function submit() {
    if (!input.trim() || busy) return
    onSubmit(input)
    setInput('')
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="border-t p-3"
    >
      <div className="flex items-end gap-2 rounded-xl border bg-background p-2 focus-within:ring-2 focus-within:ring-ring/40">
        <label htmlFor="question" className="sr-only">Ask an academic question</label>
        <textarea
          id="question"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Ask about courses, prerequisites, credits, attendance, minors..."
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        {busy ? (
          <button type="button" onClick={onStop} aria-label="Stop generating" className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
            <Square className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Send question"
            disabled={!input.trim()}
            className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Uses synthetic student data only. Always confirm decisions with the Academic Office.
      </p>
    </form>
  )
}
