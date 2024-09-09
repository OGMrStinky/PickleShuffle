
<?php
// Database connection
$host = 'localhost';
$db = 'shuffledb';
$user = 'root';
$pass = '';
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
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Define the owner ID (this could come from a request parameter or session)
$ownerId = 111111; // Replace with the actual owner ID

// Fetch events with team count for the specific owner
$stmt = $pdo->prepare('
    SELECT 
        events.name AS Name, 
        events.eventdate AS Date, 
        events.status AS Status, 
        events.eventcode as EventCode,
        COUNT(eventteams.id) AS TeamCount
    FROM 
        events
    LEFT JOIN 
        eventteams ON events.id = eventteams.eventid
    WHERE 
        events.ownercode = :owner_code
    GROUP BY 
        events.id;
');

$stmt->execute(['owner_code' => $ownerId]);
$events = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Event List</title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 20px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:checked + .slider:before {
        transform: translateX(14px);
    }
</style>
</head>
<body>
    <div class="container mt-5">
        <h2>Event List</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Team Count</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($events as $event): ?>
                    <tr>
                        <td><?= htmlspecialchars($event['Name']) ?></td>
                        <td><?= htmlspecialchars($event['Date']) ?></td>
                        <td>
                            <label class="switch">
                                <input type="checkbox" class="status-toggle <?= $event['Status'] == 'open' ? 'checked' : '' ?>">
                                <span class="slider round"></span>
                            </label>
                            <span class="status-text"><?= htmlspecialchars(ucfirst($event['Status'])) ?></span>
                        </td>
                        <td><?= htmlspecialchars($event['TeamCount']) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <script>
        document.querySelectorAll('.status-toggle').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const eventId = this.getAttribute('data-event-id');
                const newStatus = this.checked ? 'open' : 'closed';
                const statusTextElement = this.nextElementSibling;

                fetch('update_status.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: eventId, status: newStatus })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Status updated successfully');
                        statusTextElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                    } else {
                        console.error('Failed to update status');
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });
    </script>
</body>
</html>