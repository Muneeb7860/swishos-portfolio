import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only upload source maps when a Sentry auth token is present (CI/production).
  // Local dev builds skip this so no Sentry account is required to run `npm run dev`.
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
