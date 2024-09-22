
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
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

$ownercode = Input::get('ownercode');
if(!$ownercode) {
    Redirect::to('EventNotFound.html');
}

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

$stmt->execute(['owner_code' => $ownercode]);
$events = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XKSHKEKRBC"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-XKSHKEKRBC');
    </script>
    <!-- End Google tag (gtag.js) -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event List</title>
     <!-- Bootstrap CSS -->
     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <!-- Custom CSS -->
    <style>
        #responsiveImageNav {
            width: 100px; /* Adjust the width as needed */
            height: auto; /* Maintain aspect ratio */
        }
        .table-custom tbody tr:nth-child(odd) {
            background-color: #f9f9f9; /* Light grey background for odd rows */
        }
        .table-custom tbody tr:nth-child(even) {
            background-color: #ffffff; /* White background for even rows */
        }
        .navbar-text{
            font-size: 2em;
        }
        .navbar-center {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
        .main-content {
            margin-top: 10px; /* Adjust this value based on the height of your navbar */
        }
        @media (max-width: 576px) {
            .navbar-center {
                position: static;
                transform: none;
                text-align: center;
                width: 100%;
            }
            .main-content {
                margin-top: 90px; /* Adjust this value for smaller screens if needed */
            }
        }
    </style>
</head>
<body>

    <!-- Navigation bar with responsive image -->
    <nav class="navbar navbar-light fixed-top" style="background-color: #66424e;">
        <div class="container-fluid d-flex justify-content-between align-items-center position-relative">
            <div class="col-auto">
                <a class="navbar-brand" href="#">
                    <img src="logo.png" alt="Responsive Image" id="responsiveImageNav" class="img-fluid rounded-circle">
                </a>
            </div>
            <div class="col-auto navbar-center">
                <span class="navbar-text text-white">Manage Events</span>
            </div>
            <div class="col-auto"></div> <!-- Empty column to balance the layout -->
        </div>
    </nav>
    <div class="container">
        <h2>Event List</h2>
        <!-- Add Event Button -->
        <button type="button" class="btn btn-primary mb-3" data-toggle="modal" data-target="#addEventModal">
            Add Event
        </button>
        
        <table class="table table-bordered table-custom">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Team Count</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($events as $event): ?>
                    <tr>
                        <td>
                            <a href="events.php?eventcode=<?= htmlspecialchars($event['EventCode']) ?>&ownercode=<?= $ownercode ?>">
                                <?= htmlspecialchars($event['Name']) ?>
                            </a>
                        </td>
                        <td><?= htmlspecialchars($event['Date']) ?></td>
                        <td class="status-text"><?= htmlspecialchars(ucfirst($event['Status'])) ?></td>
                        <td><?= htmlspecialchars($event['TeamCount']) ?></td>
                        <td>
                            <?php if ($event['Status'] == 'open'): ?>
                                <button type="button" class="btn btn-danger close-event-button" data-event-code="<?= $event['EventCode'] ?>">Close Event</button>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Add Event Modal -->
    <div class="modal fade" id="addEventModal" tabindex="-1" role="dialog" aria-labelledby="addEventModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addEventModalLabel">Add Event</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addEventForm">
                        <div class="form-group">
                            <label for="eventName">Event Name</label>
                            <input type="text" class="form-control" id="eventName" name="eventName" required>
                        </div>
                        <div class="form-group">
                            <label for="eventDate">Event Date</label>
                            <input type="date" class="form-control" id="eventDate" name="eventDate" required>
                        </div>
                        <input type="hidden" id="ownerCode" name="ownerCode" value="<?= htmlspecialchars($ownercode) ?>">
                        <button type="submit" class="btn btn-primary">Add Event</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.querySelectorAll('.close-event-button').forEach(button => {
            button.addEventListener('click', function() {
                const eventCode = this.getAttribute('data-event-code');
                const statusTextElement = this.closest('tr').querySelector('.status-text');

                fetch('update_status.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ eventcode: eventCode, status: 'closed' })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Status updated successfully');
                        statusTextElement.textContent = 'Closed';
                        this.remove(); // Remove the button after closing the event
                    } else {
                        console.error('Failed to update status');
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });

        document.getElementById('addEventForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);

            fetch('add_event.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Event added successfully');
                    location.reload(); // Reload the page to see the new event
                } else {
                    console.error('Failed to add event');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    </script>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>