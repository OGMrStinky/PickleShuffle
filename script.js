const ContactTable = localforage.createInstance({
    name: "PicklShuffle",
    storeName: "ShuffleTable"
});

class player {
    name;
    score = 0;
    benchTime = 0;
    status = 'new'; //new, benched, playing
    partners = [];
    opponents = [];
    benchTime = 0;
    constructor(name){
        this.name = name;
    };
    addOpponent(opponent) {
        if(opponent){
            let opponentRecord = this.opponents.find(record => record.opponent === opponent);
            if (opponentRecord) {
                opponentRecord.gamesPlayed++;
            } else {
                this.opponents.push({ opponent, gamesPlayed: 1 });
            }
        }
    };
    addPartner(partner){
        if(partner){
            let partnerRecord = this.partners.find(record => record.partner === partner);
            if (partnerRecord){
                partnerRecord.gamesPlayed++;
            } else {
                this.partners.push({ partner, gamesPlayed: 1 });
            }
        }
    };
    pickPartner(availPlayers){
        let pastPartners = this.partners; //get list of past partners

        let leastPartner = { gamesPlayed: Infinity};
        availPlayers.forEach(function(availPlayer){ //loop through avail players
            //check if avail player is past partner
            const pastPartner = pastPartners.find(record => record.partner.name === availPlayer.name);
            if(pastPartner){
                //leastPartner = pastPartner.gamesPlayed < leastPartner.gamesPlayed ? pastPartner : leastPartner;
                if(pastPartner.gamesPlayed < leastPartner.gamesPlayed){
                    leastPartner = {Player: pastPartner.partner, gamesPlayed: pastPartner.gamesPlayed};
                }
            } else{
                leastPartner = {Player: availPlayer, gamesPlayed: 0};
            };
        });

        availPlayers.splice(availPlayers.findIndex(function(player) {return player.name === leastPartner.Player.name}),1);

        return leastPartner.Player;
    };
    pickOpponent(availPlayers){
        let pastPartners = this.opponents; //get list of past opponents
        
        let leastPartner = { gamesPlayed: Infinity};
        availPlayers.forEach(function(availPlayer){ //loop through avail players
            //check if avail player is past partner
            const pastPartner = pastPartners.find(record => record.opponent.name === availPlayer.name);
            if(pastPartner){
                //leastPartner = pastPartner.gamesPlayed < leastPartner.gamesPlayed ? pastPartner : leastPartner;
                if(pastPartner.gamesPlayed < leastPartner.gamesPlayed){
                    leastPartner = {Player: pastPartner.opponent, gamesPlayed: pastPartner.gamesPlayed};
                }
            } else{
                leastPartner = {Player: availPlayer, gamesPlayed: 0};
            };
        });

        availPlayers.splice(availPlayers.findIndex(function(player) {return player.name === leastPartner.Player.name}),1);

        return leastPartner.Player;
    }
/*
        const bands = [
        { name: "Led Zeppelin", year: 1968 },
        { name: "Pink Floyd", year: 1965 },
        { name: "Queen", year: 1970 },
        { name: "The Clash", year: 1976 },
        { name: "The Ramones", year: 1974 },
        { name: "R.E.M.", year: 1980 }, 
        ];

      const earliestBand = bands.reduce((earliestSoFar, band) => {
        return band.year < earliestSoFar.year ? band : earliestSoFar;
      }, { year: Infinity }); // Start with a band in the infinitely distant future
      
      console.log(earliestBand.name); // outputs “Pink Floyd” 
      */
}

const players = {
    players : [],
    addPlayer: function(player) {this.players.push(player)},
    getPlayers: function(status) {
        return this.players.filter((player) => player.status == status);
    },
    removePlayers: function(playersList){
        let refreshPlayers = this.players;
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
            let team1Score = courtCard.querySelector('.team1Score').value;
            let team2Score = courtCard.querySelector('.team2Score').value;
            let team1Players = Array.from(courtCard.querySelectorAll('.team-container:nth-child(2) ul li')).map(function (li) {
                return li.textContent.trim();
            });
            let team2Players = Array.from(courtCard.querySelectorAll('.team-container:nth-child(3) ul li')).map(function (li) {
                return li.textContent.trim();
            });

            const team1player1 = this.players.find((player) => player.name == team1Players[0]);
            const team1player2 = this.players.find((player) => player.name == team1Players[1]);
            const team2player1 = this.players.find((player) => player.name == team2Players[0]);
            const team2player2 = this.players.find((player) => player.name == team2Players[1]);
            
            if(team1Score){
                if(team1player1){
                    team1player1.score += team1Score * 1;
                };
                if(team1player2){
                    team1player2.score += team1Score * 1;
                };
            };
            if(team2Score){
                if(team2player1){
                    team2player1.score += team2Score * 1;
                };
                if(team2player2){
                    team2player2.score += team2Score * 1;
                };
            };
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

    //if no scores recorded then bench all players for next shuffle
    if(!players.hasScoresRecorded()){
        var courtCards = document.querySelectorAll('.court-card');
        courtCards.forEach(function (courtCard) {
            benchPlayers(courtCard);
            courtCard.parentNode.removeChild(courtCard);
        });
    }

    // Group players by courts and bench
    var groupedPlayers = groupPlayers(numberOfCourts, gamesPlayed);

    if (groupedPlayers){
        // Display grouped players on the page
        displayGroupedPlayers(groupedPlayers);
    };

    addBenchCard();

    //update benchTime for each benched player
    let benchedPlayers = players.getPlayers("benched");
    benchedPlayers.forEach(function (bplayer) {
        bplayer.benchTime = Date.now();
    });

    ContactTable.setItem('players', players.players).then(function (value) {
        // Do other things once the value has been saved.
        console.log(value);
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err); 
    });
    
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

    var playersArray = players.getPlayers("benched");
    if(playersArray.length < 2){return;};

    //sorty by benchTime so those with most bench time get picked first
    playersArray.sort((a, b) => {
        return b.benchTime - a.benchTime;
    });

    //setup object for grouping
    var groupedPlayers = {
        courts: [],
        bench: []
    };

    //adjust numberOfCourts to reflect counts in use
    var usedCourtCount = document.querySelectorAll('.court-card').length;
    numberOfCourts -= usedCourtCount;

    for (let index = 0; index < numberOfCourts; index++) {
        groupedPlayers.courts[index] = {
            team1: [],
            team2: []
        };
        
        if(playersArray.length > 3){
            const seedPlayer = playersArray[0];
            //add first player from list
            groupedPlayers.courts[index].team1.push(seedPlayer.name);
            //update status of player to playing
            players.updateStatus(seedPlayer.name, 'Playing');
            //remove player from list
            playersArray.splice(playersArray.findIndex(function(player) {return player.name === seedPlayer.name}),1);
            //pick partner for seed player
            const team1Partner = seedPlayer.pickPartner(playersArray);
            groupedPlayers.courts[index].team1.push(team1Partner.name);
            players.updateStatus(team1Partner.name, 'Playing');
            //pick opponent for seed player's partner
            let team2Partner = team1Partner.pickOpponent(playersArray);
            groupedPlayers.courts[index].team2.push(team2Partner.name);
            players.updateStatus(team2Partner.name, 'Playing');
            //pick partner for seed player's partner's opponnent
            team2Partner = team2Partner.pickPartner(playersArray);
            groupedPlayers.courts[index].team2.push(team2Partner.name);
            players.updateStatus(team2Partner.name, 'Playing');
        } else if(playersArray.length >1){
            const seedPlayer = playersArray[0];
            groupedPlayers.courts[index].team1.push(seedPlayer.name);
            players.updateStatus(seedPlayer.name, 'Playing');
            playersArray.splice(playersArray.findIndex(function(player) {return player.name === seedPlayer.name}),1);
            //pick opponent for seed player first because number of available players in list is less than 3
            let Partner = seedPlayer.pickOpponent(playersArray);
            groupedPlayers.courts[index].team2.push(Partner.name);
            players.updateStatus(Partner.name, 'Playing');
            if(playersArray.length == 0){break};
            //pick partner for seed player
            Partner = seedPlayer.pickPartner(playersArray);
            groupedPlayers.courts[index].team1.push(Partner.name);
            players.updateStatus(Partner.name, 'Playing');
            if(playersArray.length == 0){break};
            //pick partner for opponent though shouldn't ever happen since it requires 4 available players
            Partner = Partner.pickOpponent(playersArray);
            groupedPlayers.courts[index].team2.push(Partner.name);
            players.updateStatus(Partner.name, 'Playing');
        } else {
            break;
        };
        
    }
   
    for (let index = 0; index < playersArray.length - 1; index++) {
        groupedPlayers.bench.push(playersArray[index].name);
    };

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
    let groupedPlayersContainer = document.getElementById('groupedPlayers');
    let benchCard = document.getElementById('benchcard');
    if (benchCard){
        groupedPlayersContainer.removeChild(benchCard);
    }

    let benchedPlayers = players.getPlayers("benched");

    if (benchedPlayers.length > 0) {
        benchCard = document.createElement('div');
        benchCard.classList.add('card');
        benchCard.setAttribute('id', 'benchcard');

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Header for Bench
        let cardHeader = document.createElement('h5');
        cardHeader.classList.add('card-title');
        cardHeader.textContent = 'Bench (total points)';
        cardBody.appendChild(cardHeader);

        // List of players on the bench
        cardBody.appendChild(createBenchedPlayerList(benchedPlayers));

        benchCard.appendChild(cardBody);
        groupedPlayersContainer.appendChild(benchCard);
    }
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

        const team1player1 = players.hasPlayer(team1Players[0]);
        const team1player2 = players.hasPlayer(team1Players[1]);
        const team2player1 = players.hasPlayer(team2Players[0]);
        const team2player2 = players.hasPlayer(team2Players[1]);

        if(team1player1){
            players.updateStatus(team1Players[0], 'benched');
            team1player1.addOpponent(team2player1);
            team1player1.addOpponent(team2player2);
            team1player1.addPartner(team1player2);
        };
        if(team1player2){
            players.updateStatus(team1Players[1], 'benched');
            team1player2.addOpponent(team2player1);
            team1player2.addOpponent(team2player2);
            team1player2.addPartner(team1player1);
        };
        if(team2player1){
            players.updateStatus(team2Players[0], 'benched');
            team2player1.addOpponent(team1player1);
            team2player1.addOpponent(team1player2);
            team2player1.addPartner(team2player2);
        };
        if(team2player2){
            players.updateStatus(team2Players[1], 'benched');
            team2player2.addOpponent(team1player1);
            team2player2.addOpponent(team1player2);
            team2player2.addPartner(team2player1);
        };
        
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

