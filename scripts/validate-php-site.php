<?php
declare(strict_types=1);

$_SERVER['REQUEST_URI'] = '/';
require __DIR__ . '/../php-site/includes/functions.php';

$routes = array_merge(['home'], array_keys(PAGE_ROUTES));
$errors = [];
$assetRoot = realpath(__DIR__ . '/../php-site');

foreach ($routes as $route) {
    $page = page_data($route);
    if (!$page || strlen($page['body']) < 1000) {
        $errors[] = "$route did not render a usable body";
        continue;
    }
    if (strpos($page['body'], '<header') !== false || strpos($page['body'], '<footer') !== false) {
        $errors[] = "$route retained a duplicated shared header/footer";
    }
    preg_match_all('/(?:src|href)=["\'](\/assets\/[^"\']+)["\']/i', $page['body'], $matches);
    foreach ($matches[1] as $url) {
        $relative = parse_url($url, PHP_URL_PATH);
        if ($relative && !is_file($assetRoot . $relative)) {
            $errors[] = "$route references missing asset $url";
        }
    }
    preg_match_all('/href=["\']\/([^"\'#?]*)["\']/i', $page['body'], $links);
    foreach ($links[1] as $link) {
        $slug = trim($link, '/');
        if ($slug === '' || $slug === 'api/contact' || array_key_exists($slug, PAGE_ROUTES)) continue;
        $errors[] = "$route contains an unmapped internal link /$slug";
    }
}

if ($errors) {
    fwrite(STDERR, implode(PHP_EOL, $errors) . PHP_EOL);
    exit(1);
}

echo 'PHP routes rendered: ' . count($routes) . PHP_EOL;
echo 'Asset references: OK' . PHP_EOL;
