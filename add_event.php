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
$eventName = $_POST['eventName'];
$eventDate = $_POST['eventDate'];
$ownerCode = $_POST['ownerCode'];
$eventCode = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 8);
//$eventCode = bin2hex(random_bytes(4)); // Generates an 8-character hexadecimal string

// Insert the new event
$sql = 'INSERT INTO events (name, eventdate, ownercode, eventcode) VALUES (:name, :date, :ownercode, :eventcode)';
$stmt = $pdo->prepare($sql);
$stmt->execute(['name' => $eventName, 'date' => $eventDate, 'ownercode' => $ownerCode, 'eventcode' => $eventCode]);

if ($stmt->rowCount()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>