#!/usr/bin/env bash
set -euo pipefail
mkdir -p .bucket-coach-data
chmod 700 .bucket-coach-data
if curl --silent --fail http://127.0.0.1:3000/api/health >/dev/null; then
  echo "Bucket Coach is already running. Open port 3000 in the Ports tab."
  exit 0
fi
nohup npm start > .bucket-coach-data/server.log 2>&1 < /dev/null &
for attempt in $(seq 1 30); do
  if curl --silent --fail http://127.0.0.1:3000/api/health >/dev/null; then
    echo "Bucket Coach is ready. Open port 3000 in the Ports tab."
    exit 0
  fi
  sleep 1
done
echo "Startup did not complete. Run npm start in the terminal to see the startup error."
exit 1
