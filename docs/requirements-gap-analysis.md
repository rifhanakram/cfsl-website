# CFSL Website — Requirements Gap Analysis

**Date:** 2026-09-23
**Source requirement:** *CFSL Website — Media Commission Recommendations* (PDF)
**Compared against:** `chess-app` repo (ChessTourneyLK — Vue 3 + Node/Express + Postgres)

## Summary

| Scope | Coverage |
|---|---|
| Full website vision | ~15–20% |
| Phase 1 (Essential) | ~35–40% |

`chess-app` is a tournament registration tool for organisers and parents. The PDF asks for the federation's official public website, with news, rankings, clubs, education and governance content. The two overlap only in the tournament area.

## Coverage by requirement area

| # | PDF area | Coverage | Notes |
|---|---|---|---|
| 02 | Site structure (11 menu sections) | ~2 of 11 | Home and Tournaments exist; the Home page advertises the product rather than serving as a federation homepage. Players is partial and only visible to logged-in parents. News, Rankings, Clubs, Education, National Teams, Media, Resources and About are missing. |
| 02 | Homepage at a glance (7 blocks) | ~1 of 7 | Upcoming tournaments appear only on `/tournaments`, not on the homepage. No news, results, announcements, achievements, quick links or social highlights. |
| 03 | Tournament hub | ~50% | **Event page ✅** dates, venue, district, age categories, fees, rules, flyer, deadline. **Register ✅** online entry, organiser registration management, payment status, Swiss Manager export (TRF/CSV). **Follow ❌** no pairings, results or live boards. **Archive ❌** no photos, standings or reports. A per-tournament announcement channel exists. |
| 04 | Players, clubs, rankings | ~10% | Player profiles are private, parent-owned records with a rating history chart. No public profiles, national ranking, FIDE link, achievements, team history, club directory or records/history. |
| 05 | Media and news centre | ~0% | Only per-tournament channel posts. No news, stories, galleries, press releases, brand hub or social sharing. |
| 06 | Education and development | 0% | Not implemented. |
| 07 | Digital services (8 items) | ~1.5 of 8 | Tournament registration ✅. Player registration is partial (parents create child profiles). Payments are free-text instructions plus a manual paid/pending status set by the organiser, with no payment gateway. No club, coach or arbiter registration, forms centre, certificate verification or newsletter. |
| 08 | Governance and transparency | 0% | No constitution, policies, committees, circulars, reports or document archive. |
| 09 | "What's Happening" feed | ~15% | Tournament list only, filterable by date, district and age category. No schools, deadlines, national team or seminar events. |

## Phase 1 (Essential) checklist

| Item | Status |
|---|---|
| Tournament hub | Partial: event page and registration exist, results and archive don't |
| News and announcements | ❌ (per-tournament channel only) |
| Results and calendar | Calendar partial (tournament list); results ❌ |
| Registrations | ✅ |
| Documents | ❌ |
| Mobile-first design | Partial: responsive layout (Tailwind), not designed mobile-first |

## Reusable from `chess-app`

- **Accounts:** JWT sign-in, multiple roles per user (admin, organiser, parent), email verification
- **Tournaments:** creation, status lifecycle (draft → completed), flyer upload
- **Registration:** capacity limits per age category, payment status tracking
- **Swiss Manager export:** TRF and CSV files
- **Reviews:** tournament and organiser reviews with organiser responses
- **Notifications:** in-app notifications with user preferences
- **Admin dashboard:** user management and platform stats

## Key gaps

1. **No content management.** News, pages, documents, galleries and press all need an editor workflow with publishing. This is the largest missing piece.
2. **No public player data.** Everything player-related is behind a parent login. Public profiles, rankings, clubs, champions and Olympiad records all need new tables.
3. **The tournament hub stops before games start.** No pairings, round results, standings or archive. Importing these from Swiss Manager may be simpler than building a pairing engine.
4. **Missing basics.** No site-wide search, social sharing or newsletter. Password reset isn't implemented; the "Forgot Password?" link on the login page points nowhere.

## Suggested path to Phase 1

1. Add content management (a headless CMS, or custom news/document tables).
2. Add results and standings to tournament pages.
3. Replace the landing page with the federation homepage described in the PDF.
