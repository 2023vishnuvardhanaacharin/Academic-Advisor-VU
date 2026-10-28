# AI Academic Advisor 2.0

A responsible, multimodal, agentic academic advising prototype built on top of the existing Vidyashilp University AI Academic Advisor.

## Project purpose

This extension satisfies the Assignment 2 requirements by adding:
- multimodal academic support using text, visual infographic, and audio briefing
- agentic workflow design for regulation retrieval, eligibility decisions, credit calculation and verification
- privacy and security audit for student data and prompt-injection scenarios
- legal and ethical analysis for AI-generated outputs
- deployment and presentation-ready documentation

## Existing base project

The original app is preserved as the main advisory interface and remains accessible at `/`.
The Assignment 2 dashboard is available at `/assignment2`.

## Local setup

1. Open a terminal in this directory.
2. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Copy `.env.example` to `.env.local` and add a valid Gemini key:
   ```bash
   cp .env.example .env.local
   ```
4. Run the app:
   ```bash
   pnpm dev
   ```
5. Open `http://localhost:3000`.

## Key routes

- `/` — original AI Academic Advisor
- `/assignment2` — Assignment 2 multimodal and ethical AI dashboard

## Notes

- The project uses the existing RAG architecture as the base.
- The assignment 2 extension adds responsible-AI evaluation, not just feature breadth.
- If the model key is missing, the app may return a clear 503 configuration message rather than a misleading answer.

## Report and presentation materials

The supporting documents are located in the `docs/` folder.
