import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Static export removed to enable Next.js Serverless API routes on Vercel
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
