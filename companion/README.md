# Bucket Coach Collector 1.0.0

Experimental companion for desktop Chrome and Chromebooks. Standard Chrome on Android and Safari on iPad cannot load this companion.

1. Extract this folder. In Chrome open chrome://extensions, enable Developer mode, choose Load unpacked, then select the folder containing manifest.json.
2. Sign into GameChanger directly, with your paid account and any team permissions needed. Open the team's schedule and dismiss the follow/signup overlay if present.
3. Open the Bucket Coach extension. Enter the EXACT team name shown on the page and the schedule's season year. Click Collect completed games.
4. Keep the GameChanger tab open. Do not change it while collecting. You may close and reopen the extension popup to see progress. Stop collection ends after the current game.
5. Download JSON; import it into Bucket Coach. Transfer the file to your phone/iPad if needed.

It reads rendered, unblurred schedule/results and player table cells. It does not read credentials, cookies, tokens, network responses, hidden application state or private APIs, and it does not unlock restricted content. Team ownership is verified by the nearest preceding exact team-name text. When that cannot be established, the table is skipped and recorded as an issue. Captured rows remain marked partial until reviewed. Review imported results against GameChanger.

Live signed-in extraction has NOT been validated successfully. GameChanger DOM changes, duplicate team labels, virtualized rows, unusual date formats, localized UI or account errors may prevent collection. No spray coordinates are inferred. Use charted contacts or import contact records for spray charts. Permission to view data is different from provider authorization for automated collection; the companion is not an official or approved GameChanger integration. GameChanger's published terms restrict automated access. Obtain provider permission for use of automated collection.

Source files are included for review. No data is sent to Bucket Coach servers. Extension progress and capture data are stored in chrome.storage.local on your device. Uninstalling the companion removes its local storage.
