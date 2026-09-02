<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

const PAGE_ROUTES = [
    'services' => 'services.html',
    'ghostwriting-services' => 'ghostwriting-services.html',
    'book-editing-services' => 'book-editing-services.html',
    'book-publishing-services' => 'book-publishing-services.html',
    'proofreading-services' => 'proofreading-services.html',
    'audio-book-recording-services' => 'audio-book-recording-services.html',
    'book-promotion-services' => 'book-promotion-services.html',
    'book-marketing-services' => 'book-marketing-services.html',
    'formatting-services' => 'formatting-services.html',
    'ebook-writing-services' => 'ebook-writing-services.html',
    'blog-writing-service' => 'blog-writing-service.html',
    'web-content-writing-service' => 'web-content-writing-service.html',
    'amazon-book-publishing-services' => 'amazon-book-publishing-services.html',
    'article-writing-services' => 'article-writing-services.html',
    'book-trailer-services' => 'book-trailer-services.html',
    'book-cover-design-services' => 'book-cover-design-services.html',
    'author-website-design-services' => 'author-website-design-services.html',
    'case-study' => 'case-study.html',
    'pricing' => 'pricing.html',
    'faq' => 'faq.html',
    'contact' => 'contact.html',
    'get-a-quote' => 'get-a-quote.html',
    'terms-and-conditions' => 'terms-and-conditions.html',
    'privacy-policy' => 'privacy-policy.html',
];

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function route_key(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = trim($path, '/');
    if ($path === '' || strtolower($path) === 'index.php' || strtolower($path) === 'index') return 'home';
    $path = preg_replace('/\.html?$/i', '', $path) ?? $path;
    $path = preg_replace('/\.php$/i', '', $path) ?? $path;
    return basename($path);
}

function source_file(string $route): ?string
{
    if ($route === 'home') return __DIR__ . '/../pages/source/index.html';
    $file = PAGE_ROUTES[$route] ?? null;
    return $file ? __DIR__ . '/../pages/source/' . $file : null;
}

function extract_meta(string $source, string $name): string
{
    $pattern = '/<meta\s+[^>]*name=["\']' . preg_quote($name, '/') . '["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i';
    return trim((string) (preg_match($pattern, $source, $match) ? $match[1] : ''));
}

function extract_title(string $source): string
{
    return trim((string) (preg_match('/<title>\s*(.*?)\s*<\/title>/is', $source, $match) ? strip_tags($match[1]) : 'Home'));
}

function normalize_links(string $html): string
{
    $html = preg_replace_callback('/(href=["\'])([^"\']+?)(["\'])/i', static function (array $match): string {
        $href = $match[2];
        if (preg_match('/^(?:https?:|mailto:|tel:|#|javascript:|\/)/i', $href)) return $match[0];
        $href = preg_replace('/^index(?:-2)?\.html$/i', '/', $href) ?? $href;
        $href = preg_replace('/\.html?([?#].*)?$/i', '.php$1', $href) ?? $href;
        return $match[1] . $href . $match[3];
    }, $html) ?? $html;

    $html = preg_replace_callback('/(href=["\'])([a-z0-9-]+)\.php([?#][^"\']*)?(["\'])/i', static function (array $match): string {
        $slug = strtolower($match[2]);
        return array_key_exists($slug, PAGE_ROUTES)
            ? $match[1] . '/' . $slug . ($match[3] ?? '') . $match[4]
            : $match[0];
    }, $html) ?? $html;

    return str_replace([
        'href="index.php"', 'href="index-2.php"', 'href="index.html"',
        'href="services.php"', 'href="contact.php"',
    ], [
        'href="/"', 'href="/"', 'href="/"',
        'href="/services"', 'href="/contact"',
    ], $html);
}

function normalize_images(string $html): string
{
    $html = preg_replace_callback('/<img\b[^>]*>/i', static function (array $match): string {
        $tag = $match[0];
        if (preg_match('/data-imgurl=["\']([^"\']+)["\']/i', $tag, $source)) {
            $src = str_starts_with($source[1], '/') ? $source[1] : '/' . $source[1];
            $tag = preg_replace('/src=["\'][^"\']*["\']/i', 'src="' . $src . '"', $tag) ?? $tag;
        }
        return $tag;
    }, $html) ?? $html;

    return str_replace([
        'src="assets/', 'src="loader.gif"', 'data-imgurl="assets/',
        'url(assets/', 'url("assets/', "url('assets/",
    ], [
        'src="/assets/', 'src="/assets/loader.gif"', 'data-imgurl="/assets/',
        'url(/assets/', 'url("/assets/', "url('/assets/",
    ], $html);
}

function normalize_asset_repairs(string $html): string
{
    $repairs = [
        'assets/img/article-writing-publication.svg' => 'assets/img/article-writers.png',
        'assets/img/author-website.svg' => 'assets/img/author-website-img.png',
        'assets/img/banner-rignt-img4.png' => 'assets/img/banner-rignt-img3.png',
        'assets/img/bg1.webp' => 'assets/img/fade-bg.png',
        'assets/img/book-cover-design.svg' => 'assets/img/book-cover-img.png',
        'assets/img/book-marketing.svg' => 'assets/img/book-marketing-img.png',
        'assets/img/book-publishing.svg' => 'assets/img/publishing-img.png',
        'assets/img/book-video-trailer.svg' => 'assets/img/book-video-trailer-img.png',
        'assets/img/custom-book-illustration.svg' => 'assets/img/customized-offers.png',
        'assets/img/ebook-writing.svg' => 'assets/img/ebook-writing-img.png',
        'assets/img/editing.svg' => 'assets/img/editing-img.png',
        'assets/img/ghost-book-writing.svg' => 'assets/img/ghost-writing-img.png',
        'assets/img/icon-check2.webp' => 'assets/img/appealing-design.png',
        'assets/img/professional-audio-book.svg' => 'assets/img/audio-book-img.png',
        'assets/img/why-choose-us.png' => 'assets/img/customer-oriented.png',
        'assets/img/new-image-twoo-1024x803.html' => 'assets/img/main-book2.webp',
        'assets/img/new-image-twoo-1024x803.png' => 'assets/img/main-book2.webp',
        'assets/img/pbef.html' => 'assets/img/cta_discount.webp',
        'assets/img/pbef.webp' => 'assets/img/cta_discount.webp',
        'assets/img/right-arrow.html' => 'assets/img/right-timeline-arrow.png',
        'assets/img/right-arrow.png' => 'assets/img/right-timeline-arrow.png',
        'assets/img/sec_cts_two.html' => 'assets/img/cta_bg.png',
        'assets/img/sec_cts_two.png' => 'assets/img/cta_bg.png',
        'assets/img/video-bg3.html' => 'assets/img/footer2_top_bg.jpg',
        'assets/img/video-bg3.png' => 'assets/img/footer2_top_bg.jpg',
        'assets/img/video-bg-pettern.html' => 'assets/img/fade-bg.png',
        'assets/img/video-bg-pettern.png' => 'assets/img/fade-bg.png',
    ];
    for ($i = 1; $i <= 9; $i++) {
        $number = str_pad((string) $i, 2, '0', STR_PAD_LEFT);
        $repairs["assets/img/icon-$number.html"] = "assets/img/icon-$number.png";
    }
    return str_replace(array_keys($repairs), array_values($repairs), $html);
}

function page_data(string $route): ?array
{
    $file = source_file($route);
    if (!$file || !is_file($file)) return null;
    $source = (string) file_get_contents($file);
    preg_match('/<body[^>]*>(.*?)<\/body>/is', $source, $bodyMatch);
    $body = $bodyMatch[1] ?? $source;
    $body = preg_replace('/<header\b[^>]*class=["\'][^"\']*header-wrapper[^"\']*["\'][\s\S]*?<\/header>/i', '', $body) ?? $body;
    $body = preg_replace('/<footer\b[^>]*class=["\'][^"\']*site-footer[^"\']*["\'][\s\S]*?<\/footer>/i', '', $body) ?? $body;
    $body = preg_replace('/<script\b[\s\S]*?<\/script>/i', '', $body) ?? $body;
    $body = preg_replace('/<input[^>]+(?:id|name)=["\']user_ip["\'][^>]*>/i', '', $body) ?? $body;
    $body = preg_replace('/action=["\']#["\']/i', 'action="/api/contact"', $body) ?? $body;
    $body = normalize_images(normalize_links(normalize_asset_repairs($body)));

    return [
        'title' => extract_title($source),
        'description' => extract_meta($source, 'description'),
        'body' => $body,
    ];
}

function shared_fragment(string $tag): string
{
    $file = source_file('home');
    if (!$file || !is_file($file)) return '';
    $source = (string) file_get_contents($file);
    $pattern = $tag === 'header'
        ? '/<header\b[^>]*class=["\'][^"\']*header-wrapper[^"\']*["\'][\s\S]*?<\/header>/i'
        : '/<footer\b[^>]*class=["\'][^"\']*site-footer[^"\']*["\'][\s\S]*?<\/footer>/i';
    preg_match($pattern, $source, $match);
    return isset($match[0]) ? normalize_images(normalize_links(normalize_asset_repairs($match[0]))) : '';
}
