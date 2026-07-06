Superior Electric Machines Website
==================================

Official static website for Superior Electric Machines Pvt. Ltd. (SEM), built
for product discovery, industrial applications, catalogue downloads, distributor
information, and sales enquiries.

Live Site
---------
https://www.superiorelectric.in/

Local Preview
-------------
This site uses clean URLs such as /products/ and /applications/. For local
preview, run it through a small web server instead of opening index.html
directly.

From the project folder:

python3 -m http.server 8000

Then open:

http://localhost:8000/

Main Pages
----------
index.html             Homepage
about/index.html       About SEM
products/index.html    Product catalogue
applications/index.html
downloads/index.html
distributors/index.html
contact/index.html

The older .html pages are kept as fallbacks for compatibility.

Project Structure
-----------------
css/style.css          Site styling
js/main.js             Navigation, modals, filters, animations, interactions
js/nav.js              Shared header, mobile menu, and cart badge behavior
js/products.js         Product data and specifications
scripts/sync-routes.js Copies root .html pages to clean URL /index.html files
scripts/smoke-mobile.js Dependency-free mobile nav/cart smoke checks
scripts/check-deploy.js Runs route sync, syntax checks, smoke checks, and
                       deployment sanity checks
images/                Logo, product photos, application images
assets/videos/         Homepage and application videos
assets/videos/optimized/
                       Web-optimized MP4 files used by the live pages
assets/posters/        Lightweight video poster frames
assets/downloads/      PDF catalogues and downloads
sitemap.xml            Search engine sitemap
robots.txt             Search crawler instructions
404.html               Branded not-found page

Updating Content
----------------
Products:
Edit js/products.js to update product names, specifications, images, categories,
and application tags.

Videos:
Add MP4 files to assets/videos/ and reference them from index.html.

Downloads:
Add PDF files to assets/downloads/ and update downloads/index.html.

Clean URL copies:
Edit the root fallback page first, for example products.html, then run:

node scripts/sync-routes.js

This copies the root pages into about/index.html, products/index.html,
applications/index.html, downloads/index.html, distributors/index.html, and
contact/index.html so both URL styles stay in sync.

Pre-deploy checks:
Run this before publishing changes:

node scripts/check-deploy.js

For a quicker mobile nav/cart structural check only:

node scripts/smoke-mobile.js

Contact Details
---------------
Phone: +91 8028361383, +91 8028361742, +91 9448283841
Email: info@superiorelectric.in
Address: B-214, 5th Main Road, Peenya Industrial Area Phase IV,
Bengaluru 560058, Karnataka, India

Deployment Notes
----------------
When deploying to GitHub Pages, commit both the root files and the clean URL
folders:

about/
products/
applications/
downloads/
distributors/
contact/

After deployment, check:

https://www.superiorelectric.in/products/
https://www.superiorelectric.in/applications/
https://www.superiorelectric.in/contact/
