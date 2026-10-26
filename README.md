# Deep Mapping of Micro Water Bodies

An interactive 3D deep map of the historical, cultural, literary and environmental memories of India's micro water bodies.
Department of Humanities and Social Sciences, IIT (ISM) Dhanbad.

`data.js` is the project's original data file and is unchanged.

## Publish on GitHub Pages

All 86 files sit at the top level, with no folders, so the whole site uploads in one go.

1. Open the repository on github.com and click **Add file → Upload files**.
2. Select all 86 files (Ctrl+A or Cmd+A) and drag them in. Files with the same name are replaced.
3. Click **Commit changes**. In **Settings → Pages**, the source should be **Deploy from a branch**, `main`, `/ (root)`.
4. After a minute or two the site is live, for example at `https://simantadh.github.io/DHBH/`.

There is no build step, no server and no API key. `404.html` is shown for broken links automatically.

## Pages

| Menu | Page | File |
|---|---|---|
| Home | Animated home page with a welcome pop-up | `index.html` |
| Project & About | About the Project | `about.html` |
| | Our Team | `team.html` |
| Explore | Jal Yatra — browse every water body | `explore.html` |
| | Lexicon | `lexicon.html` |
| (from Home and Jal Yatra) | The 3D deep map | `map.html` (`?state=Bihar`, `?wb=39` and `?tour=1` open a state, a water body or the guided tour) |
| Governance & Contact | Licensing & Credits | `licensing.html` |
| | FAQ | `faq.html` |
| | Cite This Project | `cite.html` |
| | Contact | `contact.html` |

`state.html` only forwards old links to the map.

## Files

```
index.html … contact.html   pages
style.css, site.css         design and layout
data.js                     the water body data (unchanged from the original project)
prefs.js                    applies text size / theme / contrast before the page draws
site.js                     header, footer, welcome pop-up, accessibility, languages, sound switch
icons.js                    every icon, the fish narrators and the illustrations (SVG drawn in code)
sound.js                    the six soundscapes, synthesised in the browser
app.js                      the 3D map
photos.js                   which photograph belongs to which water body (by id)
records.js                  reads data.js for the content pages
home.js, about.js, explore.js, cite.js, faq.js, lexicon.js   page scripts
geo-india.js                India state boundaries
basemaps.js                 the two hand-tinted vector map styles
*.webp                      water body photographs (named after the place) and team portraits
thumbs.webp                 all card thumbnails in one image sheet
logo.svg                    favicon
```

## Common edits

- **Add or change a photograph:** upload a WebP or JPG to the repository, then add a line to `photos.js`, for example `"38": { "src": "bindu-sarovar.webp" }`. Optional: `"pos": "center 70%"` moves the crop and `"note": "…"` adds a caption. A new photo appears on the map and home page straight away; on the Jal Yatra cards the drawn illustration stays until the thumbnail sheet is regenerated.
- **Add a water body:** add a row to `data.js`, using the same columns. The map, list, Jal Yatra page, home counts and citation menu update automatically.
- **Edit a team bio:** edit `team.html` directly. Portraits are 480 × 480 WebP files (`shanmugapriya.webp`, `simran.webp`, `simanta.webp`, `aditya.webp`).
- **Edit the lexicon:** edit the `LEXICON` list in `lexicon.js`.
- **Change the contact email:** search all files for `shanmugapriya@iitism.ac.in`.
- **Fish narrators:** the mahseer, rohu, hilsa and magur are drawn in `icons.js` (`FISH`), with their names in `FISH_NAME`.

Pages share one header, footer and set of tools from `site.js`, so a menu change there applies everywhere.

## Languages

Google retired its embeddable Website Translator widget on 1 October 2026, so the language button uses Google Translate's full-page translation instead. Choosing Hindi, Bengali, Gujarati, Odia, Tamil, Bhojpuri, Maithili (Bihar) or Santali (Jharkhand) reopens the current page through `translate.goog`. Every link followed there stays in that language, and choosing English returns to the original page.

This works only on the public website. Google cannot read a private preview or a file opened from your computer, and in those cases the language panel says so. Names of water bodies and words in Indian scripts are marked so Google leaves them untranslated.

## Accessibility

Every page has: text size from 90% to 140%; light, dark or automatic appearance; high contrast; reduced motion; a readable-font option (Atkinson Hyperlegible); underlined links; full keyboard navigation with a "skip to content" link; and alt text on images. Preferences are saved in the visitor's browser.

## Size

The whole site is about 4 MB. A first visit to the home page transfers roughly 300 KB plus fonts, and photographs load only when they come into view. Soundscapes are generated in code, so there are no audio files.

## Credits and licence

Text and data: CC BY-NC 4.0. Full credits for maps, photographs, fonts and the synthesised soundscapes are on `licensing.html`.
© 2026 Deep Mapping of Micro Water Bodies. All rights reserved.
