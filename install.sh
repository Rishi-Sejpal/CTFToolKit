#!/usr/bin/env bash
# CTFToolKit native Linux installer
set -euo pipefail

PROFILE="essentials"
DRY_RUN=0
ASSUME_YES=0
SELECTED=""
LOG_FILE="${TMPDIR:-/tmp}/ctftoolkit-install.log"

usage() {
  cat <<'EOF'
CTFToolKit installer

Usage: install.sh [options]
  --profile essentials|full|custom   Installation profile (default: essentials)
  --dry-run                         Show planned changes without applying
  --yes                             Assume yes to prompts
  --select "pkg1,pkg2"              Packages for custom profile
  --help                            Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile) PROFILE="$2"; shift 2;;
    --dry-run) DRY_RUN=1; shift;;
    --yes) ASSUME_YES=1; shift;;
    --select) SELECTED="$2"; shift 2;;
    --help) usage; exit 0;;
    *) echo "Unknown option: $1"; usage; exit 2;;
  esac
done

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG_FILE" >&2; }

run() {
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY-RUN: $*"
  else
    log "Running: $*"
    "$@"
  fi
}

sudo_run() {
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY-RUN (privileged): $*"
  else
    log "Running (privileged): $*"
    sudo "$@"
  fi
}

consent() {
  if [[ $ASSUME_YES -eq 1 || $DRY_RUN -eq 1 ]]; then return 0; fi
  read -r -p "$1 [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]]
}

detect_distro() {
  if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release
  fi
  local id="${ID:-unknown}"
  case "$id" in
    arch) DISTRO="arch";;
    debian) DISTRO="debian";;
    ubuntu) DISTRO="ubuntu";;
    kali) DISTRO="kali";;
    *)
      if echo "${ID_LIKE:-}" | grep -qi arch; then DISTRO="arch"
      elif echo "${ID_LIKE:-}" | grep -qi debian; then DISTRO="debian"
      else DISTRO="unknown"; fi
      ;;
  esac
  log "Detected distro: $DISTRO (${PRETTY_NAME:-})"
}

# Allowlisted packages per distro
packages_for() {
  local distro="$1" profile="$2"
  case "$distro" in
    arch)
      case "$profile" in
        essentials) echo "base-devel git curl wget python python-pip nmap tcpdump";;
        full) echo "base-devel git curl wget python python-pip nmap tcpdump wireshark-qt john hashcat ffuf gobuster sqlmap binwalk ghidra metasploit aircrack-ng nikto hydra strace ltrace radare2 gdb perl-image-exiftool";;
      esac
      ;;
    debian|ubuntu)
      case "$profile" in
        essentials) echo "build-essential git curl wget python3 python3-pip nmap tcpdump";;
        full) echo "build-essential git curl wget python3 python3-pip nmap tcpdump wireshark john hashcat ffuf gobuster sqlmap binwalk ghidra metasploit-framework aircrack-ng nikto hydra strace ltrace radare2 gdb exiftool";;
      esac
      ;;
    kali)
      case "$profile" in
        essentials) echo "git curl wget python3 nmap tcpdump";;
        full) echo "kali-linux-everything";;
      esac
      ;;
  esac
}

validate_package_name() {
  [[ "$1" =~ ^[A-Za-z0-9._+-]+$ ]]
}

install_packages() {
  local distro="$1" profile="$2"
  local pkgs
  if [[ "$profile" == "custom" ]]; then
    pkgs="${SELECTED//,/ }"
  else
    pkgs="$(packages_for "$distro" "$profile")"
  fi
  # validate allowlist
  for p in $pkgs; do
    if ! validate_package_name "$p"; then
      log "Invalid package name: $p"; exit 1; fi
  done
  log "Planned packages: $pkgs"
  if ! consent "Install these packages?"; then log "Cancelled"; exit 0; fi

  case "$distro" in
    arch)
      sudo_run pacman -Sy --needed --noconfirm $pkgs
      ;;
    debian|ubuntu|kali)
      sudo_run apt-get update
      if [[ "$profile" == "full" && "$distro" == "kali" ]]; then
        sudo_run apt-get install -y kali-linux-everything
      else
        sudo_run apt-get install -y $pkgs
      fi
      ;;
  esac
}

install_seclists() {
  local target="/usr/share/wordlists/seclists"
  log "SecLists target: $target"
  if [[ -d "$target" ]]; then log "SecLists already present"; return 0; fi
  if ! consent "Install SecLists into $target?"; then return 0; fi
  local tmp
  tmp="$(mktemp -d)"
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY-RUN: git clone https://github.com/danielmiessler/SecLists.git $tmp/seclists"
    echo "DRY-RUN: sudo mv $tmp/seclists $target"
    return 0
  fi
  if ! command -v git >/dev/null 2>&1; then log "git not found"; return 1; fi
  git clone --depth 1 https://github.com/danielmiessler/SecLists.git "$tmp/seclists"
  sudo mkdir -p /usr/share/wordlists
  sudo mv "$tmp/seclists" "$target"
  log "SecLists installed"
}

extract_rockyou() {
  local src=""
  for cand in /usr/share/wordlists/rockyou.txt.tar.gz /usr/share/wordlists/rockyou.txt.gz; do
    if [[ -f "$cand" ]]; then src="$cand"; break; fi
  done
  if [[ -z "$src" ]]; then log "No rockyou archive found"; return 0; fi
  local target="/usr/share/wordlists/rockyou.txt"
  log "Found archive: $src"
  if [[ -f "$target" ]]; then
    if ! consent "Replace existing $target?"; then return 0; fi
  fi
  if ! consent "Extract $src to $target?"; then return 0; fi
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY-RUN: validate and extract $src -> $target"
    return 0
  fi
  local tmp
  tmp="$(mktemp -d)"
  if [[ "$src" == *.tar.gz ]]; then
    # validate members
    if tar -tzf "$src" | grep -E '(^/|\.\.)' >/dev/null; then
      log "Unsafe archive members detected"; return 1
    fi
    tar -xzf "$src" -C "$tmp"
  else
    # gz single file
    gzip -dc "$src" > "$tmp/rockyou.txt"
  fi
  # find rockyou.txt
  local found
  found="$(find "$tmp" -name 'rockyou.txt' -type f | head -n1)"
  if [[ -z "$found" ]]; then
    # if extracted a single file named differently
    found="$(find "$tmp" -type f | head -n1)"
  fi
  if [[ -z "$found" ]]; then log "rockyou.txt not found in archive"; return 1; fi
  # validate it's a regular file and non-empty
  if [[ ! -s "$found" ]]; then log "Extracted file empty"; return 1; fi
  sudo cp "$found" "$target.tmp"
  sudo mv "$target.tmp" "$target"
  log "rockyou.txt extracted to $target (original archive preserved)"
}

main() {
  case "$PROFILE" in essentials|full|custom) ;; *) log "Unknown profile: $PROFILE"; exit 2;; esac
  detect_distro
  if [[ "$DISTRO" == "unknown" ]]; then log "Unsupported distro"; exit 1; fi
  log "Profile: $PROFILE"
  if [[ "$PROFILE" == "full" && "$DISTRO" == "kali" ]]; then
    log "Kali full profile will use kali-linux-everything metapackage"
  fi
  install_packages "$DISTRO" "$PROFILE"
  install_seclists
  extract_rockyou
  log "Done"
}

main
