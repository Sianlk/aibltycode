# Google Play Release — AIBLTYCODE

Canonical package: `com.aibltycode.app`

Public privacy policy: https://aiblty.com/privacy.html  
Public account deletion resource: https://aiblty.com/delete-account.html

## Release gate

The Android workflow refuses a release unless these GitHub Actions secrets exist:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` when publishing

Manual runs default to the Google Play internal track. A `v*` tag is treated as a production-track release.

## Play Console declarations to verify before production

- App category: Education.
- Account age: 13+ (five-year-old-simple is the teaching method, not target-account age).
- Ads: declare accurately based on the shipped build; current source does not include an ad SDK.
- App access: if Play review needs protected content, provide reviewer credentials in Play Console.
- Data Safety: disclose Supabase account/profile/learning data, Stripe subscription identifiers, optional AI request content, and any diagnostics actually enabled in the release.
- Account deletion: enter https://aiblty.com/delete-account.html in the Data Safety account-deletion field.
- Privacy policy: https://aiblty.com/privacy.html.
- Content rating questionnaire: complete from actual shipped features.
- Target SDK: 36.
- Signing: use newly rotated Play upload signing credentials; do not reuse credentials previously exposed in repository history.

The store workflow builds and verifies a signed AAB and can upload it with the configured Play service account.
