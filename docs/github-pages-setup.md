# GitHub Pages Setup Guide

This guide covers setting up automatic deployment to GitHub Pages for the DevTools Hub project.

## Prerequisites

- GitHub repository created
- Node.js 18+ installed locally
- Git account with repository access

## Step 1: Repository Setup

### Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it `devtools-hub` (or your preferred name)
3. Initialize with a README (optional, we'll replace it)

### Clone and Setup Project
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/devtools-hub.git
cd devtools-hub

# Copy scaffoldings to root (if using the scaffoldings folder)
cp -r scaffoldings/* .

# Install dependencies
npm install
```

## Step 2: Configure GitHub Pages

### Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **"GitHub Actions"**

### Update Vite Configuration
Edit `vite.config.ts` and update the base path:

```typescript
// Replace 'devtools-hub' with your repository name
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

For example, if your repo is `my-dev-tools`:
```typescript
base: process.env.NODE_ENV === 'production' ? '/my-dev-tools/' : '/',
```

## Step 3: GitHub Actions Workflow

### The Workflow File
The `.github/workflows/deploy.yml` file is already configured with:

- **Build Job**: Installs dependencies, runs tests, builds the project
- **Deploy Job**: Deploys to GitHub Pages (only on main branch pushes)
- **Permissions**: Proper permissions for GitHub Pages deployment
- **Concurrency**: Prevents multiple deployments from running simultaneously

### Enable Workflow Permissions
1. Go to repository **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"**

## Step 4: Deploy for the First Time

### Push to Main Branch
```bash
# Add all files
git add .

# Commit changes
git commit -m "feat: initial DevTools Hub setup"

# Push to main branch
git push origin main
```

### Monitor Deployment
1. Go to repository **Actions** tab
2. You should see the "Build and Deploy to GitHub Pages" workflow running
3. Wait for both **build** and **deploy** jobs to complete successfully

### Check Deployment
Once deployment completes:
1. Go to repository **Settings** → **Pages**
2. You should see the deployment URL: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
3. Click the link to view your live site!

## Step 5: Custom Domain (Optional)

### Setup Custom Domain
1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `tools.mycompany.com`)
3. Click **Save**

### DNS Configuration
GitHub will show you the DNS records to add. For example:

**For apex domain (`mycompany.com`):**
- Type: `A`
- Value: `185.199.108.153`

**For subdomain (`tools.mycompany.com`):**
- Type: `CNAME`
- Value: `YOUR_USERNAME.github.io`

### SSL Certificate
GitHub automatically provisions SSL certificates for custom domains. This may take a few minutes.

## Step 6: Development Workflow

### Making Changes
```bash
# Create a feature branch
git checkout -b feature/add-new-tool

# Make your changes
# ... edit files ...

# Test locally
npm run dev

# Build and preview
npm run build
npm run preview

# Commit and push
git add .
git commit -m "feat: add new tool functionality"
git push origin feature/add-new-tool
```

### Pull Request Process
1. Create a pull request from your feature branch to `main`
2. GitHub Actions will run tests on the PR
3. Once approved and merged, deployment happens automatically

### Rollback (if needed)
If you need to rollback:
```bash
# Create a revert commit
git revert HEAD~1
git push origin main
```

## Troubleshooting

### Build Failures

#### Common Issues:
1. **Node version mismatch**: Ensure Actions uses Node 18
2. **Dependencies not found**: Check `package.json` is correct
3. **Build timeout**: Large bundles may need optimization

#### Debug Steps:
1. Check the Actions tab for detailed error logs
2. Test build locally: `npm run build`
3. Check for TypeScript errors: `npm run type-check`

### Deployment Issues

#### 404 Errors on Refresh:
This is normal for SPAs. The `_redirects` file handles routing.

#### Custom Domain Not Working:
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Ensure domain doesn't have conflicting records

### Performance Issues

#### Bundle Too Large:
- Check the build output size in Actions logs
- Consider code splitting or lazy loading
- Review dependencies for bloat

## Environment Variables

### For Analytics (Optional)
Create `.env.local`:
```bash
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Repository Secrets (if needed)
For future enhancements like error tracking:
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add secrets like `SENTRY_DSN`, `ANALYTICS_KEY`, etc.

## Monitoring Deployments

### GitHub Pages Analytics
- View deployment history in repository **Settings** → **Pages**
- Check build status in **Actions** tab
- Monitor performance with browser dev tools

### Custom Analytics
Add analytics tracking in your React app for user behavior insights.

## Maintenance

### Regular Tasks
- Keep dependencies updated: `npm audit` and `npm update`
- Monitor bundle size and performance
- Review and merge pull requests promptly
- Backup important configurations

### Security
- Regularly audit dependencies for vulnerabilities
- Keep GitHub Actions up to date
- Monitor for security advisories on used packages

## Support

If you encounter issues:
1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the Actions workflow logs
3. Test locally before pushing
4. Create an issue in the repository

## Success Checklist

- [ ] Repository created on GitHub
- [ ] GitHub Pages enabled with Actions source
- [ ] Workflow permissions configured
- [ ] Vite config updated with correct base path
- [ ] First deployment successful
- [ ] Site accessible at GitHub Pages URL
- [ ] Custom domain configured (optional)
- [ ] HTTPS working
- [ ] Development workflow established

Congratulations! Your DevTools Hub is now live on GitHub Pages with automatic deployments! 🎉
