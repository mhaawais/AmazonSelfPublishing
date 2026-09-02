<?php
declare(strict_types=1);
http_response_code(404);
require_once __DIR__ . '/includes/config.php';
?><!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found | <?= htmlspecialchars(SITE_NAME, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="icon" href="<?= htmlspecialchars(asset('favicon.jpg'), ENT_QUOTES, 'UTF-8') ?>" type="image/jpeg">
    <link rel="stylesheet" href="<?= htmlspecialchars(asset('css/style.css'), ENT_QUOTES, 'UTF-8') ?>">
</head>
<body>
<main class="container" style="padding: 120px 20px; text-align: center;">
    <h1>Page Not Found</h1>
    <p>The page you requested could not be found.</p>
    <a class="btn btn-primary" href="<?= htmlspecialchars(site_url(), ENT_QUOTES, 'UTF-8') ?>">Return Home</a>
</main>
</body>
</html>
