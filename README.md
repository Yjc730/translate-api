# /api/translate for GitHub Pages frontends

Minimal Vercel Serverless API that translates English -> Traditional Chinese using an LLM.
- Endpoint: `POST /api/translate`
- Body: `{ "text": "..." }`
- Response: `{ "zh": "..." }`
- CORS: enabled (reflects Origin)

## Deploy

1. Create a new project on Vercel and import this folder/repo.
2. In **Settings → Environment Variables**, add:
   - `LLM_API_KEY`: your provider API key (OpenAI shown in code).
   - (optional) `LLM_MODEL` (default `gpt-4o-mini`).
   - (optional) `LLM_ENDPOINT` (default `https://api.openai.com/v1/chat/completions`).
3. Deploy. Your API will be available at:
   `https://<your-project>.vercel.app/api/translate`

## Test (curl)

curl -X POST "https://<your-project>.vercel.app/api/translate"   -H "Content-Type: application/json"   -d '{ "text": "A fault has been detected in the base station hardware." }'

## Connect from GitHub Pages

In your HTML, change:
  fetch('/api/translate', ...) 
to:
  fetch('https://<your-project>.vercel.app/api/translate', ...)