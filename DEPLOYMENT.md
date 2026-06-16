# Vercel Deployment

This project deploys as a Vercel Services project:

- `frontend` serves the Vite app at `/`
- `backend` serves the Express API at `/_/backend`

## Vercel project settings

Set the Vercel Framework Preset to **Services**. The services are already configured in `vercel.json`.

## Required environment variables

Set these in Vercel Project Settings under Environment Variables:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
MONGO_URI=your-mongodb-uri
```

If Razorpay payments are enabled, also set:

```env
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

Do not set `VITE_API_URL` on Vercel unless you intentionally want to use a separate external backend. The deployed app uses same-origin `/_/backend` by default.

## Google OAuth setup

In Google Cloud Console, add your deployed site to Authorized JavaScript origins:

```text
https://your-vercel-site.vercel.app
https://your-custom-domain.com
```

Keep local development if needed:

```text
http://localhost:5173
```

## Post-deploy check

After deployment, open:

```text
https://your-vercel-site.vercel.app/_/backend/api/health
```

Expected result:

```json
{
  "status": "ok",
  "storage": "mongodb",
  "googleAuth": "configured"
}
```
