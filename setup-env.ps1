# Environment Setup Script for The Lokals Platform (PowerShell)
# This script helps you set up your environment variables

Write-Host "🚀 The Lokals Platform - Environment Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit 0
    }
}

# Copy example file
Copy-Item .env.example .env
Write-Host "✅ Created .env file from template" -ForegroundColor Green
Write-Host ""

# Prompt for Supabase URL
Write-Host "📝 Please enter your Supabase configuration:" -ForegroundColor Yellow
$SUPABASE_URL = Read-Host "Supabase URL (e.g., https://xxxxx.supabase.co)"
$SUPABASE_ANON_KEY = Read-Host "Supabase Anon Key"

# Prompt for Gemini API Key
Write-Host ""
Write-Host "📝 Please enter your Google Gemini API configuration:" -ForegroundColor Yellow
$GEMINI_API_KEY = Read-Host "Gemini API Key (optional, press Enter to skip)"

# Update .env file
$content = Get-Content .env
$content = $content -replace "your_supabase_project_url_here", $SUPABASE_URL
$content = $content -replace "your_supabase_anon_key_here", $SUPABASE_ANON_KEY
if ($GEMINI_API_KEY) {
    # Remove the VITE_ placeholder line
    $content = $content | Where-Object { $_ -notmatch "VITE_GEMINI_API_KEY" }
    # Add GEMINI_API_KEY for Edge Functions
    $content += "GEMINI_API_KEY=$GEMINI_API_KEY"
}
$content | Set-Content .env

Write-Host ""
Write-Host "✅ Environment variables configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run database migrations: npm run db:migrate"
Write-Host "   2. Start the development server: npm run dev:client"
Write-Host ""
Write-Host "📖 For more information, see ENV_SETUP.md" -ForegroundColor Gray
