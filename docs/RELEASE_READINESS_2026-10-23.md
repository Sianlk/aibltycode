# AIBLTY Release Readiness — 23 October 2026

**Canonical repository:** `Sianlk/aibltycode` (`main`). This file records verified release blockers; it does not certify the app for production or claim a completed Play Console submission.

## Immediate release blockers (observed in Actions runs on 14 October 2026)

1. **Web CI / security** — `AIBLTYCODE Complete Build` failed during `npm audit --omit=dev --audit-level=high`; logs report remaining high-severity transitive dependency advisories including `braces` / `micromatch` / `tailwindcss`. DO NOT weaken the audit threshold to make the workflow pass. Update and test the dependency graph, document any no-fix advisories, and rerun `npm run verify`.
2. **GitHub Pages** — `Deploy Web to GitHub Pages` passed install/typecheck/lint/build, then failed at `actions/configure-pages@v5` with 'Get Pages site failed ... Not Found'. A repository administrator must enable Pages under **Settings → Pages → Build and deployment → Source: GitHub Actions**. The repository's Pages workflow is already defined.
3. **Android signing / Google Play** — `Mobile Release & Google Play Publish` failed because GitHub Actions reports these repository secrets missing: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`, `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`. Supply these only via GitHub Actions secrets and secure Play Console service account authorisation. Never commit secrets or signing keys. The currently installed Play Console credentials/tester list have NOT been verified.
4. **Play Console beta enrolment** — For a personal developer account created after 13 November 2023, Google's current production-access rule requires a **closed test of at least 12 continuously opted-in testers for 14 days**, followed by an application for production access. Internal testing does not satisfy that requirement. Verify the owner's actual Play Console account type/eligibility and app testing status before scheduling publication.
5. **Release correctness** — **CONFIRMED BLOCKER:** the existing Sianlk Google Play Console listing **Aiblty: Learn Tech Skills** (internal testing, updated 14 October 2026) identifies Android package `www.aiblty.com`, while the repository's Capacitor config, `android/app/build.gradle` `applicationId`, and Google Play upload workflow currently target `com.aibltycode.app`; the legacy Expo `app.json` also contains `com.sianlk.aibltycode`. New AAB uploads with the wrong application ID will not update the existing listing. Before editing package IDs, verify the identity of the signed, accepted internal-test AAB, original upload key and Play App Signing certificate. Harmonise Capacitor/Gradle/workflow/store listing based on the established Play package, *without* creating a second app or losing existing testers. Review `STORE_LISTING.md` age 13+ statement against all deployed features, privacy/data-safety declarations, consent, account deletion and tester access. Confirm which learning games run offline and which require Supabase or AI network calls.
6. **Domain/runtime** — GitHub is the authoritative source and CI/CD provider. GitHub Pages can serve the static React frontend, but Supabase or another runtime is still necessary for auth/data/serverless functions. Do not claim that GitHub Pages can host the dynamic backend. No DigitalOcean or Lovable-hosted deployment should be part of the approved production path.

## Safe release sequence

- Fix the audited production dependencies without bypassing `npm audit`; complete tests, typecheck, lint and production build.
- Configure GitHub Pages, deploy staging/public frontend and verify real routes/checkout/auth, privacy, account deletion, responsive experience, monitoring and empty/error states.
- Validate Supabase RLS, migrations, Edge Functions, role access and private API key handling; run security, accessibility and data-deletion tests.
- Verify release keystore ownership and Google Play developer access; add GitHub encrypted Actions secrets.
- From the Actions UI, manually run **Mobile Release & Google Play Publish** with `platform=android`, `track=internal`, `publish_android=false` for a build-only test.
- Once tested and authorised, run manual signed upload to the appropriate internal or closed track; recruit actual opted-in users, collect feedback and meet Google's relevant testing requirement.
- Submit production-access information and store declarations truthfully. Only initiate a manual production publish once eligibility and release approvals are confirmed.
- Run post-release smoke tests, install/update/rollback checks, user login and course progression, payments where applicable, and support flows.

## Sign-off conditions

- [ ] CI security gate passes with no unreviewed high/critical vulnerabilities
- [ ] GitHub Pages site enabled and deployment verified at the expected domain
- [ ] Learning journeys tested on real Android devices
- [ ] Account creation/sign-in, reset, parental/data/privacy controls and deletion validated
- [ ] Existing Play listing's package ID `www.aiblty.com` reconciled with Android applicationId, Capacitor and upload workflow
- [ ] GitHub release credentials configured securely
- [ ] Manual Play closed test and tester count validated in Play Console
- [ ] Google Play production eligibility approved
- [ ] Written release authorisation and post-release monitoring verified

**Protection implemented in this PR:** automatic Google Play production publish triggers from tags and commit messages are removed. Publishing now requires a manual workflow dispatch with an explicit publish toggle. This does not resolve missing credentials, audit advisories or Play Console eligibility by itself.
