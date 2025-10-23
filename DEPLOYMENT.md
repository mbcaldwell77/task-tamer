# Deployment Guide

## Pushing to GitHub

### First Time Setup

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name: `task-tamer`
   - Make it public or private
   - **Do NOT** initialize with README (we already have one)
   - Click "Create repository"

2. Push your local code:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/task-tamer.git

# Push all commits
git push -u origin master
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Subsequent Pushes

After making changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Deploying to Vercel (Recommended)

Vercel is perfect for React apps and has a generous free tier.

### Steps:

1. Push your code to GitHub (see above)

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "New Project"

4. Import your `task-tamer` repository

5. Configure project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your anon key

7. Click "Deploy"

8. Once deployed, copy your Vercel URL

9. Update Supabase:
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add `https://your-app.vercel.app/**` to "Redirect URLs"

Done! Your app is live.

## Deploying to Netlify

1. Push code to GitHub

2. Go to [netlify.com](https://netlify.com) and sign in

3. Click "Add new site" → "Import an existing project"

4. Choose GitHub and select your repository

5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

6. Add environment variables in Site settings → Environment variables

7. Deploy!

## Deploying to GitHub Pages

1. Install gh-pages:

```bash
npm install -D gh-pages
```

2. Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/task-tamer/',
  // ... rest of config
})
```

4. Deploy:

```bash
npm run deploy
```

5. Enable GitHub Pages:
   - Go to repository settings
   - Pages → Source → gh-pages branch
   - Save

Note: Environment variables need to be handled differently for GitHub Pages since it's static hosting.

## Environment Variables in Production

For security:

1. Never commit your `.env` file
2. Always use environment variables in your hosting platform
3. Rotate your Supabase keys if accidentally exposed
4. Use Row Level Security (RLS) in Supabase (already configured)

## Monitoring and Logs

### Vercel
- Check deployment logs in the Vercel dashboard
- View runtime logs in Functions tab

### Netlify
- Check build logs in Deploys tab
- View function logs if using Netlify Functions

### Supabase
- Monitor database queries in Database → Query Performance
- Check auth logs in Authentication → Logs
- View API usage in Settings → API

## Custom Domain (Optional)

### Vercel:
1. Go to project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records

## Updates and Maintenance

To update your live app after making changes:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Vercel/Netlify will auto-deploy
```

For manual deployments, re-run the deploy command for your platform.

## Troubleshooting Production Issues

### "Invalid API key" in production
- Check environment variables in hosting platform
- Verify variable names match exactly
- Redeploy after adding variables

### Auth not working
- Check Supabase URL configuration
- Verify redirect URLs include your production domain
- Ensure email confirmation is properly configured

### Build fails
- Check build logs for specific errors
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

### App works locally but not in production
- Check browser console for errors
- Verify environment variables are set
- Check Supabase RLS policies
- Ensure CORS is configured if needed

