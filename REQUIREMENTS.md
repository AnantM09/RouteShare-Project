# RouteShare requirements

## Product goal

Provide a coherent personal drive journal: reliably capture a foreground drive, retain its accepted GPS trace, save it to a private account, and revisit it on a map. Optional road alignment helps visual comparison without claiming navigation accuracy.

## Supported environment

- Android and iOS; portrait-oriented mobile UI.
- Node 22.17+ in the Node 22 release line, npm, Expo SDK 54 toolchain.
- Physical phone for GPS verification; macOS/Xcode for an iOS simulator/native build, Android tooling for an Android emulator/native build.
- Supabase email/password authentication and a compatible routes table with owner-only row-level security.
- Google Maps SDK for Android key for Android maps. Roads API/key/billing only for optional matching.
- Network access for authentication, cloud CRUD, map tiles, and road matching.
- Foreground location permission and enabled location services for recording.

All package requirements live in package.json/package-lock.json. Secrets belong in .env; only public mobile configuration is bundled.

## Functional requirements

| ID | Requirement |
|---|---|
| AUTH-1 | Users can sign up and sign in with email/password, see actionable errors, and sign out. |
| AUTH-2 | Native sessions persist; sign-out/account changes immediately clear private route state. |
| AUTH-3 | Missing configuration renders a setup screen. Email confirmation returns users to manual sign-in. |
| REC-1 | Starting requests permission, verifies location services, and shows connecting/error/recording states. |
| REC-2 | Invalid, stale, non-forward, inaccurate, and implausibly fast GPS fixes are rejected before smoothing. |
| REC-3 | Recording shows elapsed time, estimated distance, average speed, and GPS status. |
| REC-4 | A recording needs two accepted points and at least 30 metres to save. |
| REC-5 | Stop finalizes duration and removes the location subscription. Backgrounding stops the drive. |
| REC-6 | Leaving an unsaved drive requires discard confirmation. Startup cannot create a watcher after cancellation. |
| SAVE-1 | Save retains accepted unsmoothed GPS points separately from optional reconstructed geometry. |
| SAVE-2 | API failure offers explicitly confirmed GPS-only saving. A failed database save retains the trace for retry. |
| SAVE-3 | Repeated taps cannot create parallel saves. Retrying uses the same recording ID. |
| MAP-1 | Matching preserves point density and bends; requests have at most 100 points and overlap endpoints. |
| MAP-2 | Matching rejects incomplete/invalid/remote results and broken joins and has a bounded overall timeout. |
| LIB-1 | Library supports refresh, loading/error/retry/empty states, viewing, renaming, and confirmed deletion. |
| LIB-2 | Cloud mutations must succeed before the library changes. Stale reads cannot overwrite later mutations. |
| VIEW-1 | Viewer defaults to original GPS when available; matched geometry has an explicit approximation label. |
| VIEW-2 | Start/end markers and a fit-to-route control are available. Older recordings are labelled honestly. |
| UI-1 | Screens share colors, spacing, cards and controls, respect safe areas, and label important controls. |
| DATA-1 | Routes are readable/writable only by their owner; the app never contains a service-role key. |

## Explicit exclusions

Turn-by-turn navigation, road-legality certification, navigation to the route start, public links, route editing, background GPS capture, automatic recovery after process termination, and offline cloud persistence.

## Manual acceptance checks

1. Start without .env: setup guidance appears. Configure and restart: login appears.
2. Sign up with email confirmation enabled, confirm in browser, then sign in; force-close/reopen and verify the session persists.
3. Deny permission and disable location services separately; recording shows a useful error and allows retry/exit.
4. Start a drive; verify stats update, a genuine corner remains, stopping freezes duration, and GPS stops.
5. Background the app: recording stops; returning retains its summary. No unrecorded interval is silently bridged.
6. Stop below 30 metres: saving is unavailable and discard works.
7. Press Back during startup and during recording: confirm/cancel behave correctly; no watcher survives exit.
8. Save GPS-only, then save with Roads enabled. Check a trace longer than 100 points and compare the two displayed geometries.
9. Disable network or use an invalid Roads key: matching offers GPS-only saving; cloud failure leaves the trace intact for retry.
10. Tap Save repeatedly: one recording is produced. Returning to Library removes Trace from the stack.
11. Rename/delete; simulate a backend error and confirm the existing row remains visible until success.
12. Sign out, sign in as a second user, and verify the first user's recordings never appear. Test direct unauthorized database reads/writes against the policies.
13. Open an older row: show the saved path with a legacy label; do not invent an original GPS trace.
14. Verify map layout, keyboard dialogs, long recording names, larger system text, and safe areas on both phone platforms.

## Automated checks

Run npm run check for strict TypeScript checking and regression tests. Native rendering and real backend behavior require the manual checks above.
