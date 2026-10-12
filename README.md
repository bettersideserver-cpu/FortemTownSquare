# FortmenTownsquare

The public site and admin pages contain no registration, enquiry, callback,
hold-request or data-entry forms. Existing admin sessions can still view the
dashboard; login and registration through the site are no longer available.
Supabase records and access controls are unchanged.

Tower A's retail panorama is at `map/IPX/Subpages/Tower-A/360/Typical.html`.
Its jumpbar opens Cosmetic-Hub, Retail Men 1/2, Retail Women 1/2 and Anchor
Restaurant. Add the restaurant panorama as `restaurant.webp` and
`restaurant.jpg` in that page's `images` directory. The existing cosmetic view
is the default until a specific scene is requested in `?room=`.

The second retail tour is at `map/IPX/Subpages/Tower-10-12-copy/360/Typical.html`.
It starts at Apple Store and includes Skincare, Cafe, Pizza Express, South
Indian, Tea, Pan Area and North Indian. Add `pan.webp` and `pan.jpg` to that
page's `images` directory when available. Both tours use `map/IPX/JS/RetailTour.js`.

Run regression checks with `npm test --prefix tests`.
