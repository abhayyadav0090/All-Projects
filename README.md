# All Projects

A single page that shows everything I have built, each with a live preview you can try before opening it.

**Live site:** https://abhayyadav0090.github.io/All-Projects/

![All Projects preview](https://github.com/abhayyadav0090/portfolio2/PNGs/All-Projects.png)

Built by [Abhay Yadav](https://github.com/abhayyadav0090), B.Tech IT student at Rajkiya Engineering College, Bijnor.

---

## What is inside

| # | Project | What it is | Stack | Live | Code |
|---|---------|-----------|-------|------|------|
| 1 | **Jan Samadhan** | Civic-tech platform where citizens report, categorise and track municipal issues, with AI triage by the Gemini API. Built for Smart India Hackathon 2026. | React, Node.js, Express, MongoDB, Tailwind CSS, Gemini API | [Open](https://jana-samadhan.vercel.app/) | Private repo |
| 2 | **NexOS** | Productivity workspace with a Kanban board, focus timer, habit tracker, notes and analytics, plus NexAI, a Gemini-powered assistant. Google sign-in, data saved per user in MongoDB. | HTML, CSS, JavaScript, Node.js, Express, MongoDB, Gemini API | [Open](https://ai-aqit.onrender.com/) | [AI](https://github.com/abhayyadav0090/AI) |
| 3 | **Damodar Vows** | 30-day Kartik Sadhana tracker for daily vows, japa rounds and reflection, with Google sign-in, per-vow reminders and progress analytics. | JavaScript, Node.js, Express, MongoDB | [Open](https://kartik-maas.onrender.com/) | [kartik-maas](https://github.com/abhayyadav0090/kartik-maas) |
| 4 | **Simple Portfolio** | Personal developer portfolio with skills, education and selected builds. | HTML, CSS | [Open](https://abhayyadav0090.github.io/portfolio2/) | [portfolio2](https://github.com/abhayyadav0090/portfolio2) |
| 5 | **MERN Practice** | Full-stack coursework, DOM labs and deployments from my MERN course. | HTML, CSS, JavaScript | [Open](https://abhayyadav0090.github.io/MERN-Practice/) | [MERN-Practice](https://github.com/abhayyadav0090/MERN-Practice) |
| 6 | **Daily Routine** | Daily schedule page with colour-coded time blocks, built during the LetsUpgrade bootcamp. | HTML, CSS | [Open](https://abhayyadav0090.github.io/daily-routine-webpage/) | [daily-routine-webpage](https://github.com/abhayyadav0090/daily-routine-webpage) |
| 7 | **Nutri-Flex** | Mobile-first nutrition guide with clear macro-nutrient layout. | HTML, CSS | [Open](https://abhayyadav0090.github.io/Nutri-Flex/) | [Nutri-Flex](https://github.com/abhayyadav0090/Nutri-Flex) |
| 8 | **Aurora** | Landing page focused on typography, hero layout and modern CSS. | HTML, CSS | [Open](https://abhayyadav0090.github.io/Aurora/) | [Aurora](https://github.com/abhayyadav0090/Aurora) |
| 9 | **AmulSpray** | Product showcase page with specification sections and responsive cards. | HTML, CSS | [Open](https://abhayyadav0090.github.io/AmulSpray/) | [AmulSpray](https://github.com/abhayyadav0090/AmulSpray) |

---

## Features

- **Two kinds of preview.** Jan Samadhan and the four static sites (Daily Routine, Nutri-Flex, Aurora, AmulSpray) load as live frames, scaled down to fit their card. NexOS, Damodar Vows, Simple Portfolio and MERN Practice use screenshots.
- **Interact mode.** Live previews start locked so the page scrolls normally. Press **Interact** to unlock one and click inside it. Only one preview is unlocked at a time, and `Esc` locks it again.
- **Filter and search.** Filter by category (Full-Stack & JS, Frontend UI, Live Iframe) or type a technology or title. Click any stack tag on a card to filter by it.
- **Directory with scroll-spy.** The left-hand list highlights the project you are looking at, and clicking an entry jumps to it. On phones it becomes a horizontal bar.
- **Light and dark themes.** Follows your device by default, and your choice is remembered in the browser.
- **Copy link.** Each card has a button that copies the project's live URL.
- **Keyboard shortcuts.** `/` focuses the search box, `T` switches theme, `Esc` locks previews and leaves the search box.
- **Accessible and responsive.** Skip link, labelled controls, visible focus styles, and a layout that works from phone to desktop.

---

## Tech

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies. Fonts (Bricolage Grotesque, Figtree, JetBrains Mono) come from Google Fonts.

```
.
├── index.html   # Page structure and all project cards
├── style.css    # Layout, themes and components
└── script.js    # Preview scaling, filters, search, scroll-spy, theme, shortcuts
```

---

## Run it locally

```bash
git clone https://github.com/abhayyadav0090/All-Projects.git
cd All-Projects
python3 -m http.server 8000
```

Then open http://localhost:8000. An internet connection is needed, because the previews load the live projects.

---

## Deploy

The site is served by GitHub Pages from the `main` branch. Push a change to `main` and it redeploys in a minute or two.

---

## Add a project

1. In `index.html`, copy an existing card (an `<article class="project">` block) and change its `id`, title, description, links and stack tags.
2. Set `data-category` to any of `fullstack`, `frontend` and `sandbox`, and add search words to `data-tags`.
3. Add a matching entry to the directory list (`#nav-list`) with the same `id`.
4. Update the numbers that are written by hand: **Active Builds**, **Live Sandboxes** and the count badges on the filter buttons.
5. If the project's site refuses to be shown inside a frame (the browser says "refused to connect"), use a screenshot card instead: a screenshot in place of the frame, and a `Snapshot` badge in the browser bar.

---

## Notes

- Projects hosted on Render's free plan sleep when idle, so the first visit can take up to a minute.
- Screenshot previews, including the one at the top of this page, are loaded from the `PNGs` folder of the [portfolio2](https://github.com/abhayyadav0090/portfolio2) site.

---

## Contact

[GitHub](https://github.com/abhayyadav0090) · [Portfolio](https://abhayyadav0090.github.io/portfolio2/) · [LinkedIn](https://www.linkedin.com/in/abhay-yadav-6923742b5/) · [X](https://x.com/abhayyadav19955)
