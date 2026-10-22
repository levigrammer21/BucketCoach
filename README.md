# Bucket Coach 1.1 — personal automatic scouting

[**Start Bucket Coach in a free GitHub Codespace**](https://codespaces.new/levigrammer21/BucketCoach?quickstart=1)

1. Choose **Create codespace**. Keep the default two-core machine.
2. Wait for setup to install the browser. The app opens automatically on port **3000**. If it doesn't, open the **Ports** tab and choose **Open in Browser** for **Open Bucket Coach**.
3. In Bucket Coach, choose **Connect GameChanger**. Tap the GameChanger field in the browser image, enter its text in the box underneath and tap **Send text**. Tap GameChanger's own buttons in the image. Complete any verification code in this window.
4. Choose **Done — continue scouting**, then **Scout a link**. Paste a team or game share link. Results and player rows flow directly into the report; no extension or file import is required.

The app now includes its own server and browser collector. The public GitHub Pages / static Sites address cannot run that server: use the Codespace app URL for automatic scouting. Its connection screen links to the Codespace launcher rather than pretending automatic collection is available on a static host.

## What is implemented

- An in-app interactive GameChanger browser view for your direct sign-in.
- A persistent browser profile on the personal server. No GameChanger password is hardcoded, committed, returned through the API, or logged by Bucket Coach.
- Team/game shared-link input; a game link identifies its team, then the app scans that team's accessible completed schedule.
- One scouting job at a time, progress, stop/resume, sign-in-required handling and collection notes.
- Rendered visible schedule and box-score extraction. Blur/visibility checks and team-label verification reject locked or unverified player rows.
- Automatically saved reports and workspace on the server, with local backup fallback.
- Multiple team reports, weighted hitting/pitching metrics, player logs, comparisons, manual/imported spray contacts, bunt tags, notes and printable reports from 1.0.
- Android Web Share target when installed as a supported web app.

## Live verification status

**Successful signed-in extraction against GameChanger is still unverified.** The previous cloud browser session returned an account-loading error. This release implements the actual server workflow rather than assuming a popup or paid subscription connects the websites. Live GameChanger page structure, permissions, human verification and account restrictions may still require changes after testing in your Codespace.

Verified locally: parser/math checks; backend HTTP and workspace persistence; automatic collection-to-report using a clearly identified fixture browser; pause for locked player rows; in-app connection viewer; resume and automatic report population without file import. Fixture tests do not establish GameChanger compatibility.

The collector reads rendered page data. It does not use private APIs or unlock restricted content. It currently collects final scores and recognized player-table columns. It does **not** claim to collect full play-by-play, spray coordinates, video or all supplemental stat lines. Missing optional stats remain unknown. All captured player boxes are conservatively marked partial until reviewed. Spray/bunt analysis requires observed or imported contact records. Team memberships and subscription access determine what you can see; the integration is not approved or endorsed by GameChanger. Their published terms restrict automated access; seek provider authorization for automated collection.

## Free testing and saved data

GitHub personal accounts include limited free Codespaces compute/storage. Stop the Codespace when finished; this is not permanent free production hosting. Keep port 3000 **private**. No application account is added because the private Codespaces port is the access boundary for this personal test.

Your server workspace, job progress and browser profile are in `.bucket-coach-data/`, excluded from Git and static serving. They persist across an ordinary stop/restart of the same Codespace. Deleting the Codespace deletes its data. Download a backup before deleting it. Browser profile data is sensitive even though it is not a saved plain-text password. Use **Forget GameChanger session** to clear the browser profile without removing reports.

## Local run

Node 22 or later:

```sh
npm ci
npm run setup:browser
npm start
```

Open `http://localhost:3000`. On Linux, browser setup installs system dependencies and may require sudo. Codespaces handles the setup commands automatically. Optionally set `PORT` and `BUCKET_COACH_DATA_DIR`. The server is a personal prototype; do not expose it as a public multiuser service.

## Development

```sh
npm test
```

API/browser implementation is in `server/`. The app entrypoints remain at repository root for GitHub Pages compatibility. The development Sites checkout places website assets under `dist/`; the server automatically detects either layout. `.devcontainer/devcontainer.json` configures setup and startup; `scripts/start-codespace.sh` launches the app after Codespace startup.

## Seed evidence and import formats

Outlaws seed: 21 public game results captured October 22, 2026, plus the eight complete batting rows visible in your screenshot from one game. Those are the only seeded player rows. No fabricated spray/pitching data is included. Automatic scouting merges matching games by stable ID or fallback date/opponent/final score.

Backup/import tools remain available for recovery, but are not needed for automatic collection. See DATA-FORMAT.md for JSON examples. Existing 1.0 device-local reports can be moved to the server using a backup if needed.
