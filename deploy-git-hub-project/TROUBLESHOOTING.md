# Academic Advisor: Troubleshooting

## `pnpm` is not recognized

**Observed cause:** pnpm was not available as a command on PATH. The npm global prefix is `C:\Users\ASUS\AppData\Roaming\npm`, and that directory is not on the current PATH.

**Verified solution:** pnpm 12.3.4 was installed in the user-level npm directory without Administrator access. Use its explicit PowerShell command:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" --version
```

It should print `12.3.4`. This avoids changing the Windows PATH. The same full command can be used for `install`, `dev`, `build` and other pnpm commands.

## Corepack says it cannot find `bin\pnpm.cjs`

**Observed cause:** the installed Corepack launcher is version 0.33.0 and its cached metadata points to a pnpm entry file that is not present in the pnpm 12.3.4 package layout.

**Verified solution:** use the installed user-level command at `$env:APPDATA\npm\pnpm.cmd` instead of `corepack pnpm`. The pnpm package version still matches the project's `packageManager` field.

## npm reports `ERR_INVALID_ARG_TYPE` and “The `file` argument must be of type string. Received undefined”

**Observed cause:** the npm debug log shows npm failed while launching pnpm's Windows `preinstall` script. The environment had no `ComSpec` value and no npm `script-shell`; npm passed an undefined shell executable to Node's child-process launcher. This was not caused by the project's dependencies or a locked pnpm process.

**Verified solution:** the installation succeeded after explicitly supplying the standard Windows command shell for that one invocation:

```powershell
$env:ComSpec = Join-Path $env:WINDIR 'System32\cmd.exe'
npm install --global pnpm@12.3.4 --script-shell $env:ComSpec
```

The environment assignment only lasts for that PowerShell process. It does not update system PATH or persistent npm configuration.

## `EPERM` while npm removes a pnpm directory

No pnpm or npm process was holding a lock during this investigation, and there was no existing pnpm package in the npm global folder before the repair. The original EPERM event could not be reproduced from the current state. Do not delete the whole npm global directory. If EPERM returns, close VS Code terminals that are running pnpm, check for a pnpm process, and retry the targeted install; do not delete project source, `pnpm-lock.yaml`, or `node_modules` as a first step.

## Gemini says it is not configured

Open the root `.env.local` file and enter the value from Google AI Studio:

```dotenv
GOOGLE_GENERATIVE_AI_API_KEY=your_real_key_here
```

Save it, stop the server with **Ctrl+C**, then start `dev` again. The server checks for a missing key and responds with HTTP 503 before calling Google. Do not paste the key into chat, commit it, or rename it with a `NEXT_PUBLIC_` prefix.

## Gemini rejects the key or model request

Check that the key is active, belongs to the intended Google AI Studio project, and is allowed to use the Gemini API. The application uses `@ai-sdk/google` and the server-only variable `GOOGLE_GENERATIVE_AI_API_KEY`. It requests the documented stable model `gemini-3.6-flash`. Key permissions, API availability, quotas and account settings cannot be verified without a live key.

The UI offers **Retry** for failed requests. The server returns a readable configuration error for a missing key and maps common authentication, overload and timeout errors to brief messages.

## The app does not open at port 3000

Read the development-server output in the VS Code terminal. If port 3000 is busy, Next.js normally selects another port and prints its URL. Open the printed URL. Stop a server you started with **Ctrl+C** before restarting it.

## Knowledge building prints PDF warnings

The verified `node scripts\build-knowledge.mjs` run completed and generated 216 chunks from the two PDFs and two spreadsheets. The PDF parser printed `TT: undefined function: 21` warnings while still extracting text. If a future run fails or the number of chunks unexpectedly changes, confirm all four expected files still exist under `data\`, then rerun the script and inspect its final `chunks` summary.

## TypeScript or production build fails

Run the type check first, then the production build:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" exec tsc --noEmit
& "$env:APPDATA\npm\pnpm.cmd" build
```

The Next.js configuration no longer suppresses TypeScript build errors. Fix the first reported source error and run the same check again. This project does not define a test script.

## Git shows unexpected files or the wrong repository root

The inspected Git root was `C:\Users\ASUS`, rather than the Academic Advisor folder. Do not stage from that root: it contains unrelated user files. Open or clone the intended GitHub repository into its own project directory and confirm `git rev-parse --show-toplevel` points to that directory before pushing. Verify `.env.local` is ignored with:

```powershell
git check-ignore -v .env.local
```
