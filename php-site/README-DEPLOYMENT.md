# Amazon Self Publishing Hub — Hostinger deployment

This folder is the standalone PHP migration. Upload the **contents of `php-site/`** directly into Hostinger's `public_html/`; do not upload the parent `php-site` folder itself.

## Requirements

- Apache hosting with PHP 8.0 or newer.
- Apache `mod_rewrite` enabled (standard on Hostinger).
- PHP `mbstring` enabled for form validation.
- HTTPS enabled in Hostinger. Update `SITE_URL` in `includes/config.php` and the domain in `robots.txt`/`sitemap.xml` before launch.

## Configuration

Edit `includes/config.php`:

- Optionally set the `SITE_URL` environment variable to the production URL, without a trailing slash. If it is blank, PHP derives the current HTTPS host automatically for browser-facing URLs.
- Set `CONTACT_EMAIL` to the mailbox that should receive enquiries. It is blank by default so the site does not send mail unexpectedly.

Form submissions are validated and appended to `storage/leads.ndjson`. The storage directory is protected by `.htaccess`; configure an email mailbox and/or download this file periodically. For a production mail workflow, configure Hostinger SMTP or replace the `mail()` call with the provider approved for the account.

## Upload checklist

- [ ] `index.php` loads at the domain root.
- [ ] `assets/css/style.css` and `assets/js/main.js` load.
- [ ] Header, logo, favicon, hero images, and footer load.
- [ ] All 25 routes and clean URLs work.
- [ ] Mobile navigation, dropdowns, popup, sliders, and forms work.
- [ ] `/api/contact` returns a JSON success response for a valid POST.
- [ ] `404.php`, `sitemap.xml`, and `robots.txt` load.
- [ ] HTTPS is active and there are no mixed-content warnings.
- [ ] No development URLs or Node/React runtime dependency remains.
- [ ] Browser console and PHP error log show no application errors.

## URL compatibility

Clean URLs such as `/services` are supported. The existing `.php` route names such as `/services.php` are also accepted by the front controller, so old links remain practical. Apache's `.htaccess` must be uploaded with the rest of the files.
