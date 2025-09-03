# Local Development Setup - AI Governance Navigator

## Why Local Instead of Replit?

- **Instant Changes**: No git push/pull cycle
- **Better Performance**: Use your machine's full resources  
- **Easier Debugging**: Native debugging tools in VS Code
- **No Network Latency**: Direct connection to Supabase

## Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
# Check Node.js (need v18+)
node --version

# Check npm
npm --version

# If not installed, download from nodejs.org
```

### 2. Environment Setup
```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your Supabase credentials
# (Same ones you put in Replit Secrets)
```

### 3. Install Dependencies
```bash
# In C:\code\AIGovNav
npm install
```

### 4. Initialize Database
```bash
# Push schema to Supabase
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open database studio (optional)
npx prisma studio
```

### 5. Start Development
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:frontend
```

### 6. Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Database Studio**: http://localhost:5555
- **Monitoring**: Open swarm-monitor.html in browser

## Folder Structure for Local Dev

```bash
# Create these folders
mkdir src\backend\routes
mkdir src\backend\services  
mkdir src\backend\middleware
mkdir src\backend\utils

mkdir src\frontend\components
mkdir src\frontend\hooks
mkdir src\frontend\pages
mkdir src\frontend\types

mkdir tests\unit
mkdir tests\integration
```

## VS Code Extensions (Recommended)

1. **Prisma** - Syntax highlighting for schema
2. **ESLint** - Code quality
3. **Prettier** - Code formatting
4. **Thunder Client** - API testing
5. **GitLens** - Git integration

## Running Swarms Locally

### Terminal 1 - Designer Swarm:
```bash
npm run swarm:designer
```

### Terminal 2 - Engineer Swarm:
```bash
npm run swarm:engineer
```

### Terminal 3 - Monitor:
```bash
# Just open swarm-monitor.html in browser
start swarm-monitor.html
```

## Benefits Over Replit

1. **Speed**: 10x faster development cycle
2. **Control**: Full access to all tools and configs
3. **Debugging**: Use VS Code debugger with breakpoints
4. **Resources**: No limitations on CPU/RAM
5. **Privacy**: Code stays on your machine

## When to Use Replit?

- **Demos**: Show working app to stakeholders
- **Collaboration**: When working with remote team
- **Deployment**: As staging environment
- **Backup**: If local environment has issues

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 4000
netstat -ano | findstr :4000

# Kill the process
taskkill /PID <process_id> /F
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate --force

# Reset database
npx prisma db push --force-reset
```

### Node Modules Issues
```bash
# Clean install
rmdir /s node_modules
del package-lock.json
npm install
```

## Next Steps After Local Setup

1. Create initial API endpoint
2. Build first React component
3. Test database connection
4. Implement authentication flow
5. Start swarm agents for code generation

Ready to develop locally without network hops! 🚀