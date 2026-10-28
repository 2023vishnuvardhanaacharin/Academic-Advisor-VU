'use client'

import { RotateCcw } from 'lucide-react'
import { MODES, type Mode } from '@/lib/prompts'
import { getStudent, STUDENTS } from '@/lib/students'
import { cn } from '@/lib/utils'

type Props = {
  mode: Mode
  onModeChange: (mode: Mode) => void
  studentId: string
  onStudentChange: (id: string) => void
  onReset: () => void
  disabled: boolean
}

export function SettingsPanel({ mode, onModeChange, studentId, onStudentChange, onReset, disabled }: Props) {
  const student = getStudent(studentId)
  const profileActive = mode === 'rag-profile'

  return (
    <aside className="flex w-full flex-col gap-4 md:sticky md:top-20 md:max-h-[calc(100dvh-6rem)] md:w-72 md:shrink-0 md:overflow-y-auto lg:w-80">
      <section className="rounded-xl border bg-card p-4" aria-labelledby="mode-heading">
        <h2 id="mode-heading" className="text-sm font-semibold">Advisor pipeline</h2>
        <p className="mt-1 text-xs text-muted-foreground">Compare development stages for evaluation.</p>
        <div className="mt-3 flex flex-col gap-1.5" role="radiogroup" aria-labelledby="mode-heading">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              disabled={disabled}
              onClick={() => onModeChange(m.id)}
              className={cn(
                'flex flex-col rounded-lg border px-3 py-2 text-left transition-colors disabled:opacity-60',
                mode === m.id ? 'border-primary bg-secondary' : 'hover:bg-muted',
              )}
            >
              <span className="text-sm font-medium">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={cn('rounded-xl border bg-card p-4', !profileActive && 'opacity-70')} aria-labelledby="profile-heading">
        <div className="flex items-center justify-between">
          <h2 id="profile-heading" className="text-sm font-semibold">Synthetic student profile</h2>
          {!profileActive && <span className="text-[11px] text-muted-foreground">Not used in this mode</span>}
        </div>
        <label htmlFor="student" className="sr-only">Select student profile</label>
        <select
          id="student"
          value={studentId}
          disabled={disabled}
          onChange={(e) => onStudentChange(e.target.value)}
          className="mt-3 w-full rounded-lg border bg-background px-3 py-2 text-sm"
        >
          {STUDENTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.summary}
            </option>
          ))}
        </select>

        {student.id !== 'none' ? (
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="Semester" value={String(student.currentSemester)} />
            <Stat label="Credits" value={String(student.creditsEarned)} />
            <Stat label="CGPA" value={student.cgpa.toFixed(1)} />
            <Stat label="Attendance" value={`${student.attendancePercent}%`} warn={student.attendancePercent < 75} />
            <Stat label="Failed" value={String(student.failed.length)} warn={student.failed.length > 0} />
            <Stat label="Batch" value={student.batch} />
          </dl>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">The advisor will ask for any details it needs.</p>
        )}

        {student.id !== 'none' && (
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <CourseList label="Passed" items={student.passed} />
            {student.failed.length > 0 && <CourseList label="Failed" items={student.failed} tone="accent" />}
            <CourseList label="In progress" items={student.inProgress} />
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="flex items-center justify-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        New conversation
      </button>
    </aside>
  )
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-lg bg-muted px-2 py-1.5">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn('text-sm font-semibold', warn && 'text-accent')}>{value}</dd>
    </div>
  )
}

function CourseList({ label, items, tone }: { label: string; items: string[]; tone?: 'accent' }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.map((c) => (
          <span key={c} className={cn('rounded px-1.5 py-0.5', tone === 'accent' ? 'bg-accent/10 text-accent' : 'bg-secondary text-secondary-foreground')}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
