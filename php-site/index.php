<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/functions.php';

$route = route_key();
$page = page_data($route);

if ($page === null) {
    http_response_code(404);
    require __DIR__ . '/404.php';
    exit;
}

require __DIR__ . '/includes/header.php';
echo $page['body'];
require __DIR__ . '/includes/footer.php';
