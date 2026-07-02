SEM® Website — v2
=================
Open index.html directly in any browser — no server needed.

FOLDER STRUCTURE
----------------
index.html          — Homepage
about.html          — About SEM
products.html       — Full product catalog (all products from catalog)
applications.html   — Fan & Blower applications
downloads.html      — Catalogue downloads
distributors.html   — Authorised distributor network
contact.html        — Contact form + map

css/style.css       — All styles
js/main.js          — All interactions (nav, modal, animations, filter)
js/products.js      — All product data (20 product families, full spec tables)
images/             — Put logo, product images, factory photos here
assets/videos/      — Put application videos here (mp4)
assets/downloads/   — Put PDF catalogues here

HOW TO ADD VIDEOS (Homepage hero + application grid)
------------------------------------------------------
1. Add .mp4 files to assets/videos/
2. In index.html, uncomment the <video> tags and set src=""
3. The reel cycles automatically every 6 seconds

HOW TO ADD PRODUCT IMAGES
---------------------------
In js/products.js, each product has an array. 
Replace the SVG placeholder in products.html's buildProductGrid() function 
with: <img src="images/YOUR-PRODUCT-IMAGE.jpg" alt="...">

HOW TO ADD REAL PHOTOS
------------------------
- Factory photo → images/factory.jpg → replace img-placeholder divs
- Application photos → images/app-hvac.jpg etc → replace app-row-img divs
- Product card images → images/product-1ec.jpg etc

CONTACT DETAILS (already filled in from your contact.html)
------------------------------------------------------------
Phone: +91 8028361383, +91 8028361742, +91 8041171243
Email: info@superiorelectric.in
Address: B-214, 5th Main Rd, Peenya Industrial Area Phase IV, Bengaluru 560058
Map: Google Maps embed already included on contact.html

DISTRIBUTORS (already filled in from your distributors.html)
-------------------------------------------------------------
- Andhra Pradesh / Telangana: CLEAN ZONE CONCEPTS (+91 8790577507)
- Gujarat / Daman: KUNJ ENTERPRISE (+91 9898818447)
- Tamil Nadu: Shibam Engineering & Pneumatics (+91 9894017862)
- Haryana: GYAN ENTERPRISES (+91 9873234580)
- Central India: TODO (placeholder shown)
- International: TODO (placeholder shown)
