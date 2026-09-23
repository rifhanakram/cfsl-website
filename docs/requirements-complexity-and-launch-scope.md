# CFSL Website — Requirements Complexity & Launch Scope

**Date:** 2026-09-23
**Source requirement:** *CFSL Website — Media Commission Recommendations* (PDF, 12 slides)
**Method:** Requirements interview with the project lead. Every launch decision below was confirmed in that interview; sizes marked *proposed* are pending review.

## Ground rules

| Decision | Value |
|---|---|
| Baseline | Greenfield build. The existing `chess-app` (ChessTourneyLK) is **not** reused or linked. |
| Content ownership | CFSL staff (Media Commission) publish content themselves, without a developer. |
| CMS | Off-the-shelf (e.g. WordPress, or a headless CMS such as Strapi, Sanity or Payload). |
| Language | English only. |
| Launch scope | Follows the PDF's Phase 1 (slide 10), narrowed as described in [Launch scope](#launch-scope). |

## Complexity scale

| Size | Criteria |
|---|---|
| **S** | Static content page(s): text, images or PDF links, edited by a developer or as a simple CMS page. No data model, no user input. |
| **M** | CMS-managed repeating content with a simple data model (list + detail pages, categories, filters). Editors publish without a developer. Includes simple forms that only email or store the submission. |
| **L** | Structured relational data, search or workflows (e.g. player database, rankings, online registration with validation, approvals). |
| **XL** | Accounts/auth, payments, third-party integrations or real-time features (e.g. live boards, payment gateway, FIDE sync, personalisation). |

## Launch scope

| # | Item | Size | Why it's in launch | Approach |
|---|---|---|---|---|
| L1 | **Foundation:** mobile-first build and a CMS the Media Commission can use without a developer | L | Decides whether everything else survives. A requirement, not a feature. | Off-the-shelf CMS, mobile-first design system, launch navigation, CFSL-admin editor accounts. |
| L2 | **Tournament event page:** dates, venue, eligibility, prospectus, registration | M | The main reason people visit, and where the "scattered across Facebook, WhatsApp and PDFs" problem hurts most. | One event template in the CMS. |
| L3 | **Tournament registration (built in)** | L | Registration was a Phase 1 item. The existing app will not be used. | See [L3 detail](#l3--tournament-registration). |
| L4 | **Unified calendar: "What's happening in Sri Lankan chess"** (slide 9) | M | Brings people back regularly, and costs little once events are structured content. | Built from the same event entries, tagged by type: tournament, school, deadline, national team, seminar. Completed events stay visible (e.g. a "Past events" filter). |
| L5 | **Results, standings and pairings** | M | People look these up right after every event. | Embed the event's chess-results.com (Swiss-Manager output) page on the event page. No in-house pairing engine. |
| L6 | **News and official announcements** | M | What the Media Commission publishes. Pages with fresh dates build trust. | CMS news content type with one-click social sharing. |
| L7 | **Governance document library** | M | Cheap, high trust, and delivers the "records should not depend on old social-media posts" principle. | Searchable library with dates and categories: Constitution, Regulations & Policies, Official Circulars, Annual Reports, Strategic Plans. Search on title and metadata, with filters by category and year. |
| L8 | **Executive Committee and Commissions** | M | Part of the governance scope. | Structured people list: each member is a CMS entry (name, role, body, photo, term) rendered as cards. |
| L9 | **Forms and downloads centre** | M | Removes friction straight away. | PDFs plus linked online forms (Google Forms or Tally), not custom workflows. Covers club registration/renewal, player registration, and coach/arbiter applications. |
| L10 | **National rankings** | S | High demand. | Link out to FIDE: `https://ratings.fide.com/datasets/federation_set.php?federation=SRI&period=YYYY-MM-01`, with `period` set to the 1st of the current month (e.g. `2026-09-01` in September 2026). |
| L11 | **Homepage** | M | Entry point to the launch content. | Blocks: latest news + important announcements, upcoming events / calendar, latest results + open registration links. |
| L12 | **Placeholder sections** | S | Keeps the full PDF navigation visible from day one. | "Coming soon" pages for Players, Clubs, Education, National Teams, Media. |

### Launch navigation

Home · News · Tournaments · Rankings (external link to FIDE) · Resources · About CFSL, plus placeholder pages for Players · Clubs · Education · National Teams · Media.

### L3 — Tournament registration

| Aspect | Decision |
|---|---|
| Accounts | None. Guest form: registrants fill in player details and submit. |
| Fees | No online payment. The form shows the fee and payment instructions, and an admin marks entries as paid by hand. |
| Rules | Categories (e.g. age or rating), eligibility checks and capacity limits enforced on the form. |
| Entry list | Public list of registered players on the event page. |
| Export | Admin export of entries for Swiss-Manager (CSV/TRF). |
| Management | CFSL admins only. No organiser logins. |
| Notifications | No confirmation email at launch. |

## Deferred requirements

Everything in the PDF that is outside the launch scope, sized using the same scale. **Sizes here are proposed and pending review.**

| Slide | Requirement | PDF phase | Proposed size | Note |
|---|---|---|---|---|
| 02 | Homepage: national player achievements | — | M | Excluded from the launch homepage. |
| 02 | Homepage: social media highlights | 2 (social integration) | M | Embedded feed widget. XL if built against platform APIs. |
| 03 | Tournament archive: photos, reports | — | M | Moved to a later phase. Past events and their results embed stay visible at launch (L4, L5). |
| 03 | Live boards | — | XL | Real-time third-party integration. |
| 04 | Player profiles: national ranking, FIDE link, achievements, national team history | 2 | L | Needs a player database. |
| 04 | Club directory: registered clubs, profiles, key contacts, team history | 2 | M | L once team history links to player and event data. |
| 04 | Records & history: national champions, historical winners, Olympiad teams, milestones | — | M | CMS lists. L if linked to player profiles. |
| 04 | My Chess Profile | 3 (player accounts) | XL | Accounts/auth. |
| 05 | Stories: player features and interviews | 2 (rich storytelling) | S | Extends the L6 news content type with a category. |
| 05 | Galleries: photos and video | 2 | M | |
| 05 | Press releases | — | S | News category. |
| 05 | Press accreditation | — | M | M as a linked external form; L if built in with approvals. |
| 05 | Brand hub: logos and media resources | — | S | Downloads page. |
| 06 | Chess in Education, School Chess, Learn Chess, Coaching, Arbiters, Women in Chess, Youth Development, Differently Abled Chess | 2 | S each | Content pages. Larger if any need interactive features. |
| 06 | Educational videos | 2 | M | Video library (list + detail with categories). |
| 07 | Certificate verification | — | L | Certificate register plus a public lookup. Moved to a later phase. |
| 07 | Newsletter subscription | 2 | M | Embedded email-provider form (e.g. Mailchimp or Brevo). |
| 07 | Built-in club, player and coach/arbiter registration | 3 (online services) | L | Launch covers these with PDFs and linked forms (L9). |
| 07 | Online payments | 3 | XL | Payment gateway. |
| 10 | Advanced databases | 3 | XL | Scope undefined in the PDF. |
| 10 | Analytics | 3 | S–XL | S for standard web analytics, XL for custom reporting. Scope undefined in the PDF. |
| 10 | Personalised experience | 3 | XL | Depends on accounts. |

## Risks

| Risk | Detail |
|---|---|
| chess-results.com framing | Checked on 2026-09-23: chess-results.com sends no `X-Frame-Options` or CSP `frame-ancestors` header, so embedding works today. If they add one, L5 falls back to a link-out. |
| chess-results.com on mobile | Its wide standings and pairings tables may not fit a mobile-first layout inside an iframe. |
| FIDE link format | L10 depends on FIDE keeping the `federation_set.php` URL and its `period` parameter. The URL returns an HTML page ("FIDE DataSets \| Sri Lanka Statistics"), not a data file. |
