# The Stars — deploy steps

This is set up the same way aQuietSpace is: a static front end (`index.html`)
plus a Netlify serverless function (`netlify/functions/chat.js`) that holds
the Anthropic API key privately and passes chat requests through.

## Steps left to go live

1. **Create a GitHub repo** for this project (e.g. `the-stars`).
2. **Push this folder to it**:
   ```
   git init
   git add .
   git commit -m "first version of the stars"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/the-stars.git
   git push -u origin main
   ```
3. **Connect the repo to Netlify**: New site from Git → pick this repo.
   Build settings can stay default (this site has no build step).
4. **Add your API key privately**: In Netlify, go to
   Site settings → Environment variables → Add a variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: (your Anthropic API key — a separate one from aQuietSpace's,
     so usage and costs stay easy to tell apart)
5. **Deploy** — Netlify will give you a free `something.netlify.app` URL
   right away. Test the chat there first.
6. **Point your subdomain at it**: In Netlify, go to
   Domain settings → Add custom domain → `stars.gilbertsimba.com`.
   Then add the DNS record Netlify gives you wherever gilbertsimba.com's
   DNS is managed.

## Files in this project

- `index.html` — the whole site (sky, stars, chat, everything)
- `netlify/functions/chat.js` — the private function that talks to Anthropic
- `netlify.toml` — tells Netlify how to serve this site
- `package.json` — basic project info Netlify expects
