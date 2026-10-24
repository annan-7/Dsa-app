# Google authentication

Home (`/`) is public. All other application routes require a signed JWT session,
including routes added later. Auth.js endpoints and framework/public assets are
available without a session so sign-in can complete. Protected routes redirect
to sign-in with their original destination preserved. Sign-out uses Auth.js's
CSRF-protected confirmation flow.

Configure a Google OAuth client of type **Web application** and set these values
in `.env.local` locally, or in the deployment's secure environment settings:

```dotenv
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with openssl rand -base64 32>
GOOGLE_CLIENT_ID=<Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
```

Register `http://localhost:3000/api/auth/callback/google` as an authorized redirect
URI in Google Cloud. For deployment, set `NEXTAUTH_URL` to the public HTTPS origin
and register that origin followed by `/api/auth/callback/google` as well. Keep
the session secret stable across instances. Never commit `.env.local` or secrets.
No database is required. Any Google account authorized by the OAuth application's
audience settings can sign in; configure test users while Google is in testing mode.

Run `npm ci`, then `npm run dev`. Without a session, `/` should return 200 and
`/patterns/two-pointers/three-sum` should redirect to `/api/auth/signin` with a
callback URL. Complete Google sign-in, confirm return to the requested page,
then sign out and verify the page requires sign-in again.

The cloud setup generated a local session secret, but Google OAuth credentials
must be supplied before an end-to-end sign-in can be tested. Existing deque
TypeScript errors, missing lint dependencies, and Google Fonts network access
are separate repository/environment limitations.
