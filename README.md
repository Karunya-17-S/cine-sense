# CineSense – AI-Powered Semantic Movie and Film Discovery System (Frontend)

A Netflix-style streaming frontend. Pure HTML + CSS + JavaScript, no backend, no build step.

## How to run

**Option 1 – just open it**
Double-click `index.html`. It opens in your browser and works.

**Option 2 – run a local server (recommended for demos)**
```bash
# inside the project folder
npx serve .
# or
python -m http.server 5500
```
Then open http://localhost:5500 (or the URL `serve` prints).

> Fonts (Bebas Neue, DM Sans) load from Google Fonts, so keep internet on for the exact look. Without internet it falls back to system fonts and still works.

## Features

| Netflix feature | What happens in this demo |
|---|---|
| "Who's watching?" profile screen | 4 profiles, incl. a Kids profile that only shows U / 7+ titles |
| Hero banner | Auto-rotates every 9 s, Play / More Info, Top 10 badge, mute toggle, maturity rating |
| Rows | Continue Watching (progress bars), Trending, Top 10 (big numbers), New Releases, Only on CineSense, genre/mood rows, Because You Liked… |
| Hover preview (desktop) | Card expands with Play, My List, Like, Download, More Info |
| Details modal | Description, cast, genres, mood profile, Episodes (series), **More Like This** with % match |
| Play | Opens a player screen, loads, then says the title can't be played yet |
| Download | Progress notification, then "Download complete" + bell notification |
| My List / Like | Works and is remembered in the browser (localStorage) |
| Notifications bell | Badge count, new arrivals, download and reminder events |
| New & Popular | Coming Soon list with **Remind Me** |
| TV Shows / Movies / My List / Browse by Languages | Separate pages |
| Search | Searches titles, cast, genres **and meaning** (e.g. "funny family film", "noir detective") |
| **Mood AI** (red button, bottom right) | Ask "I'm stressed", "sad movies", "uplifting sci-fi with strong female leads", "thrillers like classic noir", "not scary but thrilling", "Tamil feel-good films" |

## How the "AI" works (for your viva / report)

All in the `SEMANTIC / MOOD ENGINE` section of the script:

1. **Interpretation (NLP layer)** – `interpret(text)` maps the user's words to concepts using a lexicon of synonyms: 12 moods, genres, themes (e.g. *strong female lead*, *noir*), languages and content type. It understands feelings ("stressed" → chill / feel-good) and negation ("not scary").
2. **Shared semantic space** – every movie is described by the same concept dimensions (moods, genres, tags, language), so the query and the films can be compared directly.
3. **Scoring / ranking** – `score(movie, query)` weights mood matches (3), genre and theme matches (2.5), language (4) and word overlap with title/plot/cast (1), and penalises avoided moods.
4. **Similarity-based exploration** – `similarity(a, b)` is a weighted Jaccard similarity over mood + genre + theme sets; it powers "More Like This" and "Because You Liked…".

In the full system this layer is replaced by a backend that creates sentence embeddings (e.g. Sentence-BERT) of plot summaries and reviews and ranks by cosine similarity. The frontend already calls one function (`semanticSearch`), so only that function needs to change to call the API.

## Project structure

```
cinesense/
├── index.html   ← whole app (HTML + CSS + JS), sections clearly commented
└── README.md
```

Inside `index.html` the script is split into: DATA, STATE, ICONS, GENERATED ARTWORK, CARDS & ROWS, HERO, PAGES, SEMANTIC / MOOD ENGINE, SEARCH, HOVER PREVIEW, MODAL, PLAYER, TOASTS & NOTIFICATIONS, ACTIONS, NAV, PROFILES, MOOD AI, BOOT.

## Customising

- **Add or edit movies**: the `CATALOG` array. Each entry: title, year, type, language, genres, moods, themes, rating, duration, poster style, colours, description, cast.
- **Poster style**: `motif` is one of `sun, orbit, city, waves, forest, portrait, grid, rain`; `pal` is two colours. Posters are drawn in code, so there are no image files and no copyright issues.
- **Use real images later**: replace `art(m, kind)` with an image URL (e.g. `m.poster`).
- **Brand colour**: `--red` in the `:root` CSS block.

All titles, cast and artwork are fictional sample data.
