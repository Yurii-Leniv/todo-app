import nextJest from "next/jest.js";

// next/jest handles the Next.js-specific bits (SWC transform, CSS/image
// imports, .env loading) so we don't have to configure them by hand.
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Mirrors the "@/*" path alias from tsconfig.json — Jest doesn't read
  // tsconfig paths on its own, so we have to repeat the mapping here.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
