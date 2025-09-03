# Replit Setup Guide for AI Governance Navigator

## Step-by-Step Instructions

### 1. Import from GitHub to Replit

1. **Go to Replit**: https://replit.com
2. **Click "Create Repl"** or **"+"** button
3. **Select "Import from GitHub"**
4. **Enter GitHub URL**: `https://github.com/hemdesai/AIGovNav`
5. **Replit will auto-detect as Node.js project**
6. **Name**: Keep as `AIGovNav` 
7. **Click "Import from GitHub"**

### 2. Configure Environment Variables (Secrets)

Once imported, set up these secrets in Replit:

1. **Click on "Secrets" (🔐 lock icon)** in the Tools panel
2. **Add these secrets:**

```env
# Database (we'll set up Supabase next)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# Supabase (create free account at supabase.com)
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Context7 MCP (for documentation)
CONTEXT7_API_KEY=your-context7-key

# JWT Secret (generate a random string)
JWT_SECRET=your-random-jwt-secret

# App Settings
NODE_ENV=development
PORT=4000
FRONTEND_URL=https://AIGovNav.hemdesai.repl.co
```

### 3. Set Up Supabase (Free Tier)

1. **Go to**: https://supabase.com
2. **Sign up** for free account
3. **Create New Project**:
   - Name: `ai-governance-navigator`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. **Once created, go to Settings → API**:
   - Copy `URL` → paste in `SUPABASE_URL`
   - Copy `anon public` key → paste in `SUPABASE_ANON_KEY`
   - Copy `service_role` key → paste in `SUPABASE_SERVICE_KEY`
5. **Go to Settings → Database**:
   - Copy connection string → paste in `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your database password

### 4. Initial Setup Commands

Run these in the Replit Shell:

```bash
# Install dependencies
npm install

# Set up Prisma
npx prisma generate
npx prisma db push

# Create initial directories
mkdir -p src/backend src/frontend src/components src/hooks src/types
mkdir -p tests/unit tests/integration
mkdir -p scripts
```

### 5. Enable GitHub Integration

1. **In Replit, click "Version control"** (Git icon)
2. **Connect to GitHub**
3. **Authorize Replit** to access your GitHub
4. **Pull/Push/Commit** directly from Replit

### 6. Configure Auto-Deploy

1. **In Replit, go to "Deployments"**
2. **Choose "Production"**
3. **Set up deployment**:
   - Deploy on push to `main` branch
   - Auto-scale enabled
   - Health check endpoint: `/api/health`

### 7. Development Workflow

#### Start Development:
```bash
npm run dev
```
This runs both frontend (Vite) and backend (Express) concurrently.

#### Run Swarms:
**Terminal 1:**
```bash
npm run swarm:designer
```

**Terminal 2:**
```bash
npm run swarm:engineer
```

#### Database Management:
```bash
# View database in browser
npm run db:studio

# Run migrations
npm run db:migrate
```

### 8. Access Points

Once running in Replit:

- **Frontend**: `https://AIGovNav.hemdesai.repl.co`
- **Backend API**: `https://AIGovNav.hemdesai.repl.co:4000/api`
- **Database Studio**: `https://AIGovNav.hemdesai.repl.co:5555`

### 9. Context7 MCP Integration

To get Context7 API key:
1. Visit Context7 documentation site
2. Sign up for developer account
3. Generate API key
4. Add to Replit secrets

### 10. Troubleshooting

#### If dependencies fail:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### If database connection fails:
- Check Supabase is running
- Verify DATABASE_URL format
- Check firewall/connection settings in Supabase

#### If port conflicts:
- Modify `.replit` file port configurations
- Ensure no duplicate port assignments

### Next Steps After Setup:

1. **Run initial swarm agents** to generate code
2. **Set up monitoring** dashboards
3. **Configure CI/CD** pipelines
4. **Set up staging environment**

## Ready to Code! 🚀

Your Replit environment is now configured for:
- Full-stack development
- Swarm agent execution
- Database management
- GitHub integration
- Automated deployments