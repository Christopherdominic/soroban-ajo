#!/usr/bin/env bash
set -euo pipefail

# Unified deployment script for Soroban Ajo
#
# Responsibilities:
# - Blue/green deployments for backend (staging/production)
# - Database migrations and optional seed data
# - Contract build/deploy helpers for testnet and mainnet
#
# This script is designed to run on the deployment host (e.g. via SSH from GitHub Actions).
#
# Usage examples:
#   ./scripts/deploy.sh app staging
#   ./scripts/deploy.sh app production
#   ./scripts/deploy.sh rollback staging
#   ./scripts/deploy.sh contracts:testnet
#   ./scripts/deploy.sh contracts:mainnet

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT_DIR/.deploy"
mkdir -p "$STATE_DIR"

BLUE="\033[0;34m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

log_info()  { echo -e "${BLUE}ℹ${NC} $*"; }
log_ok()    { echo -e "${GREEN}✓${NC} $*"; }
log_warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
log_error() { echo -e "${RED}✗${NC} $*"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_error "Required command '$1' not found on PATH"
    exit 1
  fi
}

get_active_color() {
  local env="$1"
  local file="$STATE_DIR/${env}-active"
  if [[ -f "$file" ]]; then
    cat "$file"
  else
    echo "blue"
  fi
}

set_active_color() {
  local env="$1"
  local color="$2"
  echo "$color" > "$STATE_DIR/${env}-active"
}

other_color() {
  local current="$1"
  if [[ "$current" == "blue" ]]; then
    echo "green"
  else
    echo "blue"
  fi
}

deploy_app() {
  local env="$1" # staging | production

  require_cmd docker
  require_cmd docker-compose

  local current_color
  current_color="$(get_active_color "$env")"
  local new_color
  new_color="$(other_color "$current_color")"

  log_info "Current active color for $env: $current_color"
  log_info "Switching to color: $new_color"

  if [[ -z "${BACKEND_IMAGE:-}" ]]; then
    log_error "BACKEND_IMAGE environment variable must be set (e.g. ghcr.io/owner/soroban-ajo-backend:sha)"
    exit 1
  fi

  pushd "$ROOT_DIR" >/dev/null

  local project="ajo-${env}-${new_color}"

  log_info "Bringing up new stack with project '$project'"
  BACKEND_IMAGE="$BACKEND_IMAGE" \
  docker-compose -f docker-compose.staging.yml -p "$project" up -d --remove-orphans

  log_info "Running database migrations in new backend"
  docker-compose -f docker-compose.staging.yml -p "$project" exec -T backend \
    bash -lc "cd /app/backend && npm run db:push"

  if [[ "${SEED_TEST_DATA:-false}" == "true" ]]; then
    log_info "Seeding test data"
    docker-compose -f docker-compose.staging.yml -p "$project" exec -T backend \
      bash -lc "cd /app/backend && npm run seed:gamification"
  fi

  if [[ -n "${HEALTHCHECK_URL:-}" ]]; then
    log_info "Checking health of new deployment at ${HEALTHCHECK_URL} (max 10 attempts)"
    local ok=false
    for i in {1..10}; do
      if curl -sf "$HEALTHCHECK_URL" >/dev/null 2>&1; then
        ok=true
        break
      fi
      log_warn "Healthcheck attempt $i failed, retrying..."
      sleep 5
    done

    if [[ "$ok" != "true" ]]; then
      log_error "New deployment failed healthcheck; keeping old color '$current_color' active"
      docker-compose -f docker-compose.staging.yml -p "$project" logs --tail=200 || true
      exit 1
    fi
  else
    log_warn "HEALTHCHECK_URL not set; skipping health check"
  fi

  log_ok "New deployment for $env ($new_color) is healthy; demoting old color '$current_color'"

  if [[ "$current_color" != "$new_color" ]]; then
    local old_project="ajo-${env}-${current_color}"
    log_info "Stopping old project '$old_project'"
    docker-compose -f docker-compose.staging.yml -p "$old_project" down || true
  fi

  set_active_color "$env" "$new_color"
  log_ok "Blue/green switch complete. Active color for $env: $new_color"

  popd >/dev/null
}

rollback_app() {
  local env="$1"

  require_cmd docker
  require_cmd docker-compose

  local current
  current="$(get_active_color "$env")"
  local previous
  previous="$(other_color "$current")"

  log_info "Attempting rollback for $env"
  log_info "Current color: $current, previous color: $previous"

  local prev_project="ajo-${env}-${previous}"

  if ! docker ps --format '{{.Names}}' | grep -q "${prev_project}_backend"; then
    log_error "No previous deployment containers found for project '$prev_project'; cannot rollback automatically"
    exit 1
  fi

  log_info "Promoting previous deployment '$prev_project'"
  set_active_color "$env" "$previous"

  local current_project="ajo-${env}-${current}"
  log_info "Stopping current deployment '$current_project'"
  docker-compose -f docker-compose.staging.yml -p "$current_project" down || true

  log_ok "Rollback complete. Active color for $env: $previous"
}

deploy_contracts_testnet() {
  require_cmd bash
  pushd "$ROOT_DIR" >/dev/null
  log_info "Building and deploying Soroban contracts to testnet"
  if [[ -x "scripts/deploy_testnet.sh" ]]; then
    CI=1 bash scripts/deploy_testnet.sh
  else
    log_error "scripts/deploy_testnet.sh not found or not executable"
    exit 1
  fi
  popd >/dev/null
}

deploy_contracts_mainnet() {
  log_warn "Mainnet deployment is intentionally manual."
  log_warn "Use a hardened workflow and verified keys when you are ready."
  log_info "You can base a mainnet script on scripts/deploy_testnet.sh with the mainnet RPC URL and passphrase."
}

usage() {
  cat <<EOF
Usage:
  $(basename "$0") app <staging|production>     # Blue/green deploy backend + DB
  $(basename "$0") rollback <staging|production> # Roll back to previous color
  $(basename "$0") contracts:testnet           # Build & deploy contracts to testnet
  $(basename "$0") contracts:mainnet           # Print guidance for manual mainnet deploy

Environment variables:
  BACKEND_IMAGE   Required for app deploy (backend image tag)
  HEALTHCHECK_URL Optional HTTP URL to validate deployment
  SEED_TEST_DATA  If 'true', run backend seed script after migrations
EOF
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    app)
      deploy_app "${2:-staging}"
      ;;
    rollback)
      rollback_app "${2:-staging}"
      ;;
    contracts:testnet)
      deploy_contracts_testnet
      ;;
    contracts:mainnet)
      deploy_contracts_mainnet
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"

