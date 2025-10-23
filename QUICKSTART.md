# Quick Start Guide

Get Task Tamer running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project details and wait for setup to complete
4. Go to Settings → API and copy:
   - Project URL
   - `anon` `public` key

## Step 3: Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

## Step 4: Set Up Database

1. Go to your Supabase project dashboard
2. Click SQL Editor in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase-setup.sql`
5. Click "Run" or press Ctrl+Enter

This creates all necessary tables and security policies.

## Step 5: Configure Authentication

1. In Supabase dashboard, go to Authentication → Providers
2. Ensure "Email" is enabled
3. Go to Authentication → Settings
4. **For development**: Disable "Confirm email"
   - This allows instant signup without email verification
   - Re-enable for production!

## Step 6: Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 7: Create Your Account

1. Click "Don't have an account? Sign up"
2. Enter your name, email, and password
3. Click "Sign Up"
4. You're in!

## What's Next?

1. Add your first tasks in different categories
2. Click "SPIN THE DAY" to get your daily task selection
3. Click on a task card to enter Focus mode
4. Complete tasks with the Pomodoro timer

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file values
- Make sure there are no extra spaces
- Restart the dev server after changing `.env`

### "RLS policy" or permission errors
- Run the `supabase-setup.sql` script again
- Check that you're logged into the correct Supabase project

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js 18+

### Can't sign up
- Go to Authentication → Settings in Supabase
- Make sure Email provider is enabled
- Disable email confirmation for development

## Production Deployment

When ready to deploy:

1. Enable email confirmation in Supabase
2. Set up a custom email template (optional)
3. Build the app: `npm run build`
4. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

Add your production URL to Supabase:
- Authentication → URL Configuration
- Add your site URL to "Site URL"
- Add redirect URLs if needed

