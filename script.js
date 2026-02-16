// ===========================
// GAME STATE OBJECT
// Store all match-related data
// ===========================
const matchState = {
    // Team 1 data
    team1: {
        name: '',
        runs: 0,
        wickets: 0,
        balls: 0,
        ballHistory: []
    },
    // Team 2 data
    team2: {
        name: '',
        runs: 0,
        wickets: 0,
        balls: 0,
        ballHistory: []
    },
    
    // Match settings
    oversPerInnings: 0,
    totalBalls: 0,
    
    // Match state
    currentInnings: 1, // 1 or 2
    battingTeam: '', // 'team1' or 'team2'
    bowlingTeam: '', // 'team1' or 'team2'
    
    // Toss state
    tossCallingTeam: '', // 'team1' or 'team2'
    tossCall: '', // 'heads' or 'tails'
    tossResult: '', // 'heads' or 'tails'
    tossWinner: '', // 'team1' or 'team2'
    
    // Current ball
    selectedRuns: null,
    
    // Match status
    matchEnded: false
};

// ===========================
// DOM ELEMENTS
// Get references to all HTML elements
// ===========================
const screens = {
    setup: document.getElementById('setupScreen'),
    toss: document.getElementById('tossScreen'),
    liveMatch: document.getElementById('liveMatchScreen'),
    result: document.getElementById('resultScreen')
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Switch between different screens
 * @param {string} screenName - Name of the screen to display
 */
function switchScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

/**
 * Calculate overs from total balls
 * Returns format: "Overs.Balls" (e.g., "4.3")
 * @param {number} balls - Total number of balls
 * @returns {string} Overs in format "X.Y"
 */
function calculateOvers(balls) {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
}

/**
 * Calculate remaining balls for current innings
 * @param {number} currentBalls - Balls bowled so far
 * @returns {number} Remaining balls
 */
function calculateRemainingBalls(currentBalls) {
    return matchState.totalBalls - currentBalls;
}

// ===========================
// SCREEN 1: SETUP HANDLERS
// ===========================

/**
 * Start match button handler
 * Validates inputs and moves to toss screen
 */
document.getElementById('startMatchBtn').addEventListener('click', function() {
    // Get input values
    const team1Name = document.getElementById('team1Name').value.trim();
    const team2Name = document.getElementById('team2Name').value.trim();
    const overs = parseInt(document.getElementById('oversPerInnings').value);

    // Validate team 1 name
    if (!team1Name) {
        alert('Please enter Team 1 name');
        return;
    }

    // Validate team 2 name
    if (!team2Name) {
        alert('Please enter Team 2 name');
        return;
    }

    // Validate overs
    if (!overs || overs <= 0) {
        alert('Please enter a valid number of overs (positive number)');
        return;
    }

    // Save match settings
    matchState.team1.name = team1Name;
    matchState.team2.name = team2Name;
    matchState.oversPerInnings = overs;
    matchState.totalBalls = overs * 6; // 6 balls per over

    // Update toss screen with team names
    document.getElementById('tossTeam1Name').textContent = team1Name;
    document.getElementById('tossTeam2Name').textContent = team2Name;

    // Go to toss screen
    switchScreen('toss');
});

// ===========================
// SCREEN 2: TOSS HANDLERS
// ===========================

/**
 * Step 1: Team selection for toss call
 * Team 1 selected to call the toss
 */
document.getElementById('selectTeam1').addEventListener('click', function() {
    matchState.tossCallingTeam = 'team1';
    this.classList.add('selected');
    document.getElementById('selectTeam2').classList.remove('selected');
    
    // Move to call selection after a short delay
    setTimeout(() => {
        document.getElementById('tossTeamSelection').classList.add('hidden');
        document.getElementById('tossCallSelection').classList.remove('hidden');
        document.getElementById('callingTeamName').textContent = matchState.team1.name;
    }, 300);
});

/**
 * Team 2 selected to call the toss
 */
document.getElementById('selectTeam2').addEventListener('click', function() {
    matchState.tossCallingTeam = 'team2';
    this.classList.add('selected');
    document.getElementById('selectTeam1').classList.remove('selected');
    
    // Move to call selection after a short delay
    setTimeout(() => {
        document.getElementById('tossTeamSelection').classList.add('hidden');
        document.getElementById('tossCallSelection').classList.remove('hidden');
        document.getElementById('callingTeamName').textContent = matchState.team2.name;
    }, 300);
});

/**
 * Step 2: Heads or Tails call
 * Heads called
 */
document.getElementById('callHeads').addEventListener('click', function() {
    matchState.tossCall = 'heads';
    performToss();
});

/**
 * Tails called
 */
document.getElementById('callTails').addEventListener('click', function() {
    matchState.tossCall = 'tails';
    performToss();
});

/**
 * Perform the toss - randomly generate result
 * Determines toss winner based on call
 */
function performToss() {
    // Randomly generate toss result (50% chance for each)
    const random = Math.random();
    matchState.tossResult = random < 0.5 ? 'heads' : 'tails';
    
    // Determine toss winner
    if (matchState.tossCall === matchState.tossResult) {
        // Calling team won
        matchState.tossWinner = matchState.tossCallingTeam;
    } else {
        // Other team won
        matchState.tossWinner = matchState.tossCallingTeam === 'team1' ? 'team2' : 'team1';
    }

    // Display toss result
    displayTossResult();
}

/**
 * Display toss result and winner
 * Shows which team won and asks them to choose bat/bowl
 */
function displayTossResult() {
    // Format result text (capitalize first letter)
    const resultText = matchState.tossResult.charAt(0).toUpperCase() + matchState.tossResult.slice(1);
    
    // Get winner team name
    const winnerName = matchState.tossWinner === 'team1' ? matchState.team1.name : matchState.team2.name;

    // Update display
    document.getElementById('tossOutcome').textContent = `It's ${resultText}!`;
    document.getElementById('tossWinner').textContent = `${winnerName} won the toss!`;
    document.getElementById('winningTeamName').textContent = winnerName;

    // Hide call selection, show result
    document.getElementById('tossCallSelection').classList.add('hidden');
    document.getElementById('tossResultSection').classList.remove('hidden');
}

/**
 * Step 3: Toss winner chooses to bat or bowl
 * Toss winner chooses to bat first
 */
document.getElementById('chooseBat').addEventListener('click', function() {
    matchState.battingTeam = matchState.tossWinner;
    matchState.bowlingTeam = matchState.tossWinner === 'team1' ? 'team2' : 'team1';
    startMatch();
});

/**
 * Toss winner chooses to bowl first (other team bats)
 */
document.getElementById('chooseBowl').addEventListener('click', function() {
    matchState.bowlingTeam = matchState.tossWinner;
    matchState.battingTeam = matchState.tossWinner === 'team1' ? 'team2' : 'team1';
    startMatch();
});

// ===========================
// SCREEN 3: LIVE MATCH
// ===========================

/**
 * Start the match after toss
 * Initialize scoreboard and move to live match screen
 */
function startMatch() {
    // Update team display names
    document.getElementById('team1DisplayName').textContent = matchState.team1.name;
    document.getElementById('team2DisplayName').textContent = matchState.team2.name;

    // Update scoreboard
    updateScoreboard();
    
    // Go to live match screen
    switchScreen('liveMatch');
}

/**
 * Runs selector buttons
 * Allow user to select runs scored on a ball
 */
const runButtons = document.querySelectorAll('.run-btn');
runButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove selected class from all buttons
        runButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Save selected runs
        matchState.selectedRuns = parseInt(this.getAttribute('data-runs'));
    });
});

/**
 * Record ball button handler
 * Main function to record a ball
 */
document.getElementById('recordBallBtn').addEventListener('click', recordBall);

/**
 * Main function to record a ball
 * Updates scores, wickets, and ball count
 */
function recordBall() {
    // Validate runs selection
    if (matchState.selectedRuns === null) {
        alert('Please select runs scored (0-6)');
        return;
    }

    // Get current batting team
    const battingTeam = matchState[matchState.battingTeam];

    // Check if innings should be over (all wickets down)
    if (battingTeam.wickets >= 10) {
        alert('All out! Innings is over. Click "End Innings"');
        return;
    }

    // Check if innings should be over (overs completed)
    if (battingTeam.balls >= matchState.totalBalls) {
        alert('Overs completed! Innings is over. Click "End Innings"');
        return;
    }

    // Get wicket status
    const isWicket = document.getElementById('wicketCheck').checked;

    // Update batting team stats
    battingTeam.runs += matchState.selectedRuns;
    battingTeam.balls += 1;

    if (isWicket) {
        battingTeam.wickets += 1;
    }

    // Add to ball history
    battingTeam.ballHistory.push({
        runs: matchState.selectedRuns,
        isWicket: isWicket
    });

    // Reset inputs
    runButtons.forEach(btn => btn.classList.remove('selected'));
    matchState.selectedRuns = null;
    document.getElementById('wicketCheck').checked = false;

    // Update UI
    updateScoreboard();
    updateBallHistory();

    // Check innings end conditions
    checkInningsEnd();

    // Check match end (second innings only)
    if (matchState.currentInnings === 2) {
        checkMatchEnd();
    }
}

/**
 * Update scoreboard display
 * Updates all score, overs, balls, and remaining stats
 */
function updateScoreboard() {
    // Update Team 1 display
    document.getElementById('team1Runs').textContent = `${matchState.team1.runs}/${matchState.team1.wickets}`;
    document.getElementById('team1Overs').textContent = calculateOvers(matchState.team1.balls);
    document.getElementById('team1Balls').textContent = matchState.team1.balls;
    
    // Show remaining balls only for batting team
    if (matchState.battingTeam === 'team1') {
        document.getElementById('team1Remaining').textContent = calculateRemainingBalls(matchState.team1.balls);
    } else {
        document.getElementById('team1Remaining').textContent = '-';
    }

    // Update Team 2 display
    document.getElementById('team2Runs').textContent = `${matchState.team2.runs}/${matchState.team2.wickets}`;
    document.getElementById('team2Overs').textContent = calculateOvers(matchState.team2.balls);
    document.getElementById('team2Balls').textContent = matchState.team2.balls;
    
    // Show remaining balls only for batting team
    if (matchState.battingTeam === 'team2') {
        document.getElementById('team2Remaining').textContent = calculateRemainingBalls(matchState.team2.balls);
    } else {
        document.getElementById('team2Remaining').textContent = '-';
    }

    // Update batting badges
    if (matchState.battingTeam === 'team1') {
        document.getElementById('team1Badge').classList.remove('hidden');
        document.getElementById('team2Badge').classList.add('hidden');
        document.getElementById('team1Score').classList.add('batting');
        document.getElementById('team2Score').classList.remove('batting');
    } else {
        document.getElementById('team1Badge').classList.add('hidden');
        document.getElementById('team2Badge').classList.remove('hidden');
        document.getElementById('team1Score').classList.remove('batting');
        document.getElementById('team2Score').classList.add('batting');
    }

    // Update innings info and target
    if (matchState.currentInnings === 1) {
        // First innings
        document.getElementById('inningsInfo').textContent = 'First Innings';
        document.getElementById('targetDisplay').classList.add('hidden');
    } else {
        // Second innings - show target
        document.getElementById('inningsInfo').textContent = 'Second Innings - Chase';
        
        const defendingTeam = matchState.battingTeam === 'team1' ? matchState.team2 : matchState.team1;
        const target = defendingTeam.runs + 1;
        const remainingBalls = matchState.totalBalls - matchState[matchState.battingTeam].balls;
        
        document.getElementById('targetRuns').textContent = target;
        document.getElementById('targetBalls').textContent = remainingBalls;
        document.getElementById('targetDisplay').classList.remove('hidden');
    }

    // Update progress bar
    const currentTeam = matchState[matchState.battingTeam];
    const progress = (currentTeam.balls / matchState.totalBalls) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

/**
 * Update ball history for current over
 * Shows last 6 balls (current over)
 */
function updateBallHistory() {
    const battingTeam = matchState[matchState.battingTeam];
    const currentOver = battingTeam.ballHistory.slice(-6); // Last 6 balls

    // Clear container
    const container = document.getElementById('ballsContainer');
    container.innerHTML = '';

    // If no balls bowled yet
    if (currentOver.length === 0) {
        container.innerHTML = '<span class="empty-balls">No balls bowled yet</span>';
        return;
    }

    // Create ball elements
    currentOver.forEach(ball => {
        const ballDiv = document.createElement('div');
        ballDiv.classList.add('ball');

        if (ball.isWicket) {
            // Wicket ball
            ballDiv.classList.add('wicket');
            ballDiv.textContent = 'W';
        } else if (ball.runs === 0) {
            // Dot ball
            ballDiv.classList.add('dot');
            ballDiv.textContent = '•';
        } else {
            // Runs scored
            ballDiv.classList.add('runs');
            ballDiv.textContent = ball.runs;
        }

        container.appendChild(ballDiv);
    });
}

/**
 * Check if innings should end
 * Checks for all out or overs completed
 * @returns {boolean} True if innings should end
 */
function checkInningsEnd() {
    const battingTeam = matchState[matchState.battingTeam];

    // Check if all wickets down
    if (battingTeam.wickets >= 10) {
        alert(`${battingTeam.name} is all out! Click "End Innings" to continue.`);
        document.getElementById('recordBallBtn').disabled = true;
        return true;
    }

    // Check if overs completed
    if (battingTeam.balls >= matchState.totalBalls) {
        alert(`Overs completed! Click "End Innings" to continue.`);
        document.getElementById('recordBallBtn').disabled = true;
        return true;
    }

    return false;
}

/**
 * End innings button handler
 * Switches innings or ends match
 */
document.getElementById('endInningsBtn').addEventListener('click', function() {
    if (matchState.currentInnings === 1) {
        // Switch to second innings
        matchState.currentInnings = 2;
        matchState.battingTeam = matchState.battingTeam === 'team1' ? 'team2' : 'team1';
        matchState.bowlingTeam = matchState.bowlingTeam === 'team1' ? 'team2' : 'team1';

        // Enable record button
        document.getElementById('recordBallBtn').disabled = false;

        // Update UI
        updateScoreboard();
        updateBallHistory();

        const battingTeamName = matchState[matchState.battingTeam].name;
        alert(`Second innings starts! ${battingTeamName} is batting now.`);
    } else {
        // Match ends
        showMatchResult();
    }
});

/**
 * Check if match should end (second innings)
 * Checks if chasing team has won
 */
function checkMatchEnd() {
    const chasingTeam = matchState[matchState.battingTeam];
    const defendingTeam = matchState.battingTeam === 'team1' ? matchState.team2 : matchState.team1;

    // Check if chasing team has won (exceeded target)
    if (chasingTeam.runs > defendingTeam.runs) {
        matchState.matchEnded = true;
        showMatchResult();
    }
}

/**
 * Calculate and display match result
 * Determines winner and shows result screen
 */
function showMatchResult() {
    matchState.matchEnded = true;

    const team1 = matchState.team1;
    const team2 = matchState.team2;

    let winnerText = '';
    let matchSummaryHtml = '';

    // Determine winner
    if (team1.runs > team2.runs) {
        // Team 1 won
        const margin = team1.runs - team2.runs;
        winnerText = `${team1.name} won by ${margin} run${margin > 1 ? 's' : ''}!`;
    } else if (team2.runs > team1.runs) {
        // Team 2 won
        const wicketsRemaining = 10 - team2.wickets;
        winnerText = `${team2.name} won by ${wicketsRemaining} wicket${wicketsRemaining > 1 ? 's' : ''}!`;
    } else {
        // Match tied
        winnerText = 'Match Tied!';
    }

    // Create match summary
    matchSummaryHtml = `
        <strong>${team1.name}:</strong> ${team1.runs}/${team1.wickets} 
        (${calculateOvers(team1.balls)} overs)<br><br>
        <strong>${team2.name}:</strong> ${team2.runs}/${team2.wickets} 
        (${calculateOvers(team2.balls)} overs)
    `;

    // Update result screen
    document.getElementById('winnerText').textContent = winnerText;
    document.getElementById('matchSummary').innerHTML = matchSummaryHtml;

    // Show result screen
    switchScreen('result');
}

/**
 * Reset match button handler
 * Reloads the page to start fresh
 */
document.getElementById('resetMatchBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the match? All progress will be lost.')) {
        location.reload();
    }
});

/**
 * New match button handler (on result screen)
 * Reloads the page to start a new match
 */
document.getElementById('newMatchBtn').addEventListener('click', function() {
    location.reload();
});
