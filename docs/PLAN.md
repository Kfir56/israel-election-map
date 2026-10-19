# Israel Election Map 2026: Plan

A real-time 3D map of the 26th Knesset election, hosted on Vercel, with user login and a free seat prediction game.

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
1. **Language**: Hebrew first, English first, or both from day one? (Default: Hebrew UI with English toggle.)
2. **Map unit**: localities (simpler, ~1,200 shapes) or statistical areas (finer, heavier)? (Default: localities.)
3. **Domain name**, if any.
4. **Supabase**: create a new project under your account? There's a Supabase connector in this project that can do it.

## Next steps
1. Create the GitHub repo and push this scaffold.
2. Import the repo into Vercel (vercel.com/new → pick the repo → Deploy). No settings needed for the scaffold.
3. Start Phase 1.
