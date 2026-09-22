# AIblty — Google Play Store Release Guide

## Build produced

- **AAB file**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Package name**: `com.aibltycode.app`
- **Version**: `1.0` (`versionCode 1`)
- **Size**: ~4.8 MB
- **Signing**: Release AAB is signed with the upload keystore configured in `android/app/build.gradle`.

## Upload keystore (back this up!)

Files are excluded from git by `.gitignore` to keep them private.

- **Keystore file**: `android/app/upload-keystore.jks`
- **Credentials file**: `android/app/keystore.properties`

Open `android/app/keystore.properties` to view the store/key passwords and alias. **Save these credentials in a password manager** — losing them means you cannot upload updates to Google Play.

## Release steps in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console).
2. Select the app with package name `com.aibltycode.app`.
3. Navigate to **Release > Production > Create new release**.
4. If this is the first release, enable **Google Play App Signing** when prompted. Choose to **Use existing app signing key** or let Google generate one.
5. Upload `android/app/build/outputs/bundle/release/app-release.aab`.
6. Google Play will verify the upload signature against the upload keystore.
7. Fill in the store listing using `STORE_LISTING.md`:
   - App name: **AIblty - Master Tech Skills**
   - Short description, full description, category (Education), content rating (Everyone / 4+).
8. Complete **Data safety** and **Content rating** questionnaires.
9. Add required URLs:
   - Privacy Policy: `https://aiblty.com/privacy.html`
   - Support: `https://aiblty.com/support.html`
10. Upload screenshots (phone + 7-inch tablet + 10-inch tablet) and feature graphic (1024×500).
11. Save, review, and **Start rollout to Production**.

## Re-building future releases

```bash
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

The new AAB will be at `android/app/build/outputs/bundle/release/app-release.aab`.

## Automatic upload with Fastlane (optional)

To upload future AABs automatically, create a Google Play service account:

1. In Play Console, go to **Setup > API access** and link a Google Cloud project.
2. Create a service account with **Service Account User** and **Storage Object Viewer** roles, plus **Release Manager** access in Play Console.
3. Download the JSON key and save it as `fastlane/google-play-key.json` (do not commit it).
4. Run:

```bash
fastlane android beta   # internal testing
fastlane android release # production
```

## Notes

- The release AAB bundles all web assets locally. It does **not** depend on the Lovable preview URL.
- The service worker / PWA offline support remains active inside the WebView.
- For iOS App Store release, run `npm run build:ios` and archive in Xcode.
