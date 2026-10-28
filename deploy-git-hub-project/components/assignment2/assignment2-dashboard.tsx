'use client'

import Link from 'next/link'
import { useState } from 'react'

const phaseCards = [
  {
    title: 'Phase 8 • Multimodal Extension',
    score: '12',
    text: 'The advisor produces both explanatory text and visual/audio support for students, improving accessibility and clarity.',
  },
  {
    title: 'Phase 9 • Agentic Extension',
    score: '10',
    text: 'Separate retrieval, eligibility, credit, recommendation and verification agents work in a structured academic workflow.',
  },
  {
    title: 'Phase 10 • Privacy & Security Audit',
    score: '10',
    text: 'Sensitive academic data is classified, risks are tested and safeguards are documented for responsible AI use.',
  },
  {
    title: 'Phase 11 • Legal & Ethical Analysis',
    score: '8',
    text: 'Three generated outputs are reviewed for copyright, ownership, attribution, misuse, and institutional policy concerns.',
  },
  {
    title: 'Phase 12 • Deploy & Demonstrate',
    score: '10',
    text: 'The prototype is deployed, documented and presented through representative student advising scenarios.',
  },
]

const multimodalOutputs = [
  {
    title: 'Academic Infographic',
    summary: 'Semester roadmap and course sequence for a B.Tech student.',
    badge: 'Visual',
  },
  {
    title: 'Regulation Audio Brief',
    summary: 'A short spoken explanation of attendance and exam eligibility rules.',
    badge: 'Audio',
  },
  {
    title: 'Advisor Transcript',
    summary: 'Structured guidance text for course planning and decision-making.',
    badge: 'Text',
  },
]

const agentStages = [
  {
    name: 'Regulation Retrieval Agent',
    description: 'Extracts answers from official university documents and course policy sources.',
  },
  {
    name: 'Course Eligibility Agent',
    description: 'Checks prerequisites, backlog status, attendance thresholds and admissions conditions.',
  },
  {
    name: 'Credit Calculation Agent',
    description: 'Accounts for passed, failed and in-progress credits before making recommendations.',
  },
  {
    name: 'Recommendation Agent',
    description: 'Creates a course plan or next-step advice grounded in evidence and student profile.',
  },
  {
    name: 'Verification Agent',
    description: 'Reviews the final answer for accuracy, missing data and human escalation triggers.',
  },
]

const auditRows = [
  {
    risk: 'Sensitive student data exposure',
    issue: 'Academic record, CGPA, failed courses and attendance can reveal personal information.',
    safeguard: 'Use minimal context, explicit consent and avoid exposing all student records to the model.',
  },
  {
    risk: 'Prompt injection',
    issue: 'A student could hide malicious instructions inside a question or uploaded file to override policy.',
    safeguard: 'Use strict system prompts, deny override instructions, and validate untrusted text before model processing.',
  },
  {
    risk: 'Unauthorized access',
    issue: 'A user could ask for someone else’s academic information or internal policy content.',
    safeguard: 'Scope by student identity, require authenticated access and block cross-student queries.',
  },
  {
    risk: 'Accidental disclosure',
    issue: 'AI might answer with sensitive information outside the intended academic use case.',
    safeguard: 'Mask exact sensitive values when not needed and force a human review for high-risk decisions.',
  },
]

const legalOutputs = [
  {
    title: 'Generated text answer',
    rights: 'Text is an AI-generated synthesis of university material; it should be clearly labelled and not treated as an official policy document.',
  },
  {
    title: 'Infographic summary',
    rights: 'The layout may include university content and should retain attribution where institutional materials are used in the visual.',
  },
  {
    title: 'Audio brief',
    rights: 'Audio should not present itself as an official university announcement and should avoid using non-permitted recordings or copyrighted voices.',
  },
]

const scenarioQuestions = [
  'Can I take Machine Learning next semester?',
  'What is the minimum attendance required to sit for end-semester exams?',
  'What are the prerequisites for Optimization Techniques for Data Science?',
  'Which minor combinations are suitable for a B.Tech student with a business interest?',
]

function InfographicGraphic() {
  return (
    <svg viewBox="0 0 720 420" className="h-[260px] w-full rounded-2xl bg-slate-950 p-4 text-slate-50" role="img" aria-label="Academic planning infographic">
      <rect x="0" y="0" width="720" height="420" fill="#0f172a" rx="18" />
      <text x="36" y="48" fontSize="28" fontWeight="700" fill="#e2e8f0">Semester Roadmap</text>
      <text x="36" y="84" fontSize="16" fill="#94a3b8">B.Tech • Computer Science • Data Science</text>

      <rect x="36" y="120" width="130" height="220" rx="18" fill="#1d4ed8" opacity="0.9" />
      <text x="58" y="152" fontSize="15" fontWeight="700" fill="#eff6ff">Semester 3</text>
      <text x="58" y="186" fontSize="13" fill="#dbeafe">Data Structures</text>
      <text x="58" y="212" fontSize="13" fill="#dbeafe">Python</text>
      <text x="58" y="238" fontSize="13" fill="#dbeafe">Writing</text>
      <text x="58" y="285" fontSize="20" fontWeight="700" fill="#f8fafc">22 credits</text>

      <rect x="188" y="120" width="130" height="220" rx="18" fill="#0f766e" opacity="0.9" />
      <text x="212" y="152" fontSize="15" fontWeight="700" fill="#f0fdfa">Semester 4</text>
      <text x="212" y="186" fontSize="13" fill="#ccfbf1">OOP</text>
      <text x="212" y="212" fontSize="13" fill="#ccfbf1">Operating Systems</text>
      <text x="212" y="238" fontSize="13" fill="#ccfbf1">Probability</text>
      <text x="212" y="285" fontSize="20" fontWeight="700" fill="#f8fafc">24 credits</text>

      <rect x="340" y="120" width="130" height="220" rx="18" fill="#a16207" opacity="0.9" />
      <text x="364" y="152" fontSize="15" fontWeight="700" fill="#fefce8">Semester 5</text>
      <text x="364" y="186" fontSize="13" fill="#fef3c7">ML</text>
      <text x="364" y="212" fontSize="13" fill="#fef3c7">DBMS</text>
      <text x="364" y="238" fontSize="13" fill="#fef3c7">AI</text>
      <text x="364" y="285" fontSize="20" fontWeight="700" fill="#f8fafc">24 credits</text>

      <rect x="492" y="120" width="170" height="220" rx="18" fill="#7c3aed" opacity="0.92" />
      <text x="516" y="152" fontSize="15" fontWeight="700" fill="#f5f3ff">Action</text>
      <text x="516" y="186" fontSize="13" fill="#ede9fe">• Check pre-reqs</text>
      <text x="516" y="212" fontSize="13" fill="#ede9fe">• Review attendance</text>
      <text x="516" y="238" fontSize="13" fill="#ede9fe">• Confirm electives</text>
      <text x="516" y="285" fontSize="20" fontWeight="700" fill="#f8fafc">Advisor guidance</text>

      <path d="M166 230 H188" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M318 230 H340" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M470 230 H492" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Assignment2Dashboard() {
  const [audioStatus, setAudioStatus] = useState('Ready')
  const [audioMessage, setAudioMessage] = useState('')

  const speakRule = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioStatus('Browser does not support speech synthesis')
      return
    }

    const text =
      'Attendance and exam eligibility are handled through university rules. Students should check attendance thresholds, backlog requirements, and approved course sequences before registration.'

    setAudioMessage(text)
    setAudioStatus('Speaking...')
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.95
    utterance.onend = () => setAudioStatus('Finished')
    utterance.onerror = () => setAudioStatus('Audio generation failed in this browser')
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">VU AI Academic Advisor</p>
            <h1 className="text-lg font-bold text-slate-900">Assignment 2 Extension</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Original Advisor
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-700 p-6 text-white shadow-xl shadow-indigo-200/60">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-100">Responsible multimodal AI for academic advising</p>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Secure, multimodal, and agentic academic support that helps students without replacing human judgement.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
                This extension keeps the original RAG-based advisor, adds multimodal outputs and agentic planning, and audits privacy, legal, and ethical risk before production use.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Phases</p>
                <p className="mt-2 text-3xl font-bold">5</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Modalities</p>
                <p className="mt-2 text-3xl font-bold">3</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Risk lens</p>
                <p className="mt-2 text-3xl font-bold">A+</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {phaseCards.map((phase) => (
            <article key={phase.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                  Phase
                </span>
                <span className="text-sm font-bold text-indigo-700">{phase.score}</span>
              </div>
              <h3 className="text-sm font-semibold leading-snug text-slate-900">{phase.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{phase.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Phase 8</p>
              <h3 className="text-2xl font-bold text-slate-900">Multimodal extension</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">2+ modalities</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.45fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <InfographicGraphic />
            </div>

            <div className="space-y-4">
              {multimodalOutputs.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
                      {item.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-indigo-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">Audio briefing</p>
                    <p className="mt-1 text-sm text-slate-700">Human-friendly summary for attendance, policies and course planning.</p>
                  </div>
                  <button
                    type="button"
                    onClick={speakRule}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Play audio
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-600">Status: {audioStatus}</p>
                {audioMessage && <p className="mt-2 text-xs text-slate-600">{audioMessage}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Phase 9</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Agentic academic workflow</h3>
          <div className="mt-5 grid gap-4 lg:grid-cols-5">
            {agentStages.map((stage, index) => (
              <div key={stage.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Agent {index + 1}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">{stage.name}</h4>
                <p className="mt-2 text-sm text-slate-600">{stage.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Compared with the original RAG system</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900">
              <li>RAG performs evidence-based retrieval and answer generation in one step.</li>
              <li>The agentic workflow decomposes the task into regulation retrieval, eligibility checks, credit calculation and verification.</li>
              <li>It improves traceability and human review points, but should only be used when the added complexity produces clearer, safer decisions.</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Phase 10</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">Privacy and security audit</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Risk</th>
                    <th className="px-3 py-2 font-semibold">Issue</th>
                    <th className="px-3 py-2 font-semibold">Safeguard</th>
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((row) => (
                    <tr key={row.risk} className="border-t border-slate-200 align-top">
                      <td className="px-3 py-3 font-medium text-slate-900">{row.risk}</td>
                      <td className="px-3 py-3 text-slate-600">{row.issue}</td>
                      <td className="px-3 py-3 text-slate-600">{row.safeguard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Security testing</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">Representative scenarios</h3>
            <div className="mt-4 space-y-3">
              {scenarioQuestions.map((question) => (
                <div key={question} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Prompt:</span> {question}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <p className="font-semibold">Responsible handling recommendation</p>
              <p className="mt-2">
                The system should not reveal another student’s academic record, should not treat user prompts as overriding official policy, and should escalate sensitive decisions to a human advisor when uncertainty is high.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Phase 11</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Synthetic media, copyright and legal analysis</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {legalOutputs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{item.rights}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
            Practical rule: AI-generated content should be labelled clearly, university material should retain attribution, and sensitive or student-created content must not be used without permission or a clear policy basis.
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Phase 12</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Deployment, demonstration and documentation</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Prototype</p>
              <p className="mt-2 text-sm text-slate-600">The app remains deployed as a working academic advisor with multimodal and audit enhancements.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Evaluation</p>
              <p className="mt-2 text-sm text-slate-600">The design compares baseline RAG, agentic planning, and human-review checkpoints to assess practical value.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Report</p>
              <p className="mt-2 text-sm text-slate-600">A comprehensive report documents architecture, experiments, privacy decisions, legal considerations and final conclusions.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
