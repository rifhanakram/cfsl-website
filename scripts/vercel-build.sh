#!/usr/bin/env bash
# Preview deployments share the production Neon branch, so only production builds migrate.
set -euo pipefail

if [[ ${VERCEL_ENV:-} == production ]]; then
  pnpm migrate
fi
pnpm build
