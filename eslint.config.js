import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const legacyOrNonCanonical = [
  "dist",
  "src/navigation/**",
  "src/screens/**",
  "src/store/**",
  "src/theme/**",
  "src/agents/**",
  "src/api/**",
  "src/services/notifications.ts",
  "src/services/biometricAuth.ts",
  "src/services/ai.ts",
  "src/services/analytics.ts",
  "src/services/monetization.ts",
  "src/services/offlineSync.ts",
  "src/services/api.ts",
  "src/utils/deepLinks.ts",
  "src/utils/pushNotifications.ts",
  "src/utils/performance.ts",
  "src/config/sentry.config.ts",
  "src/config/ai.config.ts",
  "src/hooks/useAuth.ts",
];

export default tseslint.config(
  { ignores: legacyOrNonCanonical },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react-hooks/exhaustive-deps": "warn",

      // This Lovable/Supabase codebase intentionally runs TypeScript in non-strict
      // mode. Keep migration debt visible without blocking a valid production build.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-empty": "warn",
      "no-useless-escape": "warn",
      "prefer-const": "warn",
    },
  },
);