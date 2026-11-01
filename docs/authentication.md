# Authentication

The app uses NextAuth.js 4 with GitHub OAuth and encrypted JWT sessions. Only the home page, sign-in page, OAuth endpoints, and static assets remain public. The request proxy protects all other paths by default. Account and problem pages also validate their sessions on the server. Anonymous requests redirect to `/signin` with a local return path; private APIs return HTTP 401. No database or password storage is required. Account-linked progress is not implemented.

## Free local setup

NextAuth is a free, open-source library. It does not issue API keys. GitHub supplies an OAuth Client ID and Client Secret for free.

1. Open https://github.com/settings/developers and select **OAuth Apps > New OAuth App**.
2. Set the application name to `DSA Visual Local`.
3. Set the homepage URL to `http://localhost:3000`.
4. Set the authorization callback URL to `http://localhost:3000/api/auth/callback/github`.
5. Register the app, copy its Client ID, and generate a Client Secret.
6. Copy `.env.example` to `.env.local` and set `GITHUB_ID` and `GITHUB_SECRET` there.
7. Run `openssl rand -base64 32` locally and put the result in `NEXTAUTH_SECRET`.
8. Set `NEXTAUTH_URL=http://localhost:3000`, run `npm install`, then `npm run dev`.
9. Open `/signin`, select **Continue with GitHub**, authorize the app, and confirm `/account` shows your profile. Sign out and verify `/account` redirects again.

Keep secrets in `.env.local` or your hosting provider's secret environment settings. Never use `NEXT_PUBLIC_` for these values, commit them, or paste them into chat. Restart the server after changing environment variables. Missing configuration leaves the home page available, protects lessons, and shows an unavailable message on the sign-in page.

## Production

Create a separate GitHub OAuth app for production. Use your HTTPS origin as its homepage and `https://YOUR_DOMAIN/api/auth/callback/github` as its callback. Configure the same four environment variables on your host; `NEXTAUTH_URL` must match that origin. Use a separate strong production secret. Changing it invalidates existing sessions.

OAuth requests only profile and email access, not repository access. NextAuth handles OAuth state, CSRF checks, and session cookies. Provider access tokens are not exposed through the session. Every future private API endpoint or Server Action must independently check its session and resource ownership; hiding UI is not authorization.

## Common setup errors

- **Callback mismatch:** GitHub callback URL, `NEXTAUTH_URL`, scheme, port, and domain must agree.
- **OAuthSignin / OAuthCallback:** verify credentials, callback configuration, and provider availability. Retry after a rejected or expired authorization.
- **Missing secret / invalid session:** configure `NEXTAUTH_SECRET` consistently across production instances.
- **Environment changes appear ignored:** restart the development server or redeploy.
- **Works locally, fails on hosting:** configure production environment variables and HTTPS URLs; local `.env.local` is not deployed.
- **Account linking fails:** do not enable dangerous automatic email linking to bypass it. This app uses one provider and no account database.

## Free alternatives

Pricing checked against official pages during implementation; limits may change.

- **Supabase Auth:** hosted free tier includes 50,000 monthly active users, plus a PostgreSQL database. Free projects can pause after one week of inactivity; limit two active projects. Useful when adding saved progress. https://supabase.com/pricing
- **Clerk:** hosted authentication with prebuilt UI. Free tier advertises up to 50,000 monthly retained users, a different metric from MAU. Advanced features have separate limits and paid tiers. https://clerk.com/pricing
- **Better Auth:** open-source authentication hosted with your application; database, email, and hosting may cost money. Useful when owning the auth data and adding more authentication features. Optional commercial services are separate. https://www.better-auth.com

GitHub OAuth with NextAuth is sufficient for this project's current login requirement.

References: https://next-auth.js.org/configuration/initialization#route-handlers-app and https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

## Validation

Use Node.js 22.13 or newer. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Then run `npm run test:auth`: it starts a production server on an available port, supplies isolated temporary test credentials, runs the HTTP checks, and stops the server. No real GitHub credentials are used or changed by this test.

The tests cover public home access, protected lessons and account pages, unknown private routes, valid/forged/expired encrypted sessions, callback restrictions, CSRF, and sign-out cookie clearing. Full GitHub authorization still requires your OAuth app and should be checked after deployment.

The default login return path is `/account`. When opening a protected lesson first, successful login returns to that lesson. External return URLs and sign-in loops are rejected.
