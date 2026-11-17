# Vietnam 2027 — places map

One-page interactive map of the best places in Vietnam: Ho Chi Minh City & around, Da Nang / Hoi An / Hue, Hanoi / Ha Long / Ninh Binh.

**Live:** https://ybelilov.github.io/

- Categories, region tabs, rating / price filters, search
- 🔥 Must-see · 💎 Hidden gems · 📸 Social-media hype · ⭐ Favourites (saved in your browser)
- Ukrainian (default) / English
- Every place: photos, description, tip, "Open in Google Maps", directions, Vietnamese name for drivers

Plain static site (Leaflet + OpenStreetMap), no build step. Photos are hot-linked from Wikimedia Commons and other public sources — nothing is stored in the repo.

## Files
- `index.html`, `style.css`, `app.js` — the app
- `places.js` — the data (`window.PLACES = [...]`)

## Adding a place
Append an object to `places.js` with: `id, region (hcmc|central|hanoi), area, category, name, nameVi, lat, lng, address, rating, googleRating, price (0–4), mustSee, hiddenGem, viral, hype, desc {uk,en}, tip {uk,en}, hours, website, images []`.

Categories: `sights, temples, museums, nature, beaches, streetfood, restaurants, cafes, bars, markets, experiences`.
