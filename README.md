# Bucket Coach 1.0.0

Mobile-first baseball scouting workspace. A buildless website: no package install or custom backend is required.

## Run / publish

The GitHub-ready download has all website files inside one Bucket-Coach folder. Upload that folder's CONTENTS into your repository root. Enable GitHub Pages from the root. Relative assets work under a repository subpath. On HTTPS, the shell caches for offline reopening after an initial online visit. Browser data is local to each browser/origin; hosted Sites and GitHub Pages do not share saved work. Export a backup before moving hosts or devices.

## Included

- Multiple saved teams and GameChanger team links.
- Season, last-five, last-ten and opponent filters.
- Team records, scoring, run differential, shared-opponent comparisons and trends.
- Player batting and pitching profiles, per-game logs and notes.
- Weighted AVG, OBP, SLG and OPS using only complete-input rows; seven-inning ERA, WHIP, BB% and K% using complete relevant inputs. Missing data remains blank. IP uses outs, not decimal arithmetic.
- Team/player spray charts with contact type and physical field direction.
- Bunt attempts and explicitly tagged successes; manual tap-to-chart contacts.
- Source coverage, partial-data labels and small-sample indicators.
- Coaching plans, notes, printable reports / browser Save as PDF.
- CSV/JSON imports with preview, conservative merge, backup/restore, CSV exports.
- Experimental Chrome/Chromebook collection companion. See companion/README.md.

## Seed evidence

21 public Outlaws results captured October 22, 2026 (14–7, 301 runs scored, 157 allowed). Eight complete batting rows from the user's screenshot of October 20 vs Sandlot. This player's evidence is explicitly partial and not representative of season totals. No fabricated pitching or spray records are included.

## Important integration boundary

The website is not connected to GameChanger authentication and does not receive your password. A signed-in browser session is not automatically shared with another website. The included extension attempts to read visible schedule and box-score tables in your own Chrome session and export JSON. The DOM extractor passed controlled local fixtures, including rejecting blurred/opponent rows. Live end-to-end collection from a successfully signed-in GameChanger account remains UNVERIFIED because the tested account session returned an account-loading error. Paid subscriptions and team permissions do not guarantee automatic integration support. It is not an official GameChanger integration. Their published terms restrict automated access; provider authorization is needed for automated collection.

The collector currently imports schedules, final scores and recognized box-score columns, not spray coordinates, full play-by-play or video. Spray, batted-ball mix and bunt analysis become available from charted or imported contact records. The website never invents them. This is a two-step collect/import workflow, not unattended link-only synchronization. Standard Chrome on Android and Safari on iPad do not run the companion; collection requires a compatible Chrome desktop/Chromebook, then the JSON can be transferred to mobile.

## Imports

JSON: {"teamName":"…","games":[…]}. Each game needs date (YYYY-MM-DD), opponent, runs and allowed. Optional stable id, source, sourceUrl, partial, batting, pitching and contacts. Player rows need name; number and position are optional. Optional numeric fields: ab,r,h,rbi,bb,so,doubles,triples,hr,sb,cs,hbp,sf,ip,er,pitches,bf. Omit unknown fields or use null, never substitute 0. Contacts need x,y (0–100), type (GB,LD,FB,BUNT,OTHER), outcome (HIT,OUT,ERROR,SAC,OTHER), with optional name,number,buntSuccess,source. X increases left to right, Y increases downward; home is roughly x=50,y=92.2. Locations can describe contact or recorded fielding locations; note the convention in source.

CSV: date,opponent,runs,allowed are required. Add game_id for stable identity and doubleheaders. For player rows include kind (batting/pitching), name,number and any optional numeric fields above. Repeated rows with the same game_id are combined into one game. Native GameChanger season CSVs may require reshaping into this per-game format; a sample template is downloadable inside the app. A unique stable ID distinguishes otherwise identical doubleheader results. Without IDs, games merge by date/opponent/final score. Matching imports with nonempty player/contact arrays replace that game's corresponding row sets; empty imports preserve existing richer rows.

Backups include all teams, games and notes. Restore is an explicit replacement of the local workspace. Keep backups before deleting browser data. No cloud sync, multiplayer collaboration or server account is implemented.

## Checks

Node: node tests/core.test.cjs (in the source checkout). The delivered website does not require Node. Verified import preview/commit, tap-to-chart save, player metrics, mobile-width spray rendering, matching-game merges and local DOM extraction fixtures. Signed-in live GameChanger capture and a physical device install are not verified.
