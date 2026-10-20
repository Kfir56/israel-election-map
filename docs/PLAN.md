# Israel Election Map 2026: Plan

A Hebrew-first site that helps people understand the 26th Knesset election: a minimalist 3D map of Israel with every party on it, what each party says on each topic, and who is on its list. Live results and a free seat prediction game with login come after.

## Update (19 Oct, evening): sourced data

- **Polls** (`src/data/polls.ts`): the 10 most recent polls (13–18 Oct) from the skarim.org archive, each with outlet, pollster, date and a link; several cross-checked against the publisher's article. The map can show any single poll or the average; a table at the bottom shows all polls side by side with the min/max highlighted, because they differ a lot (Likud ranges 18–29).
- **Candidates**: top 10–20 of every list, from the official lists submitted to the Central Elections Committee as published by IDI (PDF linked per party). Short background notes (past offices) are ours and labeled as such.
- **Positions**: condensed from each party's IDI page, linked per party. Topics IDI doesn't cover are shown as "המקור לא מתייחס לנושא" rather than guessed. Gaps: Together and the Joint List have no positions on IDI; next step is their own platforms.

## Update (19 Oct, later): real 3D terrain + coalition game

- The map is now real terrain: elevation from AWS Terrain Tiles (`scripts/make-terrain.mjs` bakes `public/terrain.bin`), ~25x vertical exaggeration so the Galilee, Hermon, Judean hills, Ramon crater, Kinneret and Dead Sea read clearly. Israel is lit and colored (green north, sand Negev, snow on Hermon); neighbouring land is dimmed.
- Free camera: drag to rotate, scroll/pinch to zoom, right-drag to pan. Fly-in from space on load; clicking a party glides the camera to it.
- Parties are glowing light beams standing on the terrain (height = poll seats).
- **Gimmick: "👑 נסו להרכיב קואליציה"**. Click parties to add them to a coalition; gold arcs fly from each party to a floating Knesset ring above Jerusalem that fills toward 61. At 61+ the ring spins gold, sparkles burst and the HUD shows "🎉 יש ממשלה!".
- More gimmick ideas for later: share your coalition as an image, "political earthquake" button that animates poll swings, night-of-election mode where beams grow live with results.

## Update (19 Oct): explainer first

Kfir's direction: Hebrew first, and the political map comes first. It does not need to be a real geographic map; a stylized 3D Israel shape is the stage, and the parties sit on it.

**What v1 does (built, in this repo):**
- Stylized 3D Israel shape (Natural Earth outline, extruded, glowing edges), rotatable.
- One pillar per party. Height = seats in the latest poll. Position = where the party sits: left↔right across the map (left wing on screen left), secular (south) ↔ religious (north). The narrow middle of the country pushes parties north or south, never sideways, so left/right stays honest.
- Click a party (on the map or the list) for its page: leader, bloc, poll vs. outgoing Knesset, short summary, positions per category, and its candidate list.
- "What each party says" section: pick a category (security, religion and state, economy, judiciary, Haredi draft) and see every party's stance side by side.
- Bloc balance bar against the 61-seat line; click a bloc to highlight its parties.
- Full RTL Hebrew UI (Heebo font), works on phones.

**Content still to do (the biggest job):**
- Positions are short editorial drafts, and many are "טרם הוזן". Each needs a source link (party platform, interviews, Knesset votes) before it is marked verified.
- Candidate lists are partial (from Wikipedia) and need checking against the CEC's official lists, plus each candidate's current job (minister, MK, former general, etc.).
- Poll numbers: one poll (Kantar for Kan 11, 6 Sep). Next: an average of recent polls.
- The left/right and secular/religious placements are editorial judgments and should be explained on the site.

**Next features for the explainer:**
1. Candidate cards: photo, role, background, link to their Knesset page.
2. Search ("who is X, which party?").
3. Compare two parties side by side.
4. "Which party matches me" quiz built from the same category data.
5. Source link under every position.
6. Move content into Supabase with a small admin page so it can be edited without code.

The sections below are the original plan for live results and the prediction game, which now come after the explainer.

## The deadline that shapes everything

- **Election day is Tuesday 27 October 2026.** That is 8 days from when this plan was written (19 Oct).
- Polls close at 22:00 Israel time and TV exit polls come out immediately. Counting runs through the night, and the Central Elections Committee (CEC) confirms final results on **4 November**.
- Predictions only make sense **before** polls open, so the login + prediction game has to be live by about 24 Oct to give people time to play. The live results map has to be ready by election night.
- So we build in phases, shipping the most time-critical part first.

## What "bet" means here

A **free prediction game**: points, leaderboard, friend leagues. No real money. Gambling is a criminal offence in Israel outside the licensed operators (Mifal HaPais, the Sports Betting Board), so a real-money product is off the table. Optional later: winners get a badge or a shareable card, never money.

## Ideas

### The 3D map
1. **Extruded Israel map** (main view). Each municipality or locality is a 3D column. Color = leading party, height = number of votes (or turnout). Rotate, zoom, click a town to see its full breakdown.
2. **3D Knesset hemicycle.** 120 seats arranged like the plenum, colored by party, animating as results change. Shows "61" as a clear line for coalition math.
3. **Bloc view.** Toggle that recolors everything into coalition vs. opposition vs. Arab parties, with a live 61 meter.
4. **Time slider.** Replay the night: exit poll → 20% counted → 50% → final, watching the map shift.
5. **"My prediction vs. reality"** overlay: your predicted hemicycle side by side with the live one, and your live score.

### Real-time
- Live seat counts and "% of votes counted" pushed to every open browser without refreshing.
- Threshold watch: parties hovering around 3.25%, since one party falling below it reshapes the whole Knesset.
- Coalition calculator: drag parties into a coalition and see if it reaches 61.

### Prediction game
- Each user splits 120 seats between the parties. Rules enforced in the UI: total must be 120, and a party gets either 0 or at least 4 seats (the threshold makes 1 to 3 seats impossible).
- Bonus picks: which parties fall below the threshold, which bloc reaches 61, turnout %.
- Predictions lock when polls open (07:00 on 27 Oct).
- Scoring: start from 240 points, subtract the total absolute seat error across all parties, add bonuses. A live provisional score updates during the count; final score on 4 Nov.
- Leaderboard (global) and **private leagues** with an invite link for friends, family, coworkers.
- Share card: an image of your prediction for WhatsApp / X.
- "Crowd prediction": the average of all users' predictions, shown next to the polls average.

## Tech stack

| Part | Choice | Why |
|---|---|---|
| App | Next.js (App Router, TypeScript, Tailwind) | First-class on Vercel; already scaffolded in this repo |
| Hosting | Vercel | Requested; preview deploys per PR |
| Database + auth + realtime | Supabase (Postgres, Auth, Realtime) | One service for login, storing predictions and pushing live updates to browsers; generous free tier |
| Login | Supabase Auth: Google sign-in + email magic link | No passwords to manage |
| 3D | react-three-fiber + drei (three.js) | React-friendly 3D; good for extruded GeoJSON and the hemicycle |
| Map data | Israeli localities GeoJSON (simplified with mapshaper) | Small enough to load fast on phones |
| Results ingestion | Scheduled job that polls CEC results and writes to Supabase | Browsers subscribe to Supabase Realtime, not the CEC site |

### Scheduling the "real-time" fetch
Vercel Cron on the free Hobby plan only runs once a day, which is not enough on election night. Options, best first:
1. **Supabase pg_cron + an Edge Function** every minute (free, no Vercel plan needed).
2. Vercel Pro cron (per-minute).
3. A GitHub Actions schedule (minimum ~5 minutes, can lag).

## Data sources

| Data | Source | When | Risk |
|---|---|---|---|
| Party lists | CEC approved lists | Now | Low; seed list already in `src/data/parties.ts`, verify ballot letters |
| Polls | Published TV / newspaper polls (Channel 12, 13, Kan, Maariv), averaged | Until the legal poll blackout before election day | Entered manually or via a small admin form |
| Exit polls | TV channels at 22:00 | Election night | No API; admin enters them by hand in the first minutes |
| Live counts | CEC results website (per locality and ballot box) | From ~midnight | **Biggest risk**: format is only known on the night. Plan: inspect the 2022 results site now, write a parser, and keep a manual admin fallback |
| Final results | CEC | 4 Nov | Low |
| Historical (for comparison) | CEC results for the 25th Knesset (2022) | Now | Low; useful to build and test the map before the night |

## Data model (Supabase)

- `parties` (id, name, name_he, leader, color, bloc, ballot_letters)
- `results_snapshots` (id, taken_at, source: poll / exit_poll / live / final, pct_counted)
- `party_results` (snapshot_id, party_id, votes, seats)
- `locality_results` (snapshot_id, locality_id, party_id, votes) for the map
- `profiles` (user_id, display_name, avatar)
- `predictions` (user_id, party_id, seats, locked_at), plus `prediction_extras` (turnout, bloc winner)
- `leagues`, `league_members`
- Row-level security: users can only write their own predictions, and only before the lock time.

## Phases

### Phase 0: Political explainer (v1 built; content in progress)
- See the update at the top

### Phase 1: Prediction game (target: live by 24 Oct)
- Supabase project, tables, row-level security
- Login (Google + magic link)
- Prediction screen with seat sliders and the rules enforced
- 3D hemicycle showing your prediction and the poll average
- Leaderboard and private leagues
- Deploy to Vercel, connect a domain if you have one

### Phase 2: Live election night (target: ready by 26 Oct)
- 3D extruded map, tested with 2022 results
- Results ingestion job + admin form for exit polls and manual fallback
- Realtime updates to every open browser
- Live provisional scores
- Load test: election night traffic spikes; keep pages static and push only small JSON updates

### Phase 3: After the night (to 4 Nov and beyond)
- Final scoring on 4 Nov, winners announced
- Time slider replay
- Coalition calculator
- Hebrew / English toggle and right-to-left layout

## Open decisions for you
1. ~~Language~~: decided, Hebrew first.
2. **Map unit**: localities (simpler, ~1,200 shapes) or statistical areas (finer, heavier)? (Default: localities.)
3. **Domain name**, if any.
4. **Supabase**: create a new project under your account? There's a Supabase connector in this project that can do it.

## Next steps
1. Create the GitHub repo and push this scaffold.
2. Import the repo into Vercel (vercel.com/new → pick the repo → Deploy). No settings needed for the scaffold.
3. Start Phase 1.

## Update 19 Oct 2026: party and candidate pages
- `/party/<id>`: full page per party: stats, all positions (with what every other party says on the same topic), full list linked to candidates, milestones, every poll.
- `/party/<id>/<pos>`: page per candidate: background, education, service, previous roles timeline, parties. 186 candidates have bios (from English Wikipedia, Hebrew Wikipedia when `lang: "he"`, or news reports listed in `sources` for people with no article; former ministers also get a "בתפקידים בממשלה" section of notable steps and criticism from `src/data/records.json`, condensed from Hebrew Wikipedia; `src/data/bios.json`, raw batches in `scripts/bios/`); ongoing roles end in "–" in the data and render as "–היום"; the rest show their list place and note.
- Next: bios for the rest of the lists; positions for ביחד and the Joint List from their own platforms.

## Update 19 Oct 2026: accounts, predictions and friends
- Backend: Supabase project `israel-election-map` (wfxotfqfgwtmhsnnobut, eu-central-1, free plan). Tables `profiles`, `follows`, `predictions`, all with row level security. Schema in `supabase/migrations/`.
- Friends = two people who follow each other. Predictions are visible only to their owner and that person's friends; strangers see nothing (tested in SQL).
- Predictions lock when polls open (27 Oct 07:00 Israel time), enforced in the database; totals can't exceed 120.
- Pages: navbar on every page, `/login` (Google or email), `/predict`, `/friends` (search, follow, invite link), `/dashboard` (friends only), `/parties`.
- Needs Kfir in the Supabase dashboard: Site URL + redirect URL, turn off "Confirm email" (built-in mailer only reaches team members), and a Google OAuth client for the Google button.
- Next: scoring after the official results.

## Update 19 Oct 2026: making the map understandable
- "How to read the map" guide above the map (4 steps, can be hidden; remembered per visitor), and axis chips on the map itself (left/right, more religious/more secular).
- New home intro with key numbers and buttons, a "terms in short" FAQ (seat, threshold, 61, blocs, why polls differ, no money), a site-wide footer with sources, and candidate search on /parties.

## Update 19 Oct 2026: elections guide
- `/guide`: how the elections work, from the ballot to the government (6 steps), key terms, and an interactive seat calculator (threshold + Bader-Ofer + surplus agreements, `src/lib/seats.ts`; reproduces the 2022 result exactly).
- `/topics/<id>`: a page per topic (security, religion, economy, judiciary, draft): the question, background, three main approaches, a party scale (security and religion only, our estimate), every party's position, and key terms. Content in `src/data/topics.ts`.
- Ideas not built yet: "which party fits me" quiz, poll trend chart, head-to-head party comparison.
- `/compare?a=&b=`: two parties side by side (leader, bloc, polls, map position, every topic, top 5 candidates). Shareable link.
- `/quiz`: 10 statements → your position on the map's two axes → closest parties, with a clear "not a voting recommendation" note.

## 19 Oct (evening): sources, small lists, why-vote, women
- Positions: `src/data/positions.json` (from `scripts/positions/{a,b}.json`) overrides the IDI text per topic with the party's platform / website / dated 2026 statement; each topic shows source type, label and date. IDI stays as fallback. Scores (-2..2) are stored but NOT used for the map: too coarse (they put Likud with Otzma and RZP below Likud on religion).
- Map placement (`spectrum`) stays editorial, judged from the sourced positions; MapGuide says so. Yashar/BW no longer overlap.
- Blue and White withdrew 19 Oct (stays on the ballot): `withdrawn` field, banner on party page and map panel. Abou Shahadeh (joint:3) withdrew 2 Oct.
- Ballot letters (`letter`) on party pages and list. 24 small lists in `src/data/minor-lists.json`, shown on /parties#minor.
- /why-vote page (2022 numbers, blank ballot = invalid). Women's representation on /parties#women (`src/data/gender.ts`, 4 unconfirmed).
- Logos: blocked, the sandbox can't download images (Wikimedia/party sites refused by proxy).

### 20 Oct: coalitions page
- `/coalitions`: every minimal 61-seat combination for the poll average or any single poll, sorted by how many stated red lines it breaks. Data in `src/data/coalition-lines.json` (recommends / won't sit with / conditions, each sourced and dated). Netanyahu-the-person lines are filed under Likud with a note; Amcha's paraphrased refusals dropped. On the current average no combination reaching 61 breaks zero red lines.
