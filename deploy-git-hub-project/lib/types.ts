import type { UIMessage } from 'ai'

export type AdvisorSource = { ref: string; source: string; location: string; excerpt: string }

export type AdvisorMetadata = {
  mode?: string
  studentLabel?: string
  sources?: AdvisorSource[]
  durationMs?: number
}

export type AdvisorMessage = UIMessage<AdvisorMetadata>
