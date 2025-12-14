# CORS Troubleshooting Guide

## Why is my login request being blocked by CORS in production?

CORS (Cross-Origin Resource Sharing) errors occur when your frontend (running on one domain) tries to make requests to your backend (running on another domain), and the backend hasn't explicitly allowed that origin.

## Common Causes

1. **Missing or incorrect `CORS_ORIGINS` environment variable** - The production backend doesn't know which frontend URL to allow
2. **Origin mismatch** - The exact origin (protocol + domain + port) must match exactly
3. **Trailing slash differences** - `https://example.com` vs `https://example.com/`
4. **Protocol mismatch** - `http://` vs `https://`
5. **Port number differences** - `https://example.com` vs `https://example.com:443`

## How to Fix

### Step 1: Identify Your Frontend URL

Find out what URL your frontend is actually using in production. Common scenarios:

- **Vercel**: `https://your-app.vercel.app` or `https://your-custom-domain.com`
- **Netlify**: `https://your-app.netlify.app` or `https://your-custom-domain.com`
- **Custom domain**: `https://yourdomain.com`

### Step 2: Set the CORS_ORIGINS Environment Variable

In your production environment (server, Docker, or deployment platform), set the `CORS_ORIGINS` environment variable to include your frontend URL(s).

**Important**: 
- Use the **exact** origin (protocol + domain, no trailing slash)
- Separate multiple origins with commas
- Use `https://` for production (not `http://`)
- Do NOT include wildcards (`*`) when using `allow_credentials=True`

#### Example for Docker Compose:

```yaml
environment:
  - CORS_ORIGINS=https://fifa-tracker-web-five.vercel.app,https://your-custom-domain.com
```

#### Example for .env file:

```env
CORS_ORIGINS=https://fifa-tracker-web-five.vercel.app,https://your-custom-domain.com
```

#### Example for server environment:

```bash
export CORS_ORIGINS="https://fifa-tracker-web-five.vercel.app,https://your-custom-domain.com"
```

### Step 3: Verify the Configuration

After setting the environment variable, restart your backend service and check the logs. You should see:

```
CORS Origins configured: ['https://fifa-tracker-web-five.vercel.app', ...]
Clean CORS Origins: ['https://fifa-tracker-web-five.vercel.app', ...]
```

### Step 4: Test CORS Configuration

1. **Use the debug endpoint**: Visit `https://your-backend-url/cors-debug` from your browser or with curl:
   ```bash
   curl -H "Origin: https://your-frontend-url.com" https://your-backend-url/cors-debug
   ```

2. **Check browser console**: Look for the exact origin in the CORS error message. It should match one of your configured origins exactly.

3. **Check backend logs**: The enhanced logging will show:
   - The origin of each request
   - Whether the origin is in the allowed list
   - CORS response headers

## Debugging Steps

### 1. Check Current CORS Configuration

Visit `/cors-debug` endpoint to see:
- What origins are configured
- What origin the request is coming from
- Whether the origin is allowed

### 2. Check Backend Logs

Look for these log messages:
- `🔍 CORS Request - Origin: ...` - Shows the origin of each request
- `⚠️  CORS WARNING: Origin '...' not in allowed list` - Indicates a mismatch

### 3. Verify Frontend URL

In your frontend code, check what URL is being used:
- Check `NEXT_PUBLIC_API_BASE_URL_NGROK` or similar environment variables
- Check the browser Network tab to see the exact request URL
- Check the `Origin` header in the request

### 4. Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Origin includes port number | Add origin with port: `https://example.com:443` |
| Origin has trailing slash | Remove trailing slash from CORS_ORIGINS |
| Using http instead of https | Change to https in CORS_ORIGINS |
| Multiple frontend URLs | Add all URLs separated by commas |
| Wildcard in CORS_ORIGINS | Remove wildcard, use specific origins |

## Production Checklist

- [ ] `CORS_ORIGINS` environment variable is set in production
- [ ] All frontend URLs (including custom domains) are included
- [ ] URLs use `https://` (not `http://`)
- [ ] No trailing slashes in URLs
- [ ] Backend has been restarted after setting environment variable
- [ ] Backend logs show the correct CORS origins
- [ ] `/cors-debug` endpoint shows origin is allowed

## Example Production Configuration

For a Vercel-deployed frontend with a custom domain:

```env
ENVIRONMENT=production
CORS_ORIGINS=https://fifa-tracker-web-five.vercel.app,https://fifatracker.com,https://www.fifatracker.com
FRONTEND_URL=https://fifatracker.com
```

## Still Having Issues?

1. Check the browser console for the exact CORS error message
2. Check the Network tab to see the `Origin` header value
3. Compare it with the `CORS_ORIGINS` in your backend logs
4. Ensure they match exactly (case-sensitive, no trailing slashes, correct protocol)

