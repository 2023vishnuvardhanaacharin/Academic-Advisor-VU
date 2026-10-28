'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import Image from 'next/image'
import { useState } from 'react'
import type { Mode } from '@/lib/prompts'
import type { AdvisorMessage } from '@/lib/types'
import { ChatComposer } from './chat-composer'
import { ChatMessages } from './chat-messages'
import { SettingsPanel } from './settings-panel'

export function AdvisorApp() {
  const [mode, setMode] = useState<Mode>('rag-profile')
  const [studentId, setStudentId] = useState('student-a')
  const { messages, sendMessage, status, error, stop, setMessages, regenerate } = useChat<AdvisorMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const busy = status === 'submitted' || status === 'streaming'

  function ask(text: string) {
    if (!text.trim() || busy) return
    sendMessage({ text }, { body: { mode, studentId } })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Image src="/images/vu-logo.png" alt="Vidyashilp University" width={132} height={40} className="h-9 w-auto" priority />
            <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
            <span className="hidden text-sm font-semibold text-primary sm:block">AI Academic Advisor</span>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Gemini 3.6 Flash · RAG
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:flex-row md:items-start">
        <SettingsPanel
          mode={mode}
          onModeChange={setMode}
          studentId={studentId}
          onStudentChange={setStudentId}
          onReset={() => setMessages([])}
          disabled={busy}
        />

        <main className="flex min-h-[70dvh] flex-1 flex-col md:h-[calc(100dvh-6rem)] md:min-h-[28rem] overflow-hidden rounded-xl border bg-card">
          <ChatMessages messages={messages} status={status} onAsk={ask} />
          {error && (
            <div role="alert" className="mx-4 mb-2 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <span>{error.message || 'Something went wrong.'}</span>
              <button type="button" onClick={() => regenerate({ body: { mode, studentId } })} className="font-medium underline underline-offset-2">
                Retry
              </button>
            </div>
          )}
          <ChatComposer onSubmit={ask} onStop={stop} busy={busy} />
        </main>
      </div>
    </div>
  )
}
