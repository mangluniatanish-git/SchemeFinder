# SchemeFinder — Integration Setup Guide

This document lists every external service, credential, and manual step required to enable each feature of the SchemeFinder platform.

> **Note:** The platform runs in **Demo Mode** without any configuration. All UI works. Profile matching works using rule-based parsing. Only external integrations (AI, DB, notifications) require manual setup.

---

## Integration Checklist

| Integration | Status | Required For | Priority |
|---|---|---|---|
| MongoDB | ⚠ REQUIRED | Persistence, saved profiles, auth | High |
| JWT Secret | ⚠ REQUIRED | User authentication | High |
| AI Provider (Gemini/OpenAI) | OPTIONAL | Natural language profile extraction | Medium |
| PDF/DOCX parsing (npm) | OPTIONAL | CV upload feature | Medium |
| Email service | OPTIONAL | Scheme Radar alerts | Low |
| WhatsApp Business API | OPTIONAL | WhatsApp alerts | Low |
| Browser Push (VAPID) | OPTIONAL | Push notifications | Low |
| Google OAuth | OPTIONAL | Google sign-in | Low |
| Scheme Radar cron | OPTIONAL | Automated scheme monitoring | Medium |

---

## 1. MongoDB — REQUIRED

**What you need:** A MongoDB connection string.

**Options:**
- [MongoDB Atlas (free tier available)](https://www.mongodb.com/cloud/atlas) — recommended for production
- Local MongoDB: `mongodb://localhost:27017/schemefinder`

**Steps:**
1. Create a MongoDB Atlas account or install MongoDB locally
2. Create a database named `schemefinder`
3. Get your connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/schemefinder`

**What happens without it:** Server runs in Demo Mode — 6 seed schemes, no persistence, no auth.

---

## 2. JWT Secret — REQUIRED (if using auth)

**What you need:** A random 64-byte hex string.

**Generate:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Add to `.env`:** `JWT_SECRET=<generated_value>`

**What happens without it:** Auth routes return 503. All other features still work.

---

## 3. AI Provider — OPTIONAL

Used for: Natural language profile extraction from text descriptions and CV content.

**Without AI:** Rule-based keyword extraction still works well for common cases.

**Choose one provider:**

### Option A — Google Gemini (Recommended)
- Free tier available
- Get API key: https://aistudio.google.com/app/apikey
- Set in `.env`:
  ```
  AI_PROVIDER=gemini
  AI_API_KEY=AIza...
  AI_MODEL=gemini-1.5-flash
  AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
  ```

### Option B — OpenAI
- Requires paid account
- Get API key: https://platform.openai.com/api-keys
- Set in `.env`:
  ```
  AI_PROVIDER=openai
  AI_API_KEY=sk-...
  AI_MODEL=gpt-4o-mini
  AI_BASE_URL=https://api.openai.com/v1
  ```

### Option C — Anthropic Claude
- Requires paid account
- Get API key: https://console.anthropic.com
- Set in `.env`:
  ```
  AI_PROVIDER=anthropic
  AI_API_KEY=sk-ant-...
  AI_MODEL=claude-3-haiku-20240307
  AI_BASE_URL=https://api.anthropic.com/v1
  ```

**Privacy:** AI provider receives only the text the user explicitly provides. Original CVs are not stored. Users are informed before AI processing.

---

## 4. CV / Document Parsing — OPTIONAL

Used for: Extracting profile information from uploaded PDF and DOCX files.

**What you need:** npm packages (no API keys — runs locally)

**Steps:**
```bash
cd server
npm install pdf-parse mammoth
```

Then in `server/routes/profile.js`, uncomment the CV extraction blocks marked:
```js
// INTEGRATION: Uncomment after: npm install pdf-parse mammoth
```

**Security:** Files are processed in memory (no temp files on disk). Original file is not retained after extraction.

---

## 5. Email Notifications — OPTIONAL

Used for: Scheme Radar alerts, deadline reminders, new scheme notifications.

**Choose one provider:**

### Option A — Resend (Recommended)
1. Create account: https://resend.com
2. Add your sending domain
3. Get API key
4. Set in `.env`:
   ```
   EMAIL_PROVIDER=resend
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_API_KEY=re_...
   ```
5. Install: `npm install resend`

### Option B — SendGrid
1. Create account: https://sendgrid.com
2. Verify sender domain
3. Get API key
4. Set in `.env`:
   ```
   EMAIL_PROVIDER=sendgrid
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_API_KEY=SG...
   ```
5. Install: `npm install @sendgrid/mail`

### Option C — SMTP
```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=app_password
```

---

## 6. WhatsApp Business API — OPTIONAL

Used for: WhatsApp scheme alerts.

**What you need:**
- A verified Meta Business account
- A WhatsApp Business phone number
- Approved message templates for scheme alerts

**Steps:**
1. Apply for WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
2. Get your phone number ID and business account ID from Meta Developer Console
3. Create and get approval for a scheme alert message template
4. Set in `.env`:
   ```
   WHATSAPP_ACCESS_TOKEN=EAA...
   WHATSAPP_PHONE_NUMBER_ID=123...
   WHATSAPP_BUSINESS_ACCOUNT_ID=456...
   WHATSAPP_TEMPLATE_NAME=scheme_alert
   ```
5. Install: `npm install axios`

**Timeline:** Meta template approval typically takes 2–7 business days.

---

## 7. Browser Push Notifications — OPTIONAL

Used for: In-browser scheme alerts for users who opt in.

**Steps:**
1. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Set in `.env`:
   ```
   VAPID_PUBLIC_KEY=BGa...
   VAPID_PRIVATE_KEY=abc...
   VAPID_SUBJECT=mailto:contact@schemefinder.in
   ```
3. Install: `npm install web-push`
4. The frontend service worker needs to be registered (implementation pending)

---

## 8. Google OAuth — OPTIONAL

Used for: "Sign in with Google" option.

**Steps:**
1. Create a project in Google Cloud Console: https://console.cloud.google.com
2. Enable Google Identity API
3. Create OAuth 2.0 credentials (Web application)
4. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Set in `.env`:
   ```
   GOOGLE_CLIENT_ID=123...apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCS...
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```
6. Install: `npm install passport passport-google-oauth20`

---

## 9. Scheme Radar — OPTIONAL

Used for: Automatically detecting new schemes, application openings, deadline changes.

**Architecture:**
```
Official Sources → Monitoring Cron → Change Detection → Profile Matching → Notifications
```

**Requirements:**
- MongoDB must be configured (step 1)
- At least one notification channel (email/WhatsApp/push) configured

**Steps:**
1. Install: `npm install node-cron`
2. Set cron schedule in `.env`: `SCHEME_RADAR_CRON=0 */6 * * *` (every 6 hours)
3. Implement source monitors in `server/services/schemeRadar.js`

**Important:** Only monitor sources that permit automated access. Check robots.txt and terms of service. Official government APIs are preferred when available. See: https://apisetu.gov.in for official Indian government APIs.

---

## 10. Running the Project

### Development

**Frontend only (demo mode):**
```bash
# In project root
npm run dev
# Opens at http://localhost:5173
```

**With backend:**
```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
cd server
npm install
npm run dev
# Backend at http://localhost:5000
```

**With MongoDB + AI:**
1. Copy `.env.example` → `.env`
2. Fill in `MONGODB_URI` and `JWT_SECRET`
3. (Optional) Fill in AI credentials
4. Run both servers as above

### Production
```bash
# Build frontend
npm run build

# Start backend
cd server
npm start
```

Set `VITE_API_BASE_URL` to your production backend URL before building.

---

## 11. Deployment

### Recommended Architecture

| Component | Platform |
|---|---|
| Frontend | Vercel (free) |
| Backend | Railway / Render / Fly.io |
| Database | MongoDB Atlas |
| AI | Google Gemini (pay-per-use) |

### Vercel (Frontend)
1. Connect GitHub repo
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend.railway.app`
5. **NEVER add `AI_API_KEY`, `JWT_SECRET`, or `MONGODB_URI` to Vercel frontend env**

### Railway (Backend)
1. Create new project → Deploy from GitHub
2. Set root directory to `server/`
3. Add all backend environment variables via Railway dashboard
4. **All secrets stay on Railway backend — never in the frontend**

---

## 12. Security Checklist

Before going to production:

- [ ] `JWT_SECRET` is a strong random value (64+ characters)
- [ ] `MONGODB_URI` uses a dedicated database user with minimal permissions
- [ ] `.env` file is in `.gitignore` (already done)
- [ ] No API keys in frontend code or Vite env vars
- [ ] `NODE_ENV=production` in production
- [ ] HTTPS is configured on backend
- [ ] `FRONTEND_URL` is set to your actual domain for CORS
- [ ] File upload limits are configured
- [ ] Rate limiting is enabled (already implemented)
- [ ] Admin routes are tested to reject non-admin users
- [ ] All uploaded files are deleted after processing

---

## 13. Government Data Sources

SchemeFinder currently uses manually curated scheme data. For automated data:

| Source | Access | Notes |
|---|---|---|
| myScheme.gov.in | Web portal | Check ToS before automated access |
| API Setu | https://apisetu.gov.in | Official Indian government API platform |
| National Scholarship Portal | https://scholarships.gov.in | NSP API available for some data |
| State government portals | Varies by state | Check each state's portal |

**Important:** Always check the terms of service and robots.txt of any government website before implementing automated data access. Use official APIs when available.

---

*Generated by SchemeFinder setup. Last updated: September 2026.*
