var player = {
    name: [],
    score: []
}

var players = {
    new: [],
    benched: [],
    playing: []
}

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

//if no cards yet
//  pull players from input into readyPlayersArray
//  groupPlayers will 
//else 
//  
//empty input to catch new players??
//pass readyplayersArray to groupPlayers


// Function to submit the form and display grouped players
function submitForm() {
    var numberOfCourts = document.getElementById('numberOfCourts').value;
    var playerNames = document.getElementById('playerNames').value;

    // Split player names into an array
    players.new = playerNames.split('\n').map(function (name) {
        return name.trim();
    });

    // Filter out empty names
    players.new = players.new.filter(function (name) {
        return name !== '';
    });

    // Group players by courts and bench (randomized)
    var groupedPlayers = groupPlayers(players.new, numberOfCourts);

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

// Function to add click event listeners to court cards
function addCardEventListeners() {
    var courtCards = document.querySelectorAll('.court-card');

    courtCards.forEach(function (courtCard) {
        courtCard.addEventListener('click', function () {
            this.classList.toggle('flipped');
        });

        // Add click event listener to the 'Save' button in the score form
        var saveButton = courtCard.querySelector('.btn-primary');
        saveButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the card from flipping when clicking the button
            // Get the scores and update the court card
            var team1Score = courtCard.querySelector('.team1Score').value;
            var team2Score = courtCard.querySelector('.team2Score').value;
            updateCourtCardScores(courtCard, team1Score, team2Score);
            // Toggle the Bootstrap 'flipped' class to go back to the front
            courtCard.classList.toggle('flipped');
        });

        // Add click event listener to the 'Cancel' button in the score form
        var cancelButton = courtCard.querySelector('.btn-secondary');
        cancelButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the card from flipping when clicking the button
            // Toggle the Bootstrap 'flipped' class to go back to the front
            courtCard.classList.toggle('flipped');
        });

        // Prevent card flip when clicking team1ScoreInput
        var team1ScoreInput = courtCard.querySelector('.team1Score');
        team1ScoreInput.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the card from flipping when clicking the input
        });
        var team2ScoreInput = courtCard.querySelector('.team2Score');
        team2ScoreInput.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the card from flipping when clicking the input
        });
    });
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
        cardBody.classList.add('card-body' , 'front');

        // Header with Court number
        var cardHeader = document.createElement('h5');
        cardHeader.classList.add('card-title');
        cardHeader.textContent = 'Court ' + (index + 1);
        cardBody.appendChild(cardHeader);

        // Display Team 1
        cardBody.appendChild(createTeamList('Team 1', court.team1));

        // Display Team 2
        cardBody.appendChild(createTeamList('Team 2', court.team2));

        // Score form container
        var scoreFormContainer = document.createElement('div');
        scoreFormContainer.classList.add('score-form-container', 'card-body', 'back');

        var cardBackHeader = document.createElement('h5');
        cardBackHeader.classList.add('card-title');
        cardBackHeader.textContent = 'Court ' + (index + 1);
        scoreFormContainer.appendChild(cardBackHeader);

        var team1ScoreLabel = document.createElement('label');
        team1ScoreLabel.textContent = 'Team 1 (' + court.team1[0] + ', ...) Score';
        team1ScoreLabel.setAttribute('for', 'team1Score');
        team1ScoreLabel.classList.add('mt-2');
        scoreFormContainer.appendChild(team1ScoreLabel);

        var team1ScoreInput = document.createElement('input');
        team1ScoreInput.setAttribute('type', 'number');
        team1ScoreInput.setAttribute('placeholder', 'Team 1 Score');
        team1ScoreInput.classList.add('form-control', 'team1Score');
        team1ScoreInput.setAttribute('id', 'team1Score');
        scoreFormContainer.appendChild(team1ScoreInput);

        var team2ScoreLabel = document.createElement('label');
        team2ScoreLabel.textContent = 'Team 2 (' + court.team2[0] + ', ...) Score';
        team2ScoreLabel.setAttribute('for', 'team2Score');
        team2ScoreLabel.classList.add('mt-2');
        scoreFormContainer.appendChild(team2ScoreLabel);

        var team2ScoreInput = document.createElement('input');
        team2ScoreInput.setAttribute('type', 'number');
        team2ScoreInput.setAttribute('placeholder', 'Team 2 Score');
        team2ScoreInput.classList.add('form-control', 'team2Score', 'mb-2');
        scoreFormContainer.appendChild(team2ScoreInput);

        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save and Bench Players';
        saveButton.classList.add('btn', 'btn-primary', 'm-2'); 
        scoreFormContainer.appendChild(saveButton);
        
        var cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('btn', 'btn-secondary', 'm-2'); 
        scoreFormContainer.appendChild(cancelButton);

        // Append the score form container to the court card
        courtCard.appendChild(scoreFormContainer);

        // Append the card body to the court card
        courtCard.appendChild(cardBody);

        // Append the court card to the grouped players container
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

    addCardEventListeners();
}

// Function to update the court card with recorded scores (you need to implement this)
function updateCourtCardScores(courtCard, team1Score, team2Score) {
    // Update the court card with the scores
    // ...
    console.log(`Recorded scores for court ${courtCard.dataset.courtIndex}: Team 1 - ${team1Score}, Team 2 - ${team2Score}`);
}

//send players to bench
function benchPlayers(courtIndex){
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
        if(team1Players[0]){console.log(team1Players[0])};
        if(team1Players[1]){console.log(team1Players[1])};
        if(team2Players[0]){console.log(team2Players[0])};
        if(team2Players[1]){console.log(team2Players[1])};
        
    }
}

// Function to record the score and mark the court for the next shuffle
function recordScore(courtIndex) {
    var markedPlayers = {
        courts: [],
        bench: []
    };

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

