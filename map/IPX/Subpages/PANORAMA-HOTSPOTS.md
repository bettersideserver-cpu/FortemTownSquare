# Edit the 360 buttons

Each tower/floor's `360/tour.js` contains its own `balconyHotspots` settings.
Each scene has an array of buttons, so positions and destinations are independent.

- `x`, `y`, `z`: position inside the panorama; current positions are placeholders.
- `target`: another scene ID from that file's `scenes` list.
- `href`: a page URL instead of a scene. Replace the `#360-...` placeholder with your URL; placeholder buttons stay in the current view.
- `label`: hover text.

For a URL button, remove `target` and use `href`. For an internal scene button, remove `href` and use `target`.

Balcony names stay out of the bottom bar. The `shopRoom` mapping selects the corresponding shop name when a balcony opens.

Connected balcony views: Tower A ground/first, Tower B ground/first, and Tower C ground.
Tower A second, Tower B second, and Tower C first/second currently have no balcony images, so their interior buttons have editable placeholder URLs.

The following interior images are still missing: Tower B ground `sunglass`, Tower B first `home`, Tower C ground `bakery`. Their balcony images and connections are retained for when the interiors are uploaded.

Tower B first floor balconies 17 and 18 currently share `western_2`, the available third western-wear interior. Adjust their targets and the `shopRoom` mapping if they should use separate interiors.
