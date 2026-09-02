<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim((string) ($_POST['cn'] ?? $_POST['name'] ?? ''));
$email = trim((string) ($_POST['em'] ?? $_POST['email'] ?? ''));
$phone = trim((string) ($_POST['pn'] ?? $_POST['phone'] ?? ''));
$message = trim((string) ($_POST['msg'] ?? $_POST['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please provide a valid name and email address.']);
    exit;
}

if (mb_strlen($phone) > 40 || mb_strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Some form fields are too long.']);
    exit;
}

$lead = json_encode([
    'created_at' => gmdate('c'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
], JSON_UNESCAPED_SLASHES) . PHP_EOL;

$storage = __DIR__ . '/../storage/leads.ndjson';
if (!is_dir(dirname($storage))) mkdir(dirname($storage), 0750, true);
file_put_contents($storage, $lead, FILE_APPEND | LOCK_EX);

if (CONTACT_EMAIL !== '') {
    @mail(CONTACT_EMAIL, 'New website enquiry', "Name: $name\nEmail: $email\nPhone: $phone\n\n$message", "Reply-To: $email");
}

echo json_encode(['ok' => true]);
