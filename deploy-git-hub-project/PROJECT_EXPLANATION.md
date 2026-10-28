# Academic Advisor: How the Project Works

## What the application does

This is a web-based academic question-and-answer tool for Vidyashilp University B.Tech students. It can search four supplied university documents and, in one mode, combine those passages with one of several synthetic student profiles. Gemini generates a streamed answer. The advisor prompt asks the model to cite retrieved passages and to say when the available documents do not support an answer.

The files are fixed project data; the app does **not** upload or read documents supplied by a user in the browser. The profiles in `lib/students.ts` are hard-coded synthetic examples, not records fetched from a student database.

## Technologies

- **Next.js 16** serves the React pages and the server-side chat API.
- **React 19** renders the interactive screen.
- **TypeScript** checks the application's types.
- **Tailwind CSS 4** and the local components style the interface.
- **AI SDK 7** (`ai`, `@ai-sdk/react`) manages model requests and streamed chat messages.
- **`@ai-sdk/google`** connects the server-side AI SDK to Google's Gemini API.
- **`unpdf`** extracts text from PDFs; **`xlsx`** reads spreadsheets.
- **pnpm 12.3.4** is the package manager selected by `package.json` and `pnpm-lock.yaml`.

The package versions are locked in `pnpm-lock.yaml`. The AI SDK packages declare Node.js 22 or newer; Next.js 16 declares Node.js 20.9 or newer. The installed Node.js 22.18.0 meets both requirements.

## Folder and important-file map

```text
project-root/
|-- app/
|   |-- api/chat/route.ts       Server-side chat endpoint and Gemini call
|   |-- globals.css             Global Tailwind theme and application styles
|   |-- layout.tsx              Shared HTML layout, font, page metadata, analytics
|   `-- page.tsx                Home page; renders AdvisorApp
|-- components/
|   |-- advisor/
|   |   |-- advisor-app.tsx     Client chat state, mode/profile selection, API transport
|   |   |-- chat-composer.tsx   Question input, send and stop controls
|   |   |-- chat-messages.tsx   Conversation, examples, citations and source excerpts
|   |   `-- settings-panel.tsx  Pipeline modes and synthetic profile selector
|   `-- ui/button.tsx           Shared button component
|-- data/                       Source PDFs and Excel workbooks
|-- lib/
|   |-- knowledge/chunks.json   Generated text chunks used by retrieval
|   |-- prompts.ts              Advisor rules, modes and prompt construction
|   |-- retrieve.ts             Local BM25-style text search
|   |-- students.ts             Synthetic profiles and profile lookup
|   |-- types.ts                Chat source and metadata types
|   `-- utils.ts                Shared class-name helper
|-- public/
|   |-- apple-icon.png          Apple home-screen icon
|   |-- icon-dark-32x32.png     Dark-theme favicon
|   |-- icon-light-32x32.png    Light-theme favicon
|   |-- icon.svg                Vector favicon
|   |-- placeholder-logo.png    Placeholder logo image
|   |-- placeholder-logo.svg    Placeholder logo vector
|   |-- placeholder-user.jpg    Placeholder user image
|   |-- placeholder.jpg         Placeholder image
|   |-- placeholder.svg         Placeholder vector image
|   `-- images/
|       |-- campus.png          Campus image shown in the empty chat screen
|       `-- vu-logo.png         University logo in the header
|-- scripts/build-knowledge.mjs Extracts documents and writes chunks.json
|-- .env.local                  Local Gemini key; ignored by Git
|-- .gitignore                  Excludes secrets and generated dependencies/build files
|-- components.json             UI component generator configuration
|-- next.config.mjs             Next.js configuration and security headers
|-- package.json                Project identity, scripts, dependencies and pnpm pin
|-- pnpm-lock.yaml              Exact dependency resolution
|-- pnpm-workspace.yaml         pnpm workspace/package installation settings
|-- postcss.config.mjs          Tailwind/PostCSS plugin configuration
|-- tsconfig.json               TypeScript compiler options and `@/` import alias
|-- SETUP_GUIDE.md              Beginner Windows/VS Code setup steps
|-- PROJECT_EXPLANATION.md      This architecture and code-flow explanation
`-- TROUBLESHOOTING.md          Verified setup errors and fixes
```

Generated directories such as `node_modules\` and `.next\` are created by install/build commands and are not source files.

## How the frontend works

`app/page.tsx` renders `AdvisorApp`, which is a client-side React component. `useChat` from `@ai-sdk/react` maintains the conversation and sends messages to `/api/chat` using `DefaultChatTransport`.

When a user chooses a question, `ask()` in `components/advisor/advisor-app.tsx` sends the text plus the selected mode and synthetic student ID. `chat-composer.tsx` provides the text box, Enter-to-send behavior, and stop button. `settings-panel.tsx` lets the user compare four pipeline modes and choose a synthetic profile. `chat-messages.tsx` renders the messages as Markdown and displays citations and a collapsible list of the source passages the server retrieved.

## How the server and Gemini work

The API endpoint is `app/api/chat/route.ts`. It runs on the server, where the Google SDK can read `GOOGLE_GENERATIVE_AI_API_KEY` without sending that secret to the browser.

The request flow is:

1. The browser sends the recent chat messages, selected mode and student ID to `POST /api/chat`.
2. The route checks for a non-empty `GOOGLE_GENERATIVE_AI_API_KEY`. If it is missing, it responds with HTTP 503 and a setup message before trying to call Gemini.
3. The route keeps up to the last 20 messages, finds the last three user messages, and limits their combined text to 2,000 characters for retrieval.
4. For `rag` and `rag-profile` modes, `retrieve()` searches the local knowledge chunks and returns at most eight relevant passages. Other modes do not retrieve passages.
5. `buildSystemPrompt()` adds the advisor rules, retrieved context and—only for `rag-profile`—the selected synthetic profile.
6. `convertToModelMessages()` adapts the UI chat history to the model format. `streamText()` calls `google('gemini-3.6-flash')` at temperature 0.2 and streams the response back.
7. The stream includes metadata for the chosen mode, profile label, source names/locations/excerpts and response time. The UI shows the answer and source details.

The model ID was checked against Google's current Gemini API model list: `gemini-3.6-flash` is listed as a stable model. The AI SDK Google provider reads `GOOGLE_GENERATIVE_AI_API_KEY` by default. This confirms the configured SDK and documented API identifier; a live successful call still requires a valid key and available quota.

The route allows at most 60 seconds for the hosting platform and aborts the provider request after 55 seconds or when the browser cancels it. It maps timeout, overloaded-model and key errors to short user-facing messages rather than returning raw provider details.

## How document processing and retrieval work

The source files are:

- `data/student-handbook-aug-2026.pdf`
- `data/sop-student-aug-2026.pdf`
- `data/Semester_Spread_Structures_Sept_2026-efc3d7.xlsx`
- `data/Minor_Courses_for_BTech_Students-604425.xlsx`

`scripts/build-knowledge.mjs` extracts PDF text page by page with `unpdf`, reads workbook sheets with `xlsx`, and splits the cleaned text into overlapping chunks. Semester course tables receive an additional structured conversion so course codes, titles, prerequisites and L-T-P-C values stay together. The script writes the result to `lib/knowledge/chunks.json`. Running it on the included source data generated 216 chunks from four source labels.

`lib/retrieve.ts` tokenizes each chunk and query, removes common stop words, scores matches using a BM25-style formula, and adds a bonus when a query contains a course code that appears in a chunk. This is local keyword retrieval, not a vector database or embedding search. Up to eight top-scoring chunks are inserted into the model's system prompt as `[S1]`, `[S2]`, etc. The model is instructed to cite those labels; the interface shows the corresponding source name, location and excerpt.

## What the modes mean

- **Basic LLM (`baseline`)**: a simple general prompt, with no university document retrieval or profile.
- **Structured prompt (`structured`)**: the advisor rules are used, but no documents or profile are provided.
- **RAG (`rag`)**: advisor rules plus retrieved university-document passages; no profile.
- **RAG + Student data (`rag-profile`)**: retrieved passages plus the selected synthetic profile. This is the initial mode.

When no passages are found, the prompt says that no university documents are available for the answer. The application cannot guarantee that model output is correct; important academic decisions should be confirmed with the Academic Office.

## Environment variables and secrets

`.env.local` is a private local settings file loaded by Next.js. Its only expected setting is:

```dotenv
GOOGLE_GENERATIVE_AI_API_KEY=your_real_key_goes_here
```

The checked-in local file contains an empty value, not a real or fabricated key. `.gitignore` excludes `.env*.local`; confirm before pushing with:

```powershell
git check-ignore -v .env.local
```

Never add `NEXT_PUBLIC_` to this variable: that prefix is for values intentionally exposed to browser code. For hosting, add the same variable through the hosting provider's private environment-variable settings rather than uploading `.env.local`.

## Install, run, stop and build

In a VS Code PowerShell terminal:

```powershell
cd "C:\Users\ASUS\Downloads\deploy-git-hub-project"
& "$env:APPDATA\npm\pnpm.cmd" install --frozen-lockfile
& "$env:APPDATA\npm\pnpm.cmd" dev
```

Visit `http://localhost:3000`. Press **Ctrl+C** in the terminal to stop the server. Run the `dev` command again to restart it.

To check types and create a production build:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" exec tsc --noEmit
& "$env:APPDATA\npm\pnpm.cmd" build
```

The package scripts are `dev`, `build` and `start`. There is no test script. Regenerate the document index with `node scripts\build-knowledge.mjs` after updating source documents.

## Example question traced through the actual code

Suppose the user selects **RAG + Student data**, keeps **Student A**, and asks: “Can I take Machine Learning next semester?”

1. `ChatComposer` calls `onSubmit`; `AdvisorApp.ask()` calls `sendMessage()` with the question and `{ mode: 'rag-profile', studentId: 'student-a' }`.
2. `DefaultChatTransport` sends that content to `/api/chat`.
3. The route retrieves passages matching the question from `lib/knowledge/chunks.json` and loads Student A through `getStudent('student-a')`.
4. `buildSystemPrompt()` combines the retrieved passages with the advisor rules and Student A's profile, including their semester, passed/failed courses and stated interest in Machine Learning.
5. The route calls the Gemini model with that prompt and the converted chat history. The reply streams to the browser.
6. The answer can include `[S1]` citations. `chat-messages.tsx` renders the Markdown and shows which document/page or workbook sheet each citation refers to.

The exact answer depends on what passages are found and on the live Gemini response; this explanation does not claim that a real API response was tested without a key.

## Git and deployment caution

No files were pushed or deployed. In the inspected environment, Git reports `C:\Users\ASUS` as the repository root, not this project folder; there is no remote configured and no project file is tracked there. Before committing or deploying, open the correct GitHub clone/repository and branch, verify its root with `git rev-parse --show-toplevel`, review `git status`, and confirm `.env.local` is ignored. Do not stage the entire Windows user folder.
