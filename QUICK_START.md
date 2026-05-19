# 🚀 Quick Reference Guide - Delivery System

## 🎯 Start Here

**New to the project?** Follow this in order:

1. **Read this file** ← You are here
2. **Read README.md** (5 min) - Project overview
3. **Read SETUP_GUIDE.md** (10 min) - Installation instructions
4. **Run `docker-compose up -d`** (5 min) - Start services
5. **Test at `http://localhost:3000`** - Frontend access

**Total time: ~20 minutes to get running!**

---

## 📍 Quick Navigation

### Need to...

#### Start the Project
```bash
# Option 1: Docker (Recommended)
docker-compose up -d

# Option 2: Locally
cd backend && npm install && npm run dev  # Terminal 1
cd web && npm install && npm run dev      # Terminal 2
cd mobile && npm install && npm start     # Terminal 3
```

#### View Running Services
```bash
# Check Docker containers
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Access Applications
| App | URL | Port |
|-----|-----|------|
| Backend API | http://localhost:5000 | 5000 |
| Web Frontend | http://localhost:3000 | 3000 |
| Database | localhost | 5432 |
| Redis | localhost | 6379 |

#### Test API
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","role":"customer","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

#### Deploy to Production
```bash
# Heroku
heroku create app-name
heroku config:set DATABASE_URL=...
git push heroku main

# Docker Registry
docker build -t my-repo/delivery-system .
docker push my-repo/delivery-system
```

---

## 🗂️ Project Structure (Simple View)

```
delivery-system/
├── backend/          ← Node.js API
│   ├── src/
│   │   ├── models/   ← Database schemas
│   │   ├── routes/   ← API endpoints
│   │   ├── controllers/ ← Request handlers
│   │   ├── services/ ← Business logic
│   │   └── middleware/ ← Auth, errors
│   └── Dockerfile
│
├── web/             ← React Dashboard
│   ├── src/
│   │   ├── pages/   ← React pages
│   │   ├── store/   ← State management
│   │   └── utils/   ← API helpers
│   └── Dockerfile
│
├── mobile/          ← React Native App
│   ├── src/
│   │   ├── screens/ ← App screens
│   │   └── store/   ← State management
│   └── app.json
│
└── docker-compose.yml ← Orchestration
```

---

## 🔑 Important Files

### Backend
- **`backend/src/index.js`** - Main server file
- **`backend/package.json`** - Dependencies
- **`backend/.env`** - Configuration
- **`backend/src/routes/`** - API routes

### Frontend
- **`web/src/App.jsx`** - Main component
- **`web/package.json`** - Dependencies
- **`web/src/pages/`** - Page components

### Mobile
- **`mobile/App.js`** - Main app
- **`mobile/package.json`** - Dependencies
- **`mobile/src/screens/`** - Screens

### Config
- **`docker-compose.yml`** - Multi-container setup
- **`.env.example`** - Environment template
- **`.gitignore`** - Git rules

---

## 📚 Documentation Files

| File | Length | Purpose |
|------|--------|---------|
| README.md | 2000 lines | Complete documentation |
| SETUP_GUIDE.md | 1500 lines | Installation guide |
| PROJECT_SUMMARY.md | 1000 lines | Project overview |
| FILES_INVENTORY.md | 500 lines | File listing |
| This file | 300 lines | Quick reference |

**Total: 5,300 lines of documentation!**

---

## 💻 Common Commands

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f            # View logs
docker-compose ps                 # Check status
docker-compose exec backend bash  # Access container
```

### NPM
```bash
npm install                       # Install dependencies
npm run dev                       # Development server
npm run build                     # Production build
npm start                         # Run production
npm test                          # Run tests
```

### Git
```bash
git clone <url>                   # Clone repo
git add .                         # Stage changes
git commit -m "message"           # Commit
git push origin main              # Push to main
git pull                          # Get latest
```

### Database
```bash
psql delivery_db -U delivery_user # Connect to DB
\dt                               # List tables
\q                                # Quit
```

---

## 🔑 Test Credentials

```
Email: admin@example.com          Email: driver@example.com
Password: admin123                Password: driver123
Role: admin                       Role: driver

Email: customer@example.com
Password: customer123
Role: customer
```

Or create your own via the register form at `http://localhost:3000`

---

## 🌐 API Endpoints (Quick Reference)

### Authentication
```
POST   /api/auth/register         - Create account
POST   /api/auth/login            - Login
POST   /api/auth/refresh-token    - Refresh token
```

### Orders
```
POST   /api/orders                - Create order
GET    /api/orders                - List orders
GET    /api/orders/:id            - Get order
PATCH  /api/orders/:id/status     - Update status
```

### Drivers
```
GET    /api/drivers               - List drivers
GET    /api/drivers/:id           - Get driver
PATCH  /api/drivers/location      - Update location
```

### Admin
```
GET    /api/admin/dashboard       - Dashboard stats
GET    /api/admin/users           - List users
POST   /api/admin/drivers/:id/verify - Verify driver
```

**Full API docs in README.md**

---

## 🛠️ Troubleshooting

### Can't start services?

**Port already in use:**
```bash
# Kill process using port
lsof -i :5000  # Find process
kill -9 <PID>  # Kill it
```

**Database connection error:**
```bash
# Check PostgreSQL
psql postgres
CREATE DATABASE delivery_db;
```

**Dependencies missing:**
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Can't access frontend?

1. Check `npm run dev` is running
2. Open http://localhost:3000
3. Check browser console for errors
4. Check `.env` configuration

### Can't login?

1. Register a new account first
2. Use correct email/password
3. Check server logs: `docker-compose logs -f backend`
4. Verify database is running

---

## 📊 Technology Stack

### Backend
- Node.js 18
- Express.js
- PostgreSQL
- Redis
- Socket.io

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand
- Axios

### Mobile
- React Native
- Expo
- Zustand
- Axios

### Infrastructure
- Docker
- Docker Compose
- PostgreSQL 14
- Redis 7

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `.env` with production values
- [ ] Change JWT secret
- [ ] Set `NODE_ENV=production`
- [ ] Configure database URL
- [ ] Configure Redis URL
- [ ] Test all endpoints
- [ ] Set up monitoring
- [ ] Configure SSL/TLS
- [ ] Set up backups
- [ ] Review security settings

---

## 📈 Performance Tips

1. **Enable Redis caching** - Speeds up queries
2. **Use CDN** - For static assets
3. **Optimize images** - Reduce file size
4. **Database indexing** - Add indexes to frequently queried fields
5. **API pagination** - Limit results per page
6. **Gzip compression** - Compress responses
7. **HTTP caching** - Browser caching

---

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Validate all inputs
- [ ] Use prepared statements (ORM does this)
- [ ] Hash passwords (bcrypt)
- [ ] Set secure cookies
- [ ] Add CORS properly

---

## 📞 Getting Help

### Documentation
1. README.md - Full docs
2. SETUP_GUIDE.md - Installation
3. PROJECT_SUMMARY.md - Overview
4. CODE COMMENTS - In each file

### Debugging
1. Check logs: `docker-compose logs -f`
2. Check console: Browser DevTools
3. Check database: pgAdmin or `psql`
4. Check environment: `.env` file

### Issues
1. Check existing issues
2. Create new issue with details
3. Include error messages
4. Include your setup (OS, versions)

---

## 💡 Pro Tips

1. **Use Postman** for API testing
2. **Use pgAdmin** for database management
3. **Use DBeaver** for SQL queries
4. **Use Redux DevTools** for state debugging
5. **Use Chrome DevTools** for frontend debugging
6. **Use React DevTools** for component inspection
7. **Use Docker Desktop** for container management

---

## 🎯 Next Steps

### Immediate (Today)
1. [ ] Get code running locally
2. [ ] Test all endpoints
3. [ ] Create test data
4. [ ] Understand architecture

### Short Term (This Week)
1. [ ] Customize styling
2. [ ] Add your branding
3. [ ] Deploy to staging
4. [ ] Get feedback

### Medium Term (This Month)
1. [ ] Add custom features
2. [ ] Implement payments
3. [ ] Add notifications
4. [ ] Set up CI/CD

### Long Term (This Quarter)
1. [ ] Deploy to production
2. [ ] Monitor performance
3. [ ] Gather user feedback
4. [ ] Plan enhancements

---

## ✨ Success Indicators

You know it's working when:

- ✅ `docker-compose ps` shows all containers running
- ✅ http://localhost:5000/api/health returns `{"status":"OK"}`
- ✅ http://localhost:3000 loads login page
- ✅ Can register and login successfully
- ✅ Can create and view orders
- ✅ API returns data in real-time
- ✅ Mobile app opens and connects
- ✅ No console errors

---

## 🎓 Learning Resources

### Backend Development
- Express.js docs: expressjs.com
- Sequelize ORM: sequelize.org
- PostgreSQL docs: postgresql.org

### Frontend Development
- React docs: react.dev
- Vite docs: vitejs.dev
- Tailwind docs: tailwindcss.com

### Mobile Development
- React Native docs: reactnative.dev
- Expo docs: docs.expo.dev

### DevOps
- Docker docs: docker.com
- Docker Compose: docs.docker.com/compose

---

## 📞 Quick Commands Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Access backend container
docker-compose exec backend bash

# Run backend locally
cd backend && npm run dev

# Run frontend locally
cd web && npm run dev

# Run mobile locally
cd mobile && npm start

# Test API
curl http://localhost:5000/api/health

# Connect to database
psql delivery_db -U delivery_user
```

---

## 🏁 You're All Set!

**Your full-stack delivery system is ready to:**
- ✅ Run locally
- ✅ Deploy to cloud
- ✅ Scale for production
- ✅ Extended with features

**Start with: `docker-compose up -d` and visit http://localhost:3000**

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅

Need more info? Check README.md or SETUP_GUIDE.md!
