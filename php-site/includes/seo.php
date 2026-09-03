<?php
declare(strict_types=1);

$pageTitle = $page['title'] ?? SITE_NAME;
$pageDescription = $page['description'] ?? '';
$canonical = site_url(route_key() === 'home' ? '' : route_key());
?><!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle) ?></title>
    <meta name="description" content="<?= e($pageDescription) ?>">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="<?= e($canonical) ?>">
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?= e($pageTitle) ?>">
    <meta property="og:description" content="<?= e($pageDescription) ?>">
    <meta property="og:url" content="<?= e($canonical) ?>">
    <meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
    <link rel="icon" href="<?= e(asset('favicon.jpg')) ?>" type="image/jpeg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e(asset('css/style.css?v=20260903')) ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script>
        window.uetq = window.uetq || [];
        (function (w, d, t, r, u) {
            var f, n, i;
            w[u] = w[u] || [];
            f = function () {
                var o = { ti: "187210631", enableAutoSpaTracking: true };
                o.q = w[u]; w[u] = new UET(o); w[u].push("pageLoad");
            };
            n = d.createElement(t); n.src = r; n.async = 1;
            n.onload = n.onreadystatechange = function () {
                var s = this.readyState;
                if (!s || s === "loaded" || s === "complete") { f(); n.onload = n.onreadystatechange = null; }
            };
            i = d.getElementsByTagName(t)[0]; i.parentNode.insertBefore(n, i);
        })(window, document, "script", "https://bat.bing.com/bat.js", "uetq");
    </script>
    <script defer id="ze-snippet" src="https://static.zdassets.com/ekr/snippet905a.js?key=5bd15d7e-2a5a-4e24-ad3e-a843b8d9cd18"></script>
</head>
<body>
