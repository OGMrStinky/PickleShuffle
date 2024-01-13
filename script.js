// Adjust the textarea height as new lines are added
document.getElementById('playerNames').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the textarea element
    var playerNamesTextarea = document.getElementById('playerNames');

    // Listen for input event on the textarea
    playerNamesTextarea.addEventListener('input', function () {
        // Get the current value of the textarea
        var currentValue = playerNamesTextarea.value;

        // Replace any non-alphanumeric characters with an empty string
        var newValue = currentValue.replace(/[^\w\r\n]/g, '');

        // Set the filtered value back to the textarea
        playerNamesTextarea.value = newValue;
    });
});

// Function to submit the form and display grouped players
function submitForm() {
    var numberOfCourts = document.getElementById('numberOfCourts').value;
    var playerNames = document.getElementById('playerNames').value;

    // Split player names into an array
    var playersArray = playerNames.split('\n').map(function (name) {
        return name.trim();
    });

    // Filter out empty names
    playersArray = playersArray.filter(function (name) {
        return name !== '';
    });

    // Group players by courts and bench (randomized)
    var groupedPlayers = groupPlayers(playersArray, numberOfCourts);

    // Display grouped players on the webpage
    displayGroupedPlayers(groupedPlayers);

    // Scroll down to the grouped players section
    scrollToGroupedPlayers();
}

// Function to scroll down to the grouped players section
function scrollToGroupedPlayers() {
    var groupedPlayersSection = document.getElementById('groupedPlayers');
    
    // Check if the section exists
    if (groupedPlayersSection) {
        // Scroll smoothly to the section
        groupedPlayersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to group players by courts and bench (randomized)
function groupPlayers(playersArray, numberOfCourts) {
    var randomizedPlayers = playersArray.sort(function () {
        return 0.5 - Math.random();
    });

    var groupedPlayers = {
        courts: [],
        bench: []
    };

    randomizedPlayers.forEach(function (player, index) {
        if (index < numberOfCourts * 4) {
            // Assign players to courts and split into two teams
            var courtIndex = Math.floor(index / 4);
            var teamIndex = index % 2; // 0 or 1 for team assignment
            
            if (!groupedPlayers.courts[courtIndex]) {
                groupedPlayers.courts[courtIndex] = {
                    team1: [],
                    team2: []
                };
            }

            if (teamIndex === 0) {
                groupedPlayers.courts[courtIndex].team1.push(player);
            } else {
                groupedPlayers.courts[courtIndex].team2.push(player);
            }
        } else {
            // Assign remaining players to the bench
            groupedPlayers.bench.push(player);
        }
    });

    return groupedPlayers;
}


// Function to display grouped players on the webpage
function displayGroupedPlayers(groupedPlayers) {
    console.log(groupedPlayers);
    var groupedPlayersContainer = document.getElementById('groupedPlayers');
    groupedPlayersContainer.innerHTML = '';

    // Display players in each court
    groupedPlayers.courts.forEach(function (court, index) {
        var courtCard = document.createElement('div');
        courtCard.classList.add('card', 'mb-4', 'court-card');
        courtCard.setAttribute('data-court-index', index); // Set a data attribute to store the court index

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Header with Court number
        var cardHeader = document.createElement('h5');
        cardHeader.classList.add('card-title');
        cardHeader.textContent = 'Court ' + (index + 1);
        cardBody.appendChild(cardHeader);

        // Display Team 1
        cardBody.appendChild(createTeamList('Team 1', court.team1));

        // Display Team 2
        cardBody.appendChild(createTeamList('Team 2', court.team2));

        // Add click event listener to the court card
        courtCard.addEventListener('click', function () {
            recordScore(index); // Call the function to record the score
        });

        // Check if the court is marked for the next shuffle
        /*
        if (markedCourts.includes(index)) {
            courtCard.classList.add('marked'); // Add a visual indicator (you can customize the styling)
        }
*/
        courtCard.appendChild(cardBody);
        groupedPlayersContainer.appendChild(courtCard);
    });

    // Display players on the bench
    if (groupedPlayers.bench.length > 0) {
        var benchCard = document.createElement('div');
        benchCard.classList.add('card');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Header for Bench
        var cardHeader = document.createElement('h5');
        cardHeader.classList.add('card-title');
        cardHeader.textContent = 'Bench';
        cardBody.appendChild(cardHeader);

        // List of players on the bench
        cardBody.appendChild(createPlayerList(groupedPlayers.bench));

        benchCard.appendChild(cardBody);
        groupedPlayersContainer.appendChild(benchCard);
    }
}

var markedPlayers = {
    courts: [],
    bench: []
};

// Function to record the score and mark the court for the next shuffle
function recordScore(courtIndex) {
    // Find the first open position in the array
    let openIndex = markedPlayers.courts.findIndex((court, index) => index >= courtIndex && (!court || Object.keys(court).length === 0));

    // If no open position is found, add a new entry at the end
    if (openIndex === -1) {
        openIndex = markedPlayers.courts.length;
        markedPlayers.courts.push({
            team1: [],
            team2: []
        });
    }

    // Extract players from the displayed court card
    var courtCard = document.querySelector('.court-card[data-court-index="' + courtIndex + '"]');
    if (courtCard) {
        var team1Players = Array.from(courtCard.querySelectorAll('.team-container:nth-child(2) ul li')).map(function (li) {
            return li.textContent.trim();
        });
        var team2Players = Array.from(courtCard.querySelectorAll('.team-container:nth-child(3) ul li')).map(function (li) {
            return li.textContent.trim();
        });

        // Insert values at the found open position
        markedPlayers.courts[openIndex].team1.push(team1Players[0], team1Players[1]);
        markedPlayers.courts[openIndex].team2.push(team2Players[0], team2Players[1]);

        console.log(markedPlayers);
        // Update the displayed courts (optional)
        //displayGroupedPlayers(markedPlayers);
    }
}




// Function to create a list of players within a card
function createPlayerList(players) {
    var ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');
    players.forEach(function (player) {
        var li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = player;
        ul.appendChild(li);
    });
    return ul;
}

// Function to create a team list within a card
function createTeamList(teamName, teamPlayers) {
    var teamContainer = document.createElement('div');
    teamContainer.classList.add('team-container');

    var teamHeader = document.createElement('h6');
    teamHeader.textContent = teamName;
    teamContainer.appendChild(teamHeader);

    teamContainer.appendChild(createPlayerList(teamPlayers));

    return teamContainer;
}

