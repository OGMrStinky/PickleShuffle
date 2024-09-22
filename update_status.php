<?php

require_once 'core/init.php';

// Database connection
$host = Config::get('mysql/host');
$db = Config::get('mysql/db');
$user = Config::get('mysql/username');
$pass = Config::get('mysql/password');
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);
$eventCode = $data['eventcode'];
$newStatus = $data['status'];

// Update the event status
$stmt = $pdo->prepare('UPDATE events SET status = :status WHERE eventcode = :eventcode');
$stmt->execute(['status' => $newStatus, 'eventcode' => $eventCode]);

if ($stmt->rowCount()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>