class player {
    name;
    score = 0;
    status = 'new'; //new, benched, playing
    constructor(name){
        this.name = name;
    }
}

const players = {
    players : [],
    addPlayer: function(player) {this.players.push(player)},
    getPlayers: function(status) {
        return this.players.filter((player) => player.status == status);
    },
    removePlayers: function(playersList){
        var refreshPlayers = this.players;
        this.players.forEach(function(activeplayer){
            if(!(playersList.find((player) => player == activeplayer.name))){
                refreshPlayers = refreshPlayers.filter((obj) => obj.name !== activeplayer.name);
            }
        }); 
        this.players = refreshPlayers;
    },
    getCount: function(){
        return this.players.length;
    },
    hasPlayer: function(name){
        return this.players.find((player) => player.name == name);
    },
    updateStatus: function(name, status){
        //this.players.find((player) => player.name == name).status = status;
        const player = players.hasPlayer(name);
        if(player){
            player.status = status;
        };
    },
    hasScoresRecorded: function(){
        return this.players.find((player) => player.score > 0);
    },
    updateScores: function(courtCard) {
        if (courtCard) {
            var team1Score = courtCard.querySelector('.team1Score').value;
            var team2Score = courtCard.querySelector('.team2Score').value;
            var team1Players = Array.from(courtCard.querySelectorAll('.team-container:nth-child(2) ul li')).map(function (li) {
                return li.textContent.trim();
            });
            var team2Players = Array.from(courtCard.querySelectorAll('.team-container:nth-child(3) ul li')).map(function (li) {
                return li.textContent.trim();
            });

            const foundplayer1 = this.players.find((player) => player.name == team1Players[0]);
            if(team1Score && foundplayer1){foundplayer1.score += team1Score * 1;};
            const foundplayer2 = this.players.find((player) => player.name == team1Players[1]);
            if(team1Score && foundplayer2){foundplayer2.score += team1Score * 1;};
            const foundplayer3 = this.players.find((player) => player.name == team2Players[0]);
            if(team2Score && foundplayer3){foundplayer3.score += team2Score * 1;};
            const foundplayer4 = this.players.find((player) => player.name == team2Players[1]);
            if(team2Score && foundplayer4){foundplayer4.score += team2Score * 1;};

        }
    }
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
    const gamesPlayed = document.getElementById('gamesPlayed').value * 1 + 1;
    var storeGamesPlayed = document.getElementById('gamesPlayed');
    storeGamesPlayed.value = gamesPlayed;

    var numberOfCourts = document.getElementById('numberOfCourts').value;
    var playerNames = document.getElementById('playerNames').value;
    // Split player names into an array
    var playersList = playerNames.split('\n').map(function (name) {
        return name.trim();
    });

    // Filter out empty names
    playersList = playersList.filter(function (name) {
        return name !== '';
    });

    playersList.forEach(function(listitem){
        if(!players.hasPlayer(listitem)){
            const listplayer = new player(listitem);
            players.addPlayer(listplayer);
        }
    });
    
    players.removePlayers(playersList);

    // Group players by courts and bench
    var groupedPlayers = groupPlayers(numberOfCourts, gamesPlayed);

    if (groupedPlayers){
        // Display grouped players on the page
        displayGroupedPlayers(groupedPlayers);
    };

    addBenchCard();
    
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
function groupPlayers(numberOfCourts, gamesPlayed) {
    const newPlayersArray = players.getPlayers('new');
    newPlayersArray.forEach(function(np){
        players.updateStatus(np.name, "benched");
    });

    if(players.getCount() < 2){
        return;
    }

    var playersArray = players.getPlayers("benched");
    var randomizedPlayers = [];
    
    if(players.hasScoresRecorded()){
        if(playersArray.length < 2){return;};
        
        playersArray.sort((a, b) => {
            return b.score - a.score;
        });

        if(gamesPlayed % 2 == 0){ //if number games played is even then level teams else use sorted list as-is
            const n = playersArray.length;
            let i = 0;
            while (i < Math.floor(n / 2)) {
                randomizedPlayers.push(playersArray[i]);
                i++;
                randomizedPlayers.push(playersArray[i]);
                if (i >= Math.floor(n / 2)){break;};
                i--;
                randomizedPlayers.push(playersArray[n-1-i]);
                if (i >= Math.floor(n / 2)){break;};
                i++;
                randomizedPlayers.push(playersArray[n-1-i]);
                i++;
                if (i >= Math.floor(n / 2)){break;};
            }
            if (n % 2 !== 0) {
                randomizedPlayers.push(playersArray[Math.floor(n / 2)]);
            }
        } else if(gamesPlayed % 3 == 0){
            randomizedPlayers = playersArray.sort(function () {
                return 0.5 - Math.random();
            });
        } else {
            randomizedPlayers = playersArray;
        }
        var usedCourtCount = document.querySelectorAll('.court-card').length;
        numberOfCourts -= usedCourtCount;
    }else{
        playersArray = playersArray.concat(players.getPlayers("playing"));
        randomizedPlayers = playersArray.sort(function () {
            return 0.5 - Math.random();
        });
    };

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
                groupedPlayers.courts[courtIndex].team1.push(player.name);
                players.updateStatus(player.name, 'playing');
            } else {
                groupedPlayers.courts[courtIndex].team2.push(player.name);
                players.updateStatus(player.name, 'playing');
            }
        } else {
            // Assign remaining players to the bench
            groupedPlayers.bench.push(player.name);
            players.updateStatus(player.name, 'benched');
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
            /*var team1Score = courtCard.querySelector('.team1Score').value;
            var team2Score = courtCard.querySelector('.team2Score').value;
            updateCourtCardScores(courtCard, team1Score, team2Score);*/
            players.updateScores(courtCard);
            benchPlayers(courtCard);
            // Toggle the Bootstrap 'flipped' class to go back to the front
            //courtCard.classList.toggle('flipped');
            courtCard.parentNode.removeChild(courtCard);
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
  
    var heldCards = [];
    if(players.hasScoresRecorded()){
        var courtCards = document.querySelectorAll('.court-card');
        courtCards.forEach(function (courtCard) {
            heldCards.push(groupedPlayersContainer.removeChild(courtCard));
        });
    }else{
        groupedPlayersContainer.innerHTML = '';
    };
        
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
        cardHeader.textContent = 'Court';
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

    addCardEventListeners();

    heldCards.forEach(function (courtCard) {
        groupedPlayersContainer.appendChild(courtCard);
    });
}

function addBenchCard(){
    var groupedPlayersContainer = document.getElementById('groupedPlayers');
    var benchCard = document.getElementById('benchcard');
    if (benchCard){
        groupedPlayersContainer.removeChild(benchCard);
    }

    var benchedPlayers = players.getPlayers("benched");

    if (benchedPlayers.length > 0) {
        benchCard = document.createElement('div');
        benchCard.classList.add('card');
        benchCard.setAttribute('id', 'benchcard');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Header for Bench
        var cardHeader = document.createElement('h5');
        cardHeader.classList.add('card-title');
        cardHeader.textContent = 'Bench (total points)';
        cardBody.appendChild(cardHeader);

        // List of players on the bench
        cardBody.appendChild(createBenchedPlayerList(benchedPlayers));

        benchCard.appendChild(cardBody);
        groupedPlayersContainer.appendChild(benchCard);
    }
}

// Function to update the court card with recorded scores (you need to implement this)
function updateCourtCardScores(courtCard, team1Score, team2Score) {
    // Update the court card with the scores
    // ...
    console.log(`Recorded scores for court ${courtCard.dataset.courtIndex}: Team 1 - ${team1Score}, Team 2 - ${team2Score}`);
}

//send players to bench
function benchPlayers(courtCard){
    // Extract players from the displayed court card
    //var courtCard = document.querySelector('.court-card[data-court-index="' + courtIndex + '"]');
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
        if(team1Players[0]){players.updateStatus(team1Players[0], 'benched');};
        if(team1Players[1]){players.updateStatus(team1Players[1], 'benched');};
        if(team2Players[0]){players.updateStatus(team2Players[0], 'benched');};
        if(team2Players[1]){players.updateStatus(team2Players[1], 'benched');};
        addBenchCard();
    }
}

// Function to create a list of players within a card
function createBenchedPlayerList(bplayers) {
    var ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    bplayers.sort((a, b) => {
        return b.score - a.score;
    });

    bplayers.forEach(function (bplayer) {
        var li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = bplayer.name + ' (' + bplayer.score + ')';
        ul.appendChild(li);
    });
    return ul;
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

