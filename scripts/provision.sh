#!/usr/bin/env bash
# Provisions the Vercel project, Neon database, Blob store and app env vars, then migrates the
# production database and seeds the admin users. Safe to re-run: existing resources are kept.
# Every value is written to the git-ignored .env so the setup can be recovered.
set -euo pipefail

PROJECT=cfsl-website
REPO_URL=https://github.com/rifhanakram/cfsl-website
REGION=sin1
ADMIN_EMAILS=(rifhan.akram1@gmail.com sameerasrg@gmail.com)
# Cloudflare's always-pass test keys; replace with real keys before public launch.
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

cd "$(dirname "$0")/.."
ENV_FILE=.env
PULLED=.env.vercel.production.local

existing() { cat "$ENV_FILE" .env.local 2>/dev/null | sed -n "s/^$1=//p" | head -1 | sed 's/^"//; s/"$//' || true; }
has_env() { vercel env ls production 2>/dev/null | grep -q "^ *$1 "; }

# Development can't hold Secret-type values, so it always gets Config.
set_env() {
  local name=$1 value=$2 type=$3 target
  for target in production preview development; do
    [[ $target == development ]] && type=config
    vercel env add "$name" "$target" --value "$value" --type "$type" --force --yes >/dev/null
  done
  echo "  set $name"
}

echo "== Project"
vercel project inspect "$PROJECT" >/dev/null 2>&1 || vercel project add "$PROJECT"
# `vercel link` overwrites .env.local, so only link once.
[[ -f .vercel/project.json ]] || vercel link --yes --project "$PROJECT" >/dev/null
git_out=$(vercel git connect "$REPO_URL" --yes 2>&1 || true)
echo "$git_out" | tail -2
if ! grep -qE 'already connected|Connected' <<<"$git_out"; then
  echo "!! git connect failed: connect GitHub under Vercel Account Settings > Authentication, then re-run"
fi

echo "== Neon"
if has_env DATABASE_URL; then
  echo "  DATABASE_URL already set, skipping"
else
  vercel integration add neon --name cfsl-db --plan free_v3 -m region=$REGION -m auth=false --no-env-pull
fi

echo "== Blob"
if has_env BLOB_READ_WRITE_TOKEN; then
  echo "  BLOB_READ_WRITE_TOKEN already set, skipping"
else
  vercel blob create-store cfsl-media --access public --region $REGION --yes
fi

echo "== App secrets"
PAYLOAD_SECRET=$(existing PAYLOAD_SECRET)
[[ -n $PAYLOAD_SECRET ]] || PAYLOAD_SECRET=$(openssl rand -hex 32)
set_env PAYLOAD_SECRET "$PAYLOAD_SECRET" secret
set_env NEXT_PUBLIC_TURNSTILE_SITE_KEY "$TURNSTILE_SITE_KEY" config
set_env TURNSTILE_SECRET_KEY "$TURNSTILE_SECRET_KEY" secret

echo "== Pull production env"
vercel env pull "$PULLED" --environment production --yes >/dev/null
pulled() { sed -n "s/^$1=//p" "$PULLED" | head -1 | sed 's/^"//; s/"$//'; }
DATABASE_URL=$(pulled DATABASE_URL)
BLOB_READ_WRITE_TOKEN=$(pulled BLOB_READ_WRITE_TOKEN)
[[ -n $DATABASE_URL ]] || { echo "!! DATABASE_URL missing from pulled env"; exit 1; }

SEED_ADMINS=""
for email in "${ADMIN_EMAILS[@]}"; do
  var="ADMIN_PASSWORD_$(echo "$email" | tr -c 'a-zA-Z0-9\n' '_' | tr a-z A-Z)"
  password=$(existing "$var")
  [[ -n $password ]] || password=$(openssl rand -base64 18 | tr -d '/+=')
  printf -v "$var" '%s' "$password"
  SEED_ADMINS+="${SEED_ADMINS:+,}$email:$password"
  ADMIN_VARS+=("$var")
done

{
  echo "# Production values written by scripts/provision.sh on $(date +%F). Never commit."
  echo "VERCEL_PROJECT=$PROJECT"
  echo "DATABASE_URL=$DATABASE_URL"
  echo "BLOB_READ_WRITE_TOKEN=$BLOB_READ_WRITE_TOKEN"
  echo "PAYLOAD_SECRET=$PAYLOAD_SECRET"
  echo "NEXT_PUBLIC_TURNSTILE_SITE_KEY=$TURNSTILE_SITE_KEY"
  echo "TURNSTILE_SECRET_KEY=$TURNSTILE_SECRET_KEY"
  for var in "${ADMIN_VARS[@]}"; do echo "$var=${!var}"; done
  echo
  echo "# Every production env var as pulled from Vercel"
  sed 's/^/# /' "$PULLED"
} > "$ENV_FILE"
rm "$PULLED"
echo "  wrote $ENV_FILE"

echo "== Migrate and seed production database"
export DATABASE_URL PAYLOAD_SECRET
pnpm migrate
SEED_ADMINS=$SEED_ADMINS pnpm seed:admins

echo "== Done"
