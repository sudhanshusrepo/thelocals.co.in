#!/bin/bash

# Environment Setup Script for The Lokals Platform
# This script helps you set up your environment variables

echo "🚀 The Lokals Platform - Environment Setup"
echo "=========================================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy example file
cp .env.example .env
echo "✅ Created .env file from template"
echo ""

# Prompt for Supabase URL
echo "📝 Please enter your Supabase configuration:"
read -p "Supabase URL (e.g., https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY

# Prompt for Gemini API Key
echo ""
echo "📝 Please enter your Google Gemini API configuration:"
read -p "Gemini API Key (optional, press Enter to skip): " GEMINI_API_KEY

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # macOS or Linux
    sed -i.bak "s|your_supabase_project_url_here|$SUPABASE_URL|g" .env
    sed -i.bak "s|your_supabase_anon_key_here|$SUPABASE_ANON_KEY|g" .env
    if [ ! -z "$GEMINI_API_KEY" ]; then
        sed -i.bak "s|your_gemini_api_key_here|$GEMINI_API_KEY|g" .env
    fi
    rm .env.bak
else
    # Windows (Git Bash)
    sed -i "s|your_supabase_project_url_here|$SUPABASE_URL|g" .env
    sed -i "s|your_supabase_anon_key_here|$SUPABASE_ANON_KEY|g" .env
    if [ ! -z "$GEMINI_API_KEY" ]; then
        sed -i "s|your_gemini_api_key_here|$GEMINI_API_KEY|g" .env
    fi
fi

echo ""
echo "✅ Environment variables configured successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Run database migrations: npm run db:migrate"
echo "   2. Start the development server: npm run dev:client"
echo ""
echo "📖 For more information, see ENV_SETUP.md"
