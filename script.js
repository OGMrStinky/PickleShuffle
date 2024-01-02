// Adjust the textarea height as new lines are added
document.getElementById('playerNames').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Function to submit the form and display grouped players
function submitForm() {
    var numberOfCourts = document.getElementById('numberOfCourts').value;
    var playerNames = document.getElementById('playerNames').value;

    // Split player names into an array
    var playersArray = playerNames.split('\n').map(function (name) {
        return name.trim();
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
    var groupedPlayersContainer = document.getElementById('groupedPlayers');
    groupedPlayersContainer.innerHTML = '';

    // Display players in each court
    groupedPlayers.courts.forEach(function (court, index) {
        var courtCard = document.createElement('div');
        courtCard.classList.add('card', 'mb-4');

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

