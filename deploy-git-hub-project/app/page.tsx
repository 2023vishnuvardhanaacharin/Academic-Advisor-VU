import Link from 'next/link'
import { AdvisorApp } from '@/components/advisor/advisor-app'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm font-medium text-foreground">Vidyashilp University AI Academic Advisor</div>
          <Link
            href="/assignment2"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Assignment 2 Extension
          </Link>
        </div>
      </div>
      <AdvisorApp />
    </div>
  )
}
