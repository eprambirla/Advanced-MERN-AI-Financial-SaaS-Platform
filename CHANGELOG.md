# Changelog

## [Unreleased] - 2026-05-03

### Security
- Added JWT refresh token mechanism with server-side token revocation
- Added rate limiting on auth endpoints (10 requests/15 min) and API (100 requests/15 min)
- Added Helmet.js security headers middleware
- Added input sanitization middleware to prevent XSS attacks
- Changed password reset tokens to JWT-based (was: random crypto tokens)
- Added email verification flow on registration

### Backend
- Added graceful shutdown handling (SIGTERM/SIGINT)
- Added request logging middleware with structured JSON output
- Added response caching middleware for GET requests
- Enabled cron jobs in all environments (was: development only)
- Added pagination defaults and caps (DEFAULT_PAGE_SIZE=10, MAX_PAGE_SIZE=100)
- Added amount range and date range filters for transaction search
- Added centralized enums for all constants (categories, payment methods, etc.)
- Added upcoming recurring transactions endpoint
- Added bulk edit transactions endpoint

### Frontend
- Added React Error Boundary for graceful error handling
- Added lazy loading with Suspense for all route pages
- Added form autosave hook (saves to sessionStorage)
- Added keyboard shortcuts hook with common shortcuts
- Added persistent toast notifications for important errors
- Added image optimization hook for Cloudinary URLs
- Updated refresh token flow in auth expiration hook
- Removed "Free Trial" badge from user nav

### Features
- Budget rollover support (50% of unused budget carries over)
- Upcoming recurring transactions preview (next 30 days)
- Bulk edit transactions (category, payment method, type, etc.)
- Transaction filtering by amount range and date range
- Email verification on registration

### DevEx
- Added .env.example files for backend and client
- Added Docker and docker-compose configuration
- Added nginx configuration for production client
- Added GitHub Actions CI workflow
- Added .dockerignore files
- Added lint scripts to package.json
- Removed deprecated xss-clean package

### Bug Fixes
- Fixed missing /auth/refresh-token endpoint
- Fixed test error on root route
- Removed dead code (empty cards/, services/ directories)
