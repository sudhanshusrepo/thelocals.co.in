# Environment Variables Setup Guide

## Required Environment Variables

The application requires the following environment variables to function properly:

### 1. Supabase Configuration

You need to set up your Supabase project credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get these values:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the **Project URL** (use for `VITE_SUPABASE_URL`)
5. Copy the **anon/public** key (use for `VITE_SUPABASE_ANON_KEY`)

### 2. Google Gemini AI Configuration

For AI-powered cost estimation:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**How to get this value:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Get API Key**
3. Create a new API key or use an existing one
4. Copy the key

## Setup Instructions

### For Development (Local)

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   - Replace `your_supabase_project_url_here` with your actual Supabase URL
   - Replace `your_supabase_anon_key_here` with your actual Supabase anon key
   - Replace `your_gemini_api_key_here` with your actual Gemini API key

3. **Restart your dev server:**
   ```bash
   npm run dev:client
   ```

### For Production (Vercel/Netlify)

Add these environment variables in your deployment platform's settings:

**Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable with its value

**Netlify:**
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add each variable with its value

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to Git (already in `.gitignore`)
- The `.env.example` file should NOT contain real values
- Keep your Supabase anon key and Gemini API key secure
- For production, consider moving Gemini API calls to Supabase Edge Functions to hide the API key

## Troubleshooting

### Error: "Supabase environment variables are missing"

**Solution:** Make sure you have created a `.env` file in the root directory with the correct values.

### Error: "Failed to fetch" or "ERR_NAME_NOT_RESOLVED"

**Solution:** Check that your `VITE_SUPABASE_URL` is correct and doesn't contain `placeholder.supabase.co`.

### Changes not reflecting

**Solution:** 
1. Stop the dev server (Ctrl+C)
2. Delete the `.vite` cache folder
3. Restart: `npm run dev:client`

## Example `.env` File

```bash
# Real example (with fake values - replace with your own)
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.example_signature_here
VITE_GEMINI_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567
```

## Next Steps

After setting up environment variables:

1. Run database migrations: `npm run db:migrate`
2. Start the development server: `npm run dev:client`
3. Test authentication by signing up/in
4. Test AI features by creating a service request
