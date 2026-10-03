# RouteShare

A personal drive journal for Android and iOS: **record -> save -> revisit**.

RouteShare captures a foreground GPS trace, optionally creates a Google Roads approximation, saves both to your private Supabase account, and displays recordings on a map. It is a route viewer, not a navigation app. The name is retained from the original project; this version does not share routes.

## Features

- Email/password signup and login, with a session persisted on the device.
- Current-location home map and a clear recording summary.
- GPS validation using accuracy, measurement age, coordinate bounds, timestamps, and raw implied speed.
- Light smoothing for estimated distance and optional road matching; no bend or backtrack deletion.
- Original accepted GPS coordinates retained separately from the optional road approximation.
- Road requests split within Google's 100-point limit, with overlapping endpoints, response validation, and a 60-second overall timeout.
- Private cloud library with refresh, retry, rename, and confirmed deletion.
- Saved-route viewer that defaults to Recorded GPS and allows comparison with Road approximation.
- Consistent light design, safe-area layouts, labelled controls, and visible errors.

## Requirements

Use Node.js **22.17 or later in the Node 22 release line**, npm, a Supabase project, and a physical Android or iOS phone. Expo SDK 54, React Native 0.81, React 19, and all JavaScript dependencies are declared in `package.json` and pinned by `package-lock.json`.

Android map rendering requires a Google Maps key with Maps SDK for Android enabled. Enable Roads API and billing to use optional road alignment. iOS uses the default Apple map provider; Roads matching remains optional. Configure provider restrictions and quotas for your application. A mobile Maps key and a Roads web-service key may require different restriction strategies; if a key's restrictions reject Roads requests, GPS-only saving still works. Do not use a Supabase service-role key in this app.

See [REQUIREMENTS.md](REQUIREMENTS.md) for product requirements and acceptance checks.

## Setup

Clone your GitHub repository into a local folder and install dependencies:

```sh
git clone <your-repository-url> RouteShare
cd RouteShare
npm ci
```

Replace `<your-repository-url>` with the clone URL of your repository. If you downloaded a ZIP instead, extract it and open a terminal in the folder containing `package.json`, then run `npm ci`.

Copy `.env.example` to `.env`. On PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in the Supabase URL/public key and Google Maps key. `.env` is ignored. Restart Expo after changing values. Missing Supabase configuration produces a setup screen instead of a startup crash.

### Database

Review and execute [supabase/schema.sql](supabase/schema.sql) in your Supabase SQL editor. It creates the routes table on a fresh project, or adds the original GPS and match-status fields to an existing compatible table. It preserves older rows and marks them `legacy` because their original GPS trace and matching history are unknown.

**The script replaces existing policies on `routes` with owner-only policies and revokes anonymous table access.** Old public sharing links will no longer read these records. No database script is executed automatically. Existing installations must have the original route columns and text IDs; inspect a different schema before applying it.

Profiles and profile triggers are no longer needed. Existing profiles are left untouched. Login uses email, including for older accounts.

### Authentication

Enable email/password authentication in Supabase. If email confirmation is enabled, configure a valid HTTPS Site URL/confirmation destination in Supabase: the user confirms in their browser, then returns to sign in manually. This version does not handle OAuth or authentication deep links. Configure the password policy to require at least eight characters.

### Run

```sh
npm start
npm run android
npm run ios
```

`npm run ios` requires macOS for the iOS simulator. A physical phone with an SDK-54-compatible Expo Go installation or a development build is needed for real GPS checks. Native configuration changes (including Android map keys and location permission text) require rebuilding a development/native app. Expo Go uses its host application's native configuration.

The supplied UI targets mobile; web is outside the supported scope.

## How to use

1. Create an account or sign in with email/password.
2. From Home, select Start recording and grant location access.
3. Keep the app visible. Set up before driving; avoid interacting with the phone while moving.
4. Stop after at least 30 metres, name the recording, and choose whether to align to roads.
5. Save. If alignment fails, the dialog offers GPS-only saving; tap Save again to confirm.
6. Open the recording from Library. Compare Recorded GPS and Road approximation if both exist.
7. Use the recording menu to rename or delete it.

Going into the background stops recording and keeps the captured trace available while the process remains alive. It does not silently bridge a period without GPS. Short recordings can be discarded. Unsaved recordings are held in memory; terminating the app loses them. Cloud saving needs a network connection, and a failed save leaves the recording available for retry in the current session.

## Route accuracy and scope

The original trace is the sequence of **accepted, unsmoothed GPS coordinates**, not every measurement emitted by the phone. Rejected fixes are not retained. Smoothed points supply the live distance estimate and Roads requests. Coordinates are not aggressively simplified; genuine bends and reversals are kept.

Road matching is only an optional display enhancement. Sparse gaps over 300 metres, incomplete matches, excessive displacement, malformed responses, mismatched chunk boundaries, and API errors cause a fallback offer. These checks do not prove a road match is correct. Road matching does not validate car restrictions, closures, or legal manoeuvres. Distances are GPS estimates, not road-network distances.

There is no turn-by-turn guidance, navigation to the start, public sharing, background recording, automatic rerouting, offline cloud library, or custom route editor.

## Project layout

```text
core/         GPS intake, recorder, Roads adapter, auth, repository, models, utilities
state/        Session-aware Zustand store
src/          App gate, navigation, shared theme and UI components
screens/      Login, Home, Trace, Library, Account, RouteViewer
assets/icons/ Tab and password icons
supabase/     Reviewed database setup script
tests/        Targeted regression checks (Node test runner)
```

## Verification

```sh
npm run typecheck
npm test
npm run check
```

Tests cover filtering before smoothing, invalid and stale fixes, preserving bends/backtracks, API chunk boundaries, road-response rejection, recorder startup cancellation, and account changes/in-flight route reads. They run without a phone or cloud account. Real permissions, GPS, map rendering, process lifecycle, and Supabase policies also need the manual checks in REQUIREMENTS.md.

### Current verification status

Strict TypeScript checks, 15 regression tests, Expo SDK dependency compatibility, and Android/iOS JavaScript bundle exports passed during local verification. Bundle exports are not native app builds. Device layout, GPS behavior, authentication, database operations, and row-level security still need connected device/backend testing.

The application does not deploy itself or apply database changes.
