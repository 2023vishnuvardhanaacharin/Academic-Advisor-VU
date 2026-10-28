# Academic Advisor: Windows and VS Code Setup

This guide is for the existing Academic Advisor project on Windows. The commands below are for the PowerShell terminal built into VS Code.

## What you need

- Node.js 22.18.0 is installed. This project needs Node.js 22 or newer: its AI SDK packages require Node.js 22, and Next.js 16 requires at least Node.js 20.9.
- The project pins pnpm 12.3.4 in `package.json` and has a pnpm lockfile. Use that version rather than switching package managers.
- A Google Gemini API key is needed to receive AI answers. The application can start without the key, but it will return a clear configuration error when you send a question.

## Open the project and install dependencies

In VS Code, choose **File → Open Folder** and open the project folder. Then open **Terminal → New Terminal** and run:

```powershell
cd "C:\Users\ASUS\Downloads\deploy-git-hub-project"
node --version
npm --version
& "$env:APPDATA\npm\pnpm.cmd" --version
& "$env:APPDATA\npm\pnpm.cmd" install --frozen-lockfile
```

The version commands should show Node `v22.18.0`, npm `10.9.3`, and pnpm `12.3.4`. The frozen install checks the existing `pnpm-lock.yaml` and installs exactly its dependency versions; it does not rewrite the lockfile.

In this Windows environment the npm global folder is not on PATH, so the full pnpm command path is intentional. It avoids changing the machine's PATH. If `pnpm.cmd` is not found, check the npm global prefix with `npm config get prefix`, then look for `pnpm.cmd` in that directory.

## Add your Gemini key locally

1. In VS Code, open the project-root file `.env.local`.
2. Replace the empty value after `GOOGLE_GENERATIVE_AI_API_KEY=` with your key from [Google AI Studio](https://aistudio.google.com/apikey).
3. Do not add quotes or share the key in chat, screenshots, source code, or GitHub.
4. Save the file and restart the development server if it is already running.

The project ignores `.env.local` through `.gitignore`. The API key is read by the server-side route only; it is not embedded in browser JavaScript. If the key has ever been committed or shared, revoke it in Google AI Studio and create another one.

## Build or refresh the knowledge chunks

The PDFs and spreadsheets are already in `data\`. To regenerate the static search index after changing those documents, run this from the project root:

```powershell
node scripts\build-knowledge.mjs
```

The script updates `lib\knowledge\chunks.json`. It currently creates 216 chunks from the four provided documents. Run it only after confirming the source files are present.

## Start the application

From the project root, run:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If port 3000 is already in use, Next.js will print the alternate local URL; use the URL it prints.

To stop the server, focus the VS Code terminal and press **Ctrl+C**. To restart it, run the `dev` command again.

## Useful commands

```powershell
# Check types without producing a production build
& "$env:APPDATA\npm\pnpm.cmd" exec tsc --noEmit

# Create a production build
& "$env:APPDATA\npm\pnpm.cmd" build

# Run the production build locally after building
& "$env:APPDATA\npm\pnpm.cmd" start

# Confirm installed top-level dependencies
& "$env:APPDATA\npm\pnpm.cmd" list --depth 0
```

This project does not define a test script, so there is no `pnpm test` command. TypeScript checking, the production build, and the browser/API checks are the available validations.

## Deployment overview

The project is a Next.js application and can be deployed to a compatible Next.js host such as Vercel. Do not deploy until you have reviewed the correct GitHub repository and branch.

1. Push the reviewed project changes to the intended GitHub repository and branch.
2. Import that repository into the hosting service.
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` in the host's server-side environment-variable settings. Do not upload `.env.local`.
4. Trigger a deployment and open the deployed URL.
5. Send a test academic question and confirm that the response includes citations and retrieved-source details.

No public deployment or Git push was performed during this work. The current Git root is `C:\Users\ASUS`, the project has no configured remote, and none of its files are tracked there. Do **not** stage or push from that home-directory repository.

After opening the actual GitHub clone for this project, verify that Git is rooted in that project and that the expected remote and branch are present:

```powershell
git rev-parse --show-toplevel
git remote -v
git branch --show-current
git branch --all
```

Only in that verified clone, stage the intended project files (not `.env.local`), review them, and push to the branch you confirmed:

```powershell
git add .gitignore SETUP_GUIDE.md PROJECT_EXPLANATION.md TROUBLESHOOTING.md app/api/chat/route.ts components/advisor/advisor-app.tsx next.config.mjs lib/knowledge/chunks.json
git status --short
git diff --cached
git commit -m "Fix Academic Advisor setup and Gemini integration"
git push origin <target-branch>
```

Replace `<target-branch>` with the real branch name. These are instructions only; no commit or push was made.
