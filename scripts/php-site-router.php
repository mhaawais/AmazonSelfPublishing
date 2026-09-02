<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if ($path === '/api/contact') {
    require __DIR__ . '/../php-site/api/contact.php';
    return;
}
$file = __DIR__ . '/../php-site' . $path;
if ($path !== '/' && is_file($file)) return false;
require __DIR__ . '/../php-site/index.php';
