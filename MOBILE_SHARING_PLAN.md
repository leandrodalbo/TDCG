# Mobile Sharing Plan

## Overview

The web app has social sharing (Twitter/X) and PNG download on many screens. The mobile app has native sharing only on the knockout bracket (`KnockoutsImage`). This plan adds a single "Compartir" button (native share sheet via `RNShare.open()`) to every mobile screen that generates SVG content, following the pattern already established by `KnockoutsImage`.

---

## Established pattern (follow this everywhere)

`match-insights-mobile/src/app/components/sharing-content/knockouts-image/KnockoutsImage.tsx`:

1. Call the core SVG hook/builder to get `svgString` + dimensions
2. Render `<SvgXml xml={svgString} ... />` inside `<ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>`
3. `<Pressable onPress={handleShare} disabled={sharing}>` with label `t('common.share')` (`"Compartir"`)
4. Handler: `const uri = await viewShotRef.current!.capture!()` → `RNShare.open({ url: uri, type: 'image/png', failOnCancel: false })`
5. No new packages needed — `react-native-share` and `react-native-view-shot` are already installed

---

## Web → Mobile gap analysis

| Web component              | Core SVG function             | Mobile component              | Share status |
| -------------------------- | ----------------------------- | ----------------------------- | ------------ |
| `ImageLeagueKnockouts`     | `useLeagueKnockoutsSvg`       | `KnockoutsImage`              | **Done**     |
| `LeagueStanding`           | `buildStandingsSvgString`     | `LeagueStanding`              | Missing      |
| `LeagueFixtureComponent`   | `buildFixtureSvgString`       | league fixtures view          | Missing      |
| `TeamFixtureComponent`     | `buildFixtureSvgString`       | `TeamMatchesList`             | Missing      |
| `MatchesGrid` (per league) | `buildFixtureSvgString`       | `DayMatches` / matches screen | Missing      |
| `GuessThePlayer`           | `buildPlayerTriviaSvg`        | `GuessThePlayer`              | Twitter-only |
| `GuessTheTeam`             | `buildTeamTriviaSvg`          | `GuessTheTeam`                | Twitter-only |
| `RankingPlayerCard`        | `buildPlayerCardSvgString`    | `RankingPlayerCard`           | Missing      |
| `PlayerCard` (squad)       | `buildPlayerCardSvgString`    | `PlayerCard`                  | Missing      |
| `PlayerHistoryDownloads`   | `buildPlayerHistorySvgString` | `PlayerHistoryPage` area      | Missing      |
| `TeamStats`                | `buildTeamStatsSvgString`     | `TeamStats`                   | Missing      |

---

## Tasks

### Task 1 — GuessThePlayer: replace Twitter button with "Compartir" (done)

**File:** `match-insights-mobile/src/app/components/games/player/GuessThePlayer.tsx`

Current: `handleAskTwitter` opens `twitter.com/intent/tweet` via `Linking.openURL`. No SVG generated.

Changes:

- Add `viewShotRef`, `sharing` state
- Build SVG with `buildPlayerTriviaSvg` from core using position, hints, options (mirror the web `GuessThePlayer` formatting)
- Render hidden `<ViewShot><SvgXml .../></ViewShot>` (absolute-positioned, opacity 0, pointerEvents none)
- Replace the `XIcon` Twitter button with a "Compartir" `Pressable` that calls `RNShare.open()` with the captured URI

---

### Task 2 — GuessTheTeam: replace Twitter button with "Compartir" (done)

**File:** `match-insights-mobile/src/app/components/games/team/GuessTheTeam.tsx`

Current: same pattern as GuessThePlayer — Twitter only, no SVG.

Changes: identical to Task 1, using `buildTeamTriviaSvg` with `founded`, `season`, hints, options.

---

### Task 3 — LeagueStanding: add "Compartir" button

**File:** `match-insights-mobile/src/app/components/league/league-standing/LeagueStanding.tsx`

Current: renders standings table with no sharing.

Web reference: `match-insights-ui/src/app/components/league/league-standing/LeagueStanding.tsx` uses `buildStandingsSvgString` with group selection. Web renders a "Download PNG" + Twitter button via `SocialSharing`.

Changes:

- Add share button (toolbar area, top-right like knockouts)
- Build SVG using `buildStandingsSvgString` from core with the currently selected group's data
- Wrap the table in a `ViewShot` or capture the SVG off-screen (SVG approach preferred for fidelity)
- `RNShare.open()` on press

---

### Task 4 — TeamMatchesList: add "Compartir" button

**File:** `match-insights-mobile/src/app/components/team/team-fixture/TeamMatchesList.tsx`

Current: renders previous/upcoming matches list with no sharing.

Web reference: `match-insights-ui/src/app/components/team/team-fixture/TeamFixtureComponent.tsx` has two separate share+download buttons for previous vs upcoming fixtures using `buildFixtureSvgString`.

Changes:

- Add a "Compartir" button
- Build SVG with `buildFixtureSvgString` from core for the visible fixture set
- `RNShare.open()` with captured PNG

---

### Task 5 — League fixtures view: add "Compartir" button

Identify the mobile component that shows league round fixtures (equivalent to web `LeagueFixtureComponent`). Check `match-insights-mobile/src/app/screens/league/` or the league page tabs.

Web reference: `match-insights-ui/src/app/components/league/league-fixture/LeagueFixtureComponent.tsx` uses `buildFixtureSvgString` with round navigation and share+download.

Changes:

- Add share button with same `buildFixtureSvgString` + `RNShare.open()` pattern for the current round

---

### Task 6 — DayMatches / MatchesGrid: add "Compartir" button

**File:** `match-insights-mobile/src/app/components/match/matches-grid/day-matches/DayMatches.tsx` (or parent)

Current: lists matches with no sharing.

Web reference: `match-insights-ui/src/app/components/match/matches-grid/MatchesGrid.tsx` has a share+download button per league section using `buildFixtureSvgString`.

Changes:

- Add per-league-group share button using `buildFixtureSvgString` for that group's matches

---

### Task 7 — TeamStats: add "Compartir" button

**File:** `match-insights-mobile/src/app/components/general/team-stats/TeamStats.tsx`

Current: renders bar chart stats with no sharing.

Web reference: `match-insights-ui/src/app/components/general/team-stats/TeamStats.tsx` uses `buildTeamStatsSvgString` with Twitter share + PNG download via `SocialSharing`.

Changes:

- Add share button using `buildTeamStatsSvgString` from core
- `RNShare.open()` with captured PNG

---

### Task 8 — RankingPlayerCard: add "Compartir" button

**File:** `match-insights-mobile/src/app/components/league/league-rankings/rankin-player-card/RankingPlayerCard.tsx`

Current: navigable player card with no sharing.

Web reference: `match-insights-ui/src/app/components/league/league-rankings/rankin-player-card/RankingPlayerCard.tsx` uses `buildPlayerCardSvgString` with `DownloadOrQuiz` (normal card + quiz obscured version).

Changes:

- Add a "Compartir" button using `buildPlayerCardSvgString`
- Single share button (no need for quiz variant on mobile)

---

### Task 9 — PlayerCard (team squad): add "Compartir" button

**File:** `match-insights-mobile/src/app/components/team/team-details/team-squad/player/PlayerCard.tsx`

Current: player card in squad list with no sharing.

Web reference: same as Task 8 — uses `buildPlayerCardSvgString`.

Changes: same as Task 8.

---

### Task 10 — PlayerHistoryPage: add "Compartir" buttons

**File:** `match-insights-mobile/src/app/screens/player-history/PlayerHistoryPage.tsx` and its child components in `match-insights-mobile/src/app/components/player-history/`

Current: tabs for transfers, trophies — no sharing.

Web reference: `match-insights-ui/src/app/components/player-history/player-downloads/PlayerHistoryDownloads.tsx` has three download buttons: `TRANSFERS`, `TROPHIES`, `QUIZ` modes using `buildPlayerHistorySvgString`.

Changes:

- Add "Compartir" buttons in the transfers and trophies tab areas
- Use `buildPlayerHistorySvgString` from core with the appropriate mode
- `RNShare.open()` on press

---

## Bug fix — KnockoutsImage: return `<NoData />` on null root

**File:** `match-insights-mobile/src/app/components/sharing-content/knockouts-image/KnockoutsImage.tsx`

Current (line 47):

```tsx
if (!svgString) return null;
```

Fix:

```tsx
if (!svgString) return <NoData />;
```

Web does: `if (root === null) return <NoData message={t("nodata.default")} />;`

Import `NoData` from `../../general/no-data/NoData` (already used in the same project).

---

## Bug fix — LeagueKnockoutPage: stepper as default view

**File:** `match-insights-mobile/src/app/screens/league-special/league-knockout/LeagueKnockoutPage.tsx`

Current: `ScreenTabs` has `bracketView` as tab index 0 (default), `stepperView` as index 1.

Web behavior: `const [showTree, setShowTree] = useState(false)` — stepper is default.

Fix: swap tab order so stepper is first:

```tsx
tabs={[
  {
    titleTranslationKey: 'knockout.stepperView',   // first = default
    component: <KnockoutStepper fixtures={fixtures!} />,
  },
  {
    titleTranslationKey: 'knockout.bracketView',
    component: <KnockoutsImage fixtures={fixtures!} leagueName={cleanLeagueName(leagueHeader())} />,
  },
]}
```

---

## i18n

Add `"common.share": "Compartir"` to all locale JSON files under `match-insights-mobile/src/i18n/`. Check whether an English variant (`"Share"`) is needed for non-Spanish locales.

---

## Files to change (summary)

| File                                                                                                       | Change                                                  |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `match-insights-mobile/src/app/components/games/player/GuessThePlayer.tsx`                                 | Replace Twitter button → "Compartir" with SVG share     |
| `match-insights-mobile/src/app/components/games/team/GuessTheTeam.tsx`                                     | Replace Twitter button → "Compartir" with SVG share     |
| `match-insights-mobile/src/app/components/league/league-standing/LeagueStanding.tsx`                       | Add "Compartir" with `buildStandingsSvgString`          |
| `match-insights-mobile/src/app/components/team/team-fixture/TeamMatchesList.tsx`                           | Add "Compartir" with `buildFixtureSvgString`            |
| League fixtures mobile component (identify)                                                                | Add "Compartir" with `buildFixtureSvgString`            |
| `match-insights-mobile/src/app/components/match/matches-grid/day-matches/DayMatches.tsx`                   | Add "Compartir" with `buildFixtureSvgString`            |
| `match-insights-mobile/src/app/components/general/team-stats/TeamStats.tsx`                                | Add "Compartir" with `buildTeamStatsSvgString`          |
| `match-insights-mobile/src/app/components/league/league-rankings/rankin-player-card/RankingPlayerCard.tsx` | Add "Compartir" with `buildPlayerCardSvgString`         |
| `match-insights-mobile/src/app/components/team/team-details/team-squad/player/PlayerCard.tsx`              | Add "Compartir" with `buildPlayerCardSvgString`         |
| `match-insights-mobile/src/app/screens/player-history/PlayerHistoryPage.tsx` + children                    | Add "Compartir" with `buildPlayerHistorySvgString`      |
| `match-insights-mobile/src/app/components/sharing-content/knockouts-image/KnockoutsImage.tsx`              | Return `<NoData />` instead of `null` when `!svgString` |
| `match-insights-mobile/src/app/screens/league-special/league-knockout/LeagueKnockoutPage.tsx`              | Swap tab order: stepper first, bracket second           |
| `match-insights-mobile/src/i18n/*.json`                                                                    | Add `common.share` key                                  |
