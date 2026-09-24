# CFSL Website — Launch Features & Admin Guide

**Site:** https://cfsl-website.vercel.app
**Admin panel:** https://cfsl-website.vercel.app/admin

This guide covers what is on the website at launch and how the CFSL team keeps it up to date. No developer is needed for any task in this guide.

---

## Part 1 — What's available at launch

### Public website

| Section | Address | What visitors see |
|---|---|---|
| **Home** | `/` | Official announcements, events with open registration, upcoming events, latest results, latest news, and quick links to rankings, documents and forms. |
| **News** | `/news` | All news and announcements, newest first, filterable by category. Each article has a share bar (Facebook, WhatsApp, X, and the phone's own share menu). |
| **Tournaments** | `/events` | The calendar, *"What's happening in Sri Lankan chess"*: tournaments, school chess, deadlines, national team events and seminars. Filter by type, and switch between **Upcoming** and **Past events**. |
| **Event page** | `/events/<name>` | Dates, venue, description, eligibility, prospectus download, the registration form, the public entry list, and results from chess-results.com. |
| **Rankings** | `/rankings` | Opens the current month's FIDE rating list for Sri Lanka. The link updates itself each month. |
| **Resources** | `/resources` | Links to the document library, the forms centre and rankings. |
| **Governance documents** | `/resources/documents` | Searchable library of the Constitution, Regulations & Policies, Official Circulars, Annual Reports and Strategic Plans. Filter by category and year. |
| **Forms & downloads** | `/resources/downloads` | Forms for clubs, players, coaches and arbiters, as PDFs or links to online forms (Google Forms, Tally). |
| **About CFSL** | `/about` | Executive Committee and Commission members. |
| **Coming soon** | `/players`, `/clubs`, `/education`, `/national-teams`, `/media` | Placeholder pages that keep the full menu visible. They appear under **More** in the menu. |

The site is designed for phones first and works on all screen sizes.

### Tournament registration

- Players (or parents) register as guests. No account is needed.
- Each event sets its own registration window, fee, payment instructions, sections and form fields.
- The form checks age and rating limits for each section, blocks a second entry with the same FIDE ID, and closes a section when it's full.
- Parent or guardian details are required automatically for players under 18.
- A spam check (Cloudflare Turnstile) protects the form.
- The event page shows a public entry list.
- Admins mark entries as paid and export them as **CSV** (Excel) or **TRF** (Swiss-Manager).

### Not included at launch

These items are planned for later phases:

- Photo and video galleries, press releases, press accreditation and a brand hub. The `/media` page shows "Coming soon" until then.
- Player profiles, a club directory, and records and history.
- Tournament archive with photos and reports. Past events and their results stay visible.
- Live boards.
- Online payments. Players pay outside the site and an admin marks the entry as paid.
- Emails of any kind. There are no registration confirmation emails and no "forgot password" emails.
- Player accounts ("My Chess Profile"), a newsletter and certificate verification.
- Online club, player, coach and arbiter registration. At launch these use PDFs or linked forms in **Forms & downloads**.

---

## Part 2 — Admin guide

### 2.1 Logging in and roles

Log in at **/admin** with your email and password.

| Role | Can do |
|---|---|
| **Editor** | Create, edit and publish all website content: news, events, pages, documents, forms, people, media, homepage and menu. Editors **cannot** see registrations or manage users. |
| **Admin** | Everything an editor can do, plus **Registrations** (entries, paid status, export) and **Users**. |

**Passwords:** the site sends no email, so there is no "forgot password" link.

- To change your own password, open your account (top-right avatar), then **Change password**.
- If someone is locked out, an **admin** opens **Users**, selects the person, sets a new password and saves.
- **Always keep at least two admin accounts.**

**Adding a team member** (admins only): go to **Users → Create New**, then enter their email, name, role and a starting password, and save. Send them the password securely and ask them to change it.

### 2.2 How publishing works

- **Changes go live immediately.** There is no deployment step and no waiting. Refresh the page and your change is there.
- **News, Events and Pages have drafts.**
  - **Save Draft** keeps your work private.
  - **Publish** makes it public.
  - To take something down temporarily, choose **Unpublish**.
- **Everything else is live on Save:** Governance documents, Forms & downloads, People, Media, Files, Homepage and Navigation.
- **Web addresses (slugs)** are created from the title automatically, e.g. *"National Youth Championship 2026"* becomes `/events/national-youth-championship-2026`. You can edit the slug in the sidebar, but avoid changing it after sharing a link, because the old link will stop working.
- **Time zone:** date and time pickers use your computer's time zone. Make sure your computer is set to Sri Lanka time. The website always shows Sri Lanka time.

### 2.3 Where each kind of file goes

| Upload to | Use for | Accepted files |
|---|---|---|
| **Media** | Images only: news hero images and people photos. Always fill in **Alt**, a short description of the image for screen readers. | Images (JPG, PNG, WebP). Don't upload PDFs here. |
| **Files** | Tournament prospectuses and downloadable forms. You usually upload these directly from the event or form you're editing. | PDF, Word, Excel |
| **Governance documents** | Official governance records (see 2.8). | PDF |

Uploading to Media does not put an image anywhere on the site by itself. An image appears only when a news item or person uses it.

### 2.4 News and announcements

1. Go to **News → Create New**.
2. Fill in:
   - **Title**
   - **Hero image** (optional): choose or upload an image. A wide landscape image works best.
   - **Excerpt**: one or two sentences, up to 300 characters. It appears in news lists and in the preview when the link is shared on Facebook or WhatsApp. Always fill it in.
   - **Body**: the article. Use headings, lists and links from the toolbar.
3. In the sidebar:
   - **Published At**: the date shown on the article. It defaults to now, and news is sorted by this date.
   - **Category**: General, Tournaments, National Teams, Education or Governance.
   - **Official announcement**: tick it for official notices. It adds an *Announcement* badge, and the homepage lists the latest three announcements.
4. Click **Publish**.

### 2.5 The homepage

Most of the homepage fills itself in from the newest news and events. Open **Homepage** (under Globals) to adjust it:

| Field | Effect |
|---|---|
| **Tagline** | The sentence under the main heading. |
| **Pinned announcements** | Up to 3 news items shown in the announcements box. If empty, the latest 3 **Official announcements** are shown instead. |
| **Featured events** | Up to 3 events listed first under "What's happening". Only upcoming events are shown, so a featured event drops off once it's over. |

These homepage sections fill in automatically:

- **Registration open:** events whose registration window is open right now.
- **Latest results:** events that have started and have a chess-results.com link.
- **Latest news:** the 6 newest articles.

The homepage also refreshes itself every few minutes, so registrations that open or close on schedule appear without any edit.

### 2.6 Events and the calendar

Every item in the calendar is an event: tournaments, school chess, deadlines (e.g. *"Club renewal deadline"*), national team events and seminars.

1. Go to **Events → Create New**.
2. Fill in the main fields:
   - **Title**, and **Type** (in the sidebar).
   - **Start Date**, and **End Date** for multi-day events. Leave the end date empty for a one-day event or a deadline.
   - **Venue**.
   - **Summary**: one or two sentences shown in the calendar.
3. **Details** tab:
   - **Description**: the full event information.
   - **Eligibility**: who can play, shown in its own section.
   - **Prospectus**: upload the PDF. It appears as a *Prospectus* button on the event page.
4. **Results** tab: see 2.7.
5. **Registration** tab: see 2.9.
6. Click **Publish**.

An event moves to **Past events** automatically the day after it ends.

### 2.7 Results, standings and pairings (chess-results.com)

1. Open the tournament on chess-results.com and copy the address from the browser, e.g. `https://chess-results.com/tnr123456.aspx?lan=1`.
2. Paste it into the event's **Results → chess-results.com URL** and save.

The event page then shows the chess-results.com page embedded, with an **Open on chess-results.com** button, which is easier to use on phones. The homepage lists it under **Latest results** once the event has started. Only `https://chess-results.com` addresses are accepted.

### 2.8 Governance documents

1. Go to **Governance documents → Create New**.
2. Upload the **PDF**.
3. Fill in:
   - **Title**.
   - **Category**: Constitution, Regulations & Policies, Official Circulars, Annual Reports or Strategic Plans.
   - **Document Date**: the date printed on the document, not today's date. It controls the order and the **Year** filter.
   - **Description** (optional).
4. Save. The document is public immediately.

Visitors search by title and description, so a good description helps. For example, give a circular a description that says what it's about. To replace a document with a new version, edit it and upload the new file.

### 2.9 Setting up tournament registration

Open the event's **Registration** tab.

#### Step 1: Turn it on and set the window

- Tick **Accept registrations on this site**.
- **Opens At** / **Closes At**: the form accepts entries only between these times. Leave **Opens At** empty to open straight away. Always set **Closes At**.

#### Step 2: Fee and eligibility rules

- **Fee**: e.g. `LKR 2,500`.
- **Payment Instructions**: bank details and the reference players should use. They're shown on the form.
- **Age Reference Date**: the date on which age is measured for "Under N" sections.
  - *1 January of the event year* (default). A U12 player must be under 12 on 1 January.
  - *31 December of the event year*. A U12 player must be under 12 on 31 December.
- **Sections**: add one row per section. **Registration won't open until the event has at least one section.**

  | Field | Meaning |
  |---|---|
  | **Name** | e.g. `U12 Girls`, `Open`. |
  | **Under (age)** | e.g. `12` means under 12 on the age reference date. Leave empty for no age limit. |
  | **Min Rating / Max Rating** | Optional rating limits. |
  | **Capacity** | Maximum number of entries. When it's reached, the section shows **Full** and can't be chosen. |

#### Step 3: Choose the form fields

For each field, choose **Required**, **Optional** or **Hidden**:

- Date of birth
- Sex
- Email
- Phone / WhatsApp
- School or club
- Coach
- Rating

Some fields behave the same for every event:

- **Last name** and **Other names** are always required.
- **FIDE ID** is always shown and optional, because first-time players don't have one.
- **Parent/guardian name and contact** appear, and become required, when the date of birth shows the player is **under 18 on the event's start date**.
- If any section has an age limit, **date of birth** becomes required. If any section has a rating limit, **rating** becomes required.
- Collect **Sex** if you'll use the TRF export, because Swiss-Manager uses it.

Click **Publish**. The event page now shows the registration details, the form (while the window is open) and the entry list.

#### Changing things after entries arrive

- **To reopen a full section**, increase its **Capacity**.
- **Do not rename or delete a section** once people have entered it. Existing entries would drop off the public list and out of the section export. Create a new section instead.
- **To extend the deadline**, change **Closes At**.

### 2.10 Managing registrations (admins only)

Open **Registrations** in the sidebar. Each entry shows the player, event, section, FIDE ID, rating, paid status and submission time.

**Finding entries**
- The **search box** looks up name, FIDE ID, email or phone.
- **Filters** narrow the list, e.g. Event is *National Youth Championship 2026*, or Paid is *false*.

**Marking one entry as paid:** open the entry, tick **Paid** (in the sidebar) and save. **Paid At** and **Paid By** are filled in automatically.

**Marking many entries as paid**
1. Tick the checkboxes next to the entries.
2. Click **Edit** at the top of the list.
3. Choose the **Paid** field, tick it, and save.

**Withdrawals:** delete the entry. Its place in the section is freed immediately.

**Checking eligibility:** players enter their own date of birth and rating. Before pairing, check them against the FIDE profile. On the public entry list, each FIDE ID links to the player's FIDE profile.

**Exporting entries.** The export box sits above the list.
1. Under **Export entries for**, choose the event.
2. Optionally choose a **Section**. Export one section at a time when each section is its own tournament in Swiss-Manager.
3. Download:
   - **CSV**: every collected field, including contact and guardian details and paid status. It opens in Excel.
   - **TRF**: a FIDE TRF-16 file for importing into Swiss-Manager.
     - Players are ordered by rating (highest first), then name.
     - Federation is set to **SRI** for everyone, so correct it for foreign players in Swiss-Manager.
     - Titles are left blank. Swiss-Manager fills in titles and current ratings from the FIDE list using the FIDE ID.

**Privacy**
- The public entry list shows only **name, FIDE ID, rating, school/club and section**.
- Date of birth, phone, email, coach and guardian details are visible only to admins in this panel and in the CSV export.
- Handle exported files carefully, because they contain children's personal details.
- Entries are kept indefinitely.

### 2.11 Forms & downloads

1. Go to **Forms & downloads → Create New**.
2. Fill in **Title**, **Category** (Clubs, Players, Coaches & arbiters, Other) and **Description** (optional).
3. Choose the **Kind**:
   - **File (PDF)**: upload the form.
   - **Online form**: paste the Google Forms or Tally link. It must start with `https://`.
4. **Order** (sidebar): lower numbers are listed first within a category.
5. Save.

### 2.12 Executive Committee and Commissions

1. Go to **People → Create New**.
2. Fill in:
   - **Name**, and **Role** (e.g. *President*, *Chairperson*, *Member*).
   - **Body**: Executive Committee or Commission.
   - **Commission**: the commission's name, e.g. *Media Commission*. Type it **exactly the same way** for every member so they're grouped together.
   - **Photo** (optional): a square head-and-shoulders photo works best.
   - **Term Start / Term End** (optional). A member is hidden automatically the day after their term ends, so you don't need to delete past members.
   - **Order** (sidebar): lower numbers are listed first, e.g. President = 1.
3. Save.

### 2.13 Pages

Use **Pages** for standalone content.

| Slug | What it does |
|---|---|
| `about` | Adds introduction text at the top of **About CFSL**. |
| `resources` | Adds introduction text at the top of **Resources**. |
| `players`, `clubs`, `education`, `national-teams`, `media` | Replaces the default "Coming soon" page for that menu item. Keep **Coming soon** ticked to show the notice above your text, or untick it once the section is real. |
| Anything else | Creates a new page at `/<slug>`. It won't appear in the menu unless you add it (see 2.14). |

Pages have drafts, so click **Publish** to make one live.

### 2.14 Main menu

**Navigation** (under Globals) controls the main menu. **Leave it empty** to use the standard launch menu: Home, News, Tournaments, Rankings, Resources, About CFSL.

If you add items, they **replace** the whole main menu, so include every item you want. Each item has:

- **Label**
- **Href**: a site path such as `/news`, or a full `https://` address. Rankings and full addresses open in a new tab.

The **More** menu (Players, Clubs, Education, National Teams, Media) and the footer are fixed.

### 2.15 Quick reference

| I want to… | Go to |
|---|---|
| Post news or an announcement | News → Create New → Publish |
| Pin an announcement on the homepage | Homepage → Pinned announcements |
| Add a tournament to the calendar | Events → Create New → Publish |
| Open registration for a tournament | Event → Registration tab → tick *Accept registrations*, add sections → Publish |
| Show results | Event → Results tab → paste the chess-results.com link |
| Mark entries as paid | Registrations → select → Edit → Paid |
| Export for Swiss-Manager | Registrations → choose event and section → Download TRF |
| Publish a circular or policy | Governance documents → Create New |
| Add a downloadable form | Forms & downloads → Create New |
| Update the committee | People |
| Reset someone's password | Users (admins only) |

---

## Before public launch (technical team)

- Replace the Cloudflare Turnstile **test keys** with real keys. Until then, the spam check accepts everyone.
- Move Vercel hosting from the Hobby plan to **Pro**, because Hobby's terms don't cover organisational sites.
- Optional: connect a custom domain, and add an email provider for password resets and confirmation emails.
