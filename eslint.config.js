// @ts-check
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig(
  globalIgnores(["**/dist/", "**/.pack/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["packages/react/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended],
  }
)
