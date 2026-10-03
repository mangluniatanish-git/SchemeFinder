# SchemeFinder Backend — Integration Setup Guide

## Quick Start (Demo Mode — No Config Required)

```bash
cd server
npm install
npm run dev
```

The server starts on **port 5000** in demo mode with 6 seed schemes.
Check `http://localhost:5000/api/health` to confirm it's running.

---

## Step 1: MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Copy the connection string into `server/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/schemefinder
```

After connecting, seed the database by importing `services/seedData.js` via a seed script or MongoDB Compass.

---

## Step 2: Authentication Setup

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env`:

```env
JWT_SECRET=<your_generated_secret>
JWT_EXPIRES_IN=7d
```

**To create your first admin user:**
1. Register via `POST /api/auth/register`
2. Open MongoDB Compass or Atlas
3. Find the user document, set `isAdmin: true` manually
4. There is NO API to grant admin — this is intentional

---

## Step 3: AI Profile Extraction

### Google Gemini (Recommended — Free Tier Available)
1. Get API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add to `.env`:
```env
AI_PROVIDER=gemini
AI_API_KEY=your_key_here
AI_MODEL=gemini-1.5-flash
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

### OpenAI
```env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
AI_BASE_URL=https://api.openai.com/v1
```

---

## Step 4: CV Text Extraction

Install the text extraction libraries:

```bash
npm install pdf-parse mammoth
```

Then uncomment the integration code in `routes/profile.js`:
- PDF: Uncomment the `pdf-parse` block in `POST /api/profile/extract/cv`
- DOCX: Uncomment the `mammoth` block in the same route

---

## Step 5: Scheme Radar (Alerts)

Full alert system requires:

1. **Cron job** — install `node-cron`:
   ```bash
   npm install node-cron
   ```
   Create `services/schemeRadar.js` with a scheduled job that:
   - Fetches scheme updates from official sources
   - Compares against stored profiles
   - Queues notifications

2. **Email notifications** — install `nodemailer`:
   ```bash
   npm install nodemailer
   ```
   Configure SMTP in `.env` (see `.env.example`)

3. **WhatsApp/SMS** — install `twilio`:
   ```bash
   npm install twilio
   ```

---

## API Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | None | Server + DB status |
| GET | `/api/schemes` | None | List schemes (paginated, filtered) |
| GET | `/api/schemes/:id` | None | Get single scheme |
| POST | `/api/match` | None | Match schemes to profile |
| POST | `/api/profile/extract/text` | None | AI text → profile |
| POST | `/api/profile/extract/cv` | None | CV upload → profile |
| POST | `/api/profile` | Optional | Save profile |
| GET | `/api/profile` | Optional | Get profile |
| DELETE | `/api/profile` | Optional | Delete profile |
| GET | `/api/ai/status` | None | AI config status |
| POST | `/api/auth/register` | None | Create account |
| POST | `/api/auth/login` | None | Login |
| GET | `/api/auth/me` | Required | Get current user |
| DELETE | `/api/auth/account` | Required | Delete account |
| GET | `/api/alerts` | Optional | Get scheme alerts |
| POST | `/api/alerts/preferences` | Required | Set notification prefs |
| GET | `/api/admin/schemes` | Admin | List all schemes |
| POST | `/api/admin/schemes` | Admin | Add scheme |
| PUT | `/api/admin/schemes/:id` | Admin | Update scheme |
| DELETE | `/api/admin/schemes/:id` | Admin | Archive scheme |
| PUT | `/api/admin/schemes/:id/status` | Admin | Update status |
