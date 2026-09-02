<?php
declare(strict_types=1);

const SITE_NAME = 'Amazon Self Publishing Hub';
const SITE_URL = '';
const CONTACT_EMAIL = '';

date_default_timezone_set('UTC');

function site_url(string $path = ''): string
{
    $configured = rtrim((string) (getenv('SITE_URL') ?: SITE_URL), '/');
    if ($configured === '') {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = (string) ($_SERVER['HTTP_HOST'] ?? '');
        $configured = $host !== '' ? $scheme . '://' . $host : '';
    }
    return $configured . '/' . ltrim($path, '/');
}

function asset(string $path): string
{
    return site_url('assets/' . ltrim($path, '/'));
}
