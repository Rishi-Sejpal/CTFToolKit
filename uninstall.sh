#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
ASSUME_YES=0
REMOVE_PACKAGES=0
PROFILE="essentials"

usage() {
  cat <<'EOF'
CTFToolKit uninstaller

Usage: uninstall.sh [options]
  --dry-run          Show planned changes without applying
  --yes              Assume yes to prompts
  --remove-packages  Also remove packages installed by a profile
  --profile P        Profile packages to remove (essentials|full)
  --help             Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift;;
    --yes) ASSUME_YES=1; shift;;
    --remove-packages) REMOVE_PACKAGES=1; shift;;
    --profile) PROFILE="$2"; shift 2;;
    --help) usage; exit 0;;
    *) echo "Unknown option: $1"; usage; exit 2;;
  esac
done

log() { echo "[$(date '+%H:%M:%S')] $*"; }
run() {
  if [[ $DRY_RUN -eq 1 ]]; then echo "DRY-RUN: $*"; else log "Running: $*"; "$@"; fi
}
sudo_run() {
  if [[ $DRY_RUN -eq 1 ]]; then echo "DRY-RUN (privileged): $*"; else log "Running (privileged): $*"; sudo "$@"; fi
}
consent() { [[ $ASSUME_YES -eq 1 || $DRY_RUN -eq 1 ]] && return 0; read -r -p "$1 [y/N] " ans; [[ "$ans" =~ ^[Yy]$ ]]; }

# Remove wordlists
if consent "Remove /usr/share/wordlists/seclists?"; then
  if [[ -d /usr/share/wordlists/seclists ]]; then
    sudo_run rm -rf /usr/share/wordlists/seclists
  else
    log "SecLists not present"
  fi
fi
if consent "Remove /usr/share/wordlists/rockyou.txt?"; then
  if [[ -f /usr/share/wordlists/rockyou.txt ]]; then
    sudo_run rm -f /usr/share/wordlists/rockyou.txt
  else
    log "rockyou.txt not present"
  fi
fi

if [[ $REMOVE_PACKAGES -eq 1 ]]; then
  log "Package removal is distro-specific; use your package manager manually for safety."
fi

log "Done"
