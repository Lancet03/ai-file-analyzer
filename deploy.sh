#!/usr/bin/env bash
set -e

REMOTE="adsa-front"
REMOTE_DIR="/var/front"

rsync -az --delete \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".idea" \
  --exclude ".vscode" \
  --exclude "venv" \
  --exclude "logs" \
  ./ "$REMOTE:$REMOTE_DIR"

ssh "$REMOTE" "bash -s -- '$REMOTE_DIR'" <<'REMOTE_SCRIPT'
set -euo pipefail

REMOTE_DIR="$1"

cd "$REMOTE_DIR"
mkdir -p logs
source ~/.nvm/nvm.sh
nvm install 20.9.0
nvm use 20.9.0
npm ci
npm run build

if [ -f logs/front.pid ]; then
  OLD_PID="$(cat logs/front.pid)"
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    kill "$OLD_PID" 2>/dev/null || true
    for _ in 1 2 3 4 5 6 7 8 9 10; do
      kill -0 "$OLD_PID" 2>/dev/null || break
      sleep 0.5
    done
  fi
fi

pkill -f '[n]ext/dist/bin/next start' || true
nohup npm run start -- --hostname 0.0.0.0 --port 3000 > logs/front.log 2>&1 < /dev/null &
echo "$!" > logs/front.pid
echo "Front started. PID: $(cat logs/front.pid)"
REMOTE_SCRIPT

echo "Deploy to TEST complete."
