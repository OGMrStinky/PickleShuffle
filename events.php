<?php

require_once 'core/init.php';
$isOpen = false;

if(!Input::get('eventcode')) {
    Redirect::to('EventNotFound.html');
}elseif(!Event::checkIsOpen(Input::get('eventcode'))) {
    $isOpen = true;
    if(!Input::get('ownercode')) {
        Redirect::to('EventNotFound.html');
    }
}

$newTeamCode = "";

if (Input::exists()) {
    if(Token::check(Input::get('token'))) {
        if(Input::get('teamcode')) {
            if(Input::get('player1firstname')){ 
                if(Event::updateTeam(Input::get('teamcode', true), array(
                    'player1firstname' => Input::get('player1firstname', true),
                    'player1lastname' => Input::get('player1lastname', true),
                    'player2firstname' => Input::get('player2firstname', true),
                    'player2lastname' => Input::get('player2lastname', true),
                    'teamcode' => Input::get('teamcode', true)
                    
                ))) {
                    //echo "****team updated****";
                } else {
                    echo "****There was an error. Team not updated****";
                }
            } else{
                if(Event::deleteTeam(Input::get('teamcode'))) {
                    //echo "****team deleted****";
                } else {
                    echo "****There was an error. Team not deleted****";
                }
            }
        } else {
            $newTeamCode = Event::addTeam(array(
                'player1firstname' => Input::get('player1firstname', true),
                'player1lastname' => Input::get('player1lastname', true),
                'player2firstname' => Input::get('player2firstname', true),
                'player2lastname' => Input::get('player2lastname', true),
                'eventid' => Input::get('eventid', true)
            ));
            if($newTeamCode) {
                //echo $newTeamCode;
            } else {
                echo "****There was an error.  Team NOT added****";
            }
        }    
    }
}
//build full url for sharing that includes eventcode and new teamcode
$fullUrl = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" . "&teamcode=" . $newTeamCode;

$event = new Event(Input::get('eventcode'), Input::get('ownercode'));
$host = $_SERVER['HTTP_HOST'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$eventCode = $event->data()->eventcode;
$eventURL = "https://$host$path?eventcode=$eventCode";
$myTeamCode = Input::get('teamcode');
$token = Token::generate();
$teamCounter = 0;
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

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ladder Registration</title>
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
                <span class="navbar-text text-white"><?= $event->data()->name ?></span>
            </div>
            <div class="col-auto"></div> <!-- Empty column to balance the layout -->
        </div>
    </nav>

    <!-- Main content -->
    <div class="container main-content">

        <!-- Centered text with link to event page with teamcode -->
        <?php if ($newTeamCode && !Input::get('ownercode')): ?>
            <div class="text-center">
                <p>Team added. Save this link if you want to return and edit or delete your team:</p>
                <div class="alert alert-light" role="alert">
                    <a href="<?= $fullUrl ?>"><?= $fullUrl ?></a>
                </div>
            </div>
        <?php elseif (!Input::get('teamcode') || !$event->teams()): ?>
            <div class="d-flex justify-content-start mb-3">
                <!-- Button to add a team -->
                <button type="button" class="btn btn-primary mr-2" data-toggle="modal" data-target="#addTeamModal" <?= ($isOpen) ? ' disabled' : "" ?>>
                    Add Team  <i class="fas fa-user-plus"></i>
                </button>
                        <!-- if the ownercode is set, display a share button with a share icon -->
                <?php if (Input::get('ownercode')): ?>
                    <button type="button" class="btn btn-primary" id="shareEventButton" <?= ($isOpen) ? ' disabled' : "" ?>>
                        <i class="fas fa-share"></i> Share Event
                    </button>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <!-- if the teamcode is not set, display instructions above the table -->
        <?php if (Input::get('teamcode') && $event->teams()): ?>
            <div class="alert alert-light text-center  " role="alert">
                <p>Scroll to your team and use the Edit or Delete buttons to update or delete your team.</p>
            </div>
        <?php endif; ?>

        <!-- Modal to add a team -->
        <div class="modal fade" id="addTeamModal" tabindex="-1" role="dialog" aria-labelledby="addTeamModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addTeamModalLabel">Add Team</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Tip for users -->
                        <div class="alert alert-info" role="alert">
                            Please enter the full first and last names for both players.  Only first name and last initial will display to the group.
                        </div>
                        <!-- Form to add a team, teams have two players, collect first and last name in separate inputs -->
                        <form id="addTeamForm" method="post">
                            <!-- Player 1 First Name and Last Name -->
                            <div class="form-group  mb-2">
                                <label for="player1firstname">First Name</label>
                                <input type="text" class="form-control" id="player1firstname" name="player1firstname" minlength="3" required>
                            </div>
                            <div class="form-group  mb-2">
                                <label for="player1lastname">Last Name</label>
                                <input type="text" class="form-control" id="player1lastname" name="player1lastname" minlength="3" required>
                            </div>
                            
                            <!-- Player 2 First Name and Last Name -->
                            <div class="form-group  mb-2">
                                <label for="player2firstname">First Name</label>
                                <input type="text" class="form-control" id="player2firstname" name="player2firstname" minlength="3" required>
                            </div>
                            <div class="form-group  mb-2">
                                <label for="player2lastname">Last Name</label>
                                <input type="text" class="form-control" id="player2lastname" name="player2lastname" minlength="3" required>
                            </div>
                            
                            <input type="hidden" name="eventid" value="<?= $event->data()->id ?>">
                            <input type="hidden" name="token" value="<?php echo $token; ?>">

                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Add Team</button>
                            
                            <!-- use ajax to submit form -->

                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- check if teams exist and display table else display message -->
        <?php if ($event->teams()): ?>
            
        <!-- Table of teams -->
        <table class="table table-custom">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Player 1</th>
                    <th scope="col">Player 2</th>
                    <th scope="col"id="actions-header">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($event->teams() as $team): ?>
                    <tr>
                        <td><?= ++$teamCounter ?></td>
                        <td><?= ($event->isMine() || $myTeamCode == $team->teamcode) ? $team->player1firstname . " " . $team->player1lastname : $team->player1firstname . ' ' . substr($team->player1lastname, 0, 1) . '.' ?></td>
                        <td><?= ($event->isMine() || $myTeamCode == $team->teamcode) ? $team->player2firstname . " " . $team->player2lastname : $team->player2firstname . ' ' . substr($team->player2lastname, 0, 1) . '.'?></td>
                        <td class="actions-column">
                            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editTeamModal" 
                                    data-teamcode="<?= ($event->isMine() || $myTeamCode == $team->teamcode) ? $team->teamcode : 9999 ?>" 
                                    data-player1-firstname="<?= $team->player1firstname ?>" 
                                    data-player1-lastname="<?= $team->player1lastname ?>" 
                                    data-player2-firstname="<?= $team->player2firstname ?>" 
                                    data-player2-lastname="<?= $team->player2lastname ?>"
                                    <?= ($event->isMine() || $myTeamCode == $team->teamcode) ? '' : 'style="display: none;"' ?>
                                    <?= ($isOpen) ? 'disabled' : "" ?>>
                                Edit
                            </button>
                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteTeamModal" 
                                    data-teamcode="<?= ($event->isMine() || $myTeamCode == $team->teamcode) ? $team->teamcode : 9999 ?>" 
                                    data-team-name="<?= $team->player1firstname . ' ' . substr($team->player1lastname, 0, 1) . '. / ' . $team->player2firstname . ' ' . substr($team->player2lastname, 0, 1) . '.' ?>"
                                    <?= ($event->isMine() || $myTeamCode == $team->teamcode) ? '' : 'style="display: none;"' ?>
                                    <?= ($isOpen) ? 'disabled' : "" ?>>
                                Delete
                            </button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
            <div class="alert alert-light text-center" role="alert">
                <p>No teams have been added yet. You can be the first!  Click Add Team.</p>
            </div>
        <?php endif; ?>
        <!-- Single Modal to delete a team -->
        <div class="modal fade" id="deleteTeamModal" tabindex="-1" role="dialog" aria-labelledby="deleteTeamModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteTeamModalLabel">Delete Team</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="teamNames">
                        Are you sure you want to delete this team? This action cannot be undone.
                    </div>  
                    <!-- form to delete a team -->
                    <form id="deleteTeamForm" method="post">
                        <input type="hidden" name="teamcode" id="teamcode">
                        <input type="hidden" name="token" value="<?php echo $token; ?>">
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-danger">Delete</button>
                            
                        </div>
                    </form>    
                </div>
            </div>
        </div>
        <!-- Modal to edit a team -->
        <div class="modal fade" id="editTeamModal" tabindex="-1" role="dialog" aria-labelledby="editTeamModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editTeamModalLabel">Edit Team</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Form to edit a team, teams have two players, collect first and last name in separate inputs -->
                        <form id="editTeamForm" method="post">
                            <!-- Player 1 First Name and Last Name -->
                            <div class="form-group mb-2">
                                <label for="firstName1">Player 1 - First Name</label>
                                <input type="text" class="form-control" id="firstName1" name="player1firstname" required>
                            </div>
                            <div class="form-group mb-2">
                                <label for="lastName1">Player 1 - Last Name</label>
                                <input type="text" class="form-control" id="lastName1" name="player1lastname" required>
                            </div>
                            <!-- Player 2 First Name and Last Name -->
                            <div class="form-group mb-2">
                                <label for="firstName2">Player 2 - First Name</label>
                                <input type="text" class="form-control" id="firstName2" name="player2firstname" required>
                            </div>
                            <div class="form-group mb-2">
                                <label for="lastName2">Player 2 - Last Name</label>
                                <input type="text" class="form-control" id="lastName2" name="player2lastname" required>
                            </div>
                            <input type="hidden" name="token" value="<?php echo $token; ?>">
                            <input type="hidden" name="teamcode" id="teamcode">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Edit Team</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>

     </div>

<!-- Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<!-- localForge-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js"></script>
<!-- Custom JS -->
<!-- <script src="script.js"></script> -->

<!-- JavaScript to populate the form -->
<script>
    $('#editTeamModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var player1FirstName = button.data('player1-firstname');
        var player1LastName = button.data('player1-lastname');
        var player2FirstName = button.data('player2-firstname');
        var player2LastName = button.data('player2-lastname');
        var teamcode = button.data('teamcode');

        var modal = $(this);
        modal.find('#editTeamForm input#firstName1').eq(0).val(player1FirstName);
        modal.find('#editTeamForm input#lastName1').eq(0).val(player1LastName);
        modal.find('#editTeamForm input#firstName2').eq(0).val(player2FirstName);
        modal.find('#editTeamForm input#lastName2').eq(0).val(player2LastName);
        modal.find('#editTeamForm input#teamcode').eq(0).val(teamcode);
    });

    $('#deleteTeamModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget);
        let teamNames = button.data('team-name');
        let teamcode = button.data('teamcode');

        $('#teamNames').text('Are you sure you want to delete the team of: ' + teamNames + '?  This action cannot be undone.');
        $('#teamcode').val(teamcode);
        $('#confirmDeleteButton').attr('href', 'deleteTeam.php?id=' + button.data('id'));
    });

    let actionsColumnVisible = false;
    const actionsCells = document.querySelectorAll('.actions-column button');

    actionsCells.forEach(button => {
        if (button.style.display !== 'none') {
            actionsColumnVisible = true;
        }
    });

    if (!actionsColumnVisible) {
        const actionsHeader = document.getElementById('actions-header');
        if (actionsHeader) {
            actionsHeader.style.display = 'none';
        }

        const actionsColumns = document.querySelectorAll('.actions-column');
        if (actionsColumns.length > 0) {
            actionsColumns.forEach(cell => {
                cell.style.display = 'none';
            });
        }
    }

    const shareData = {
        title: "Event Registration Link",
        text: "Register for <?php echo $event->data()->name ?>",
        url: "<?= $eventURL ?>",
    };

    const btn = document.querySelector("#shareEventButton");

    // Share must be triggered by "user activation"
    if (btn) {
        btn.addEventListener("click", async () => {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("There was an error trying to share this content");
                console.error(err.message);
            }
        });
    }
</script>

</body>
</html>
