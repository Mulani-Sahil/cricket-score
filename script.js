// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
const state = {
  team1: { name: '', runs: 0, wickets: 0, balls: 0, extras: 0, ballHistory: [] },
  team2: { name: '', runs: 0, wickets: 0, balls: 0, extras: 0, ballHistory: [] },
  oversPerInnings: 0,
  totalBalls: 0,
  currentInnings: 1,
  battingTeam: '',   // 'team1' | 'team2'
  bowlingTeam: '',
  tossCallingTeam: '',
  tossWinner: '',
  tossCall: '',
  tossResult: '',
  selectedRuns: null,
  deliveryType: 'normal', // 'normal' | 'wide' | 'noball'
  wicketChecked: false,
  matchEnded: false
};

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
const $ = id => document.getElementById(id);
const screens = ['setupScreen', 'tossScreen', 'liveScreen', 'resultScreen'];

function showScreen(name) {
  screens.forEach(s => document.getElementById(s).classList.remove('active'));
  $(name).classList.add('active');
}

function toOvers(balls) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function remainingBalls(balls) {
  return state.totalBalls - balls;
}

function bat() {
  return state[state.battingTeam];
}

// ═══════════════════════════════════════════════
// SETUP SCREEN
// ═══════════════════════════════════════════════
$('startMatchBtn').addEventListener('click', () => {
  const n1 = $('team1Name').value.trim();
  const n2 = $('team2Name').value.trim();
  const ov = parseInt($('oversPerInnings').value);

  if (!n1) return alert('Please enter Team 1 name');
  if (!n2) return alert('Please enter Team 2 name');
  if (!ov || ov < 1) return alert('Please enter a valid number of overs');

  state.team1.name = n1;
  state.team2.name = n2;
  state.oversPerInnings = ov;
  state.totalBalls = ov * 6;

  $('tossT1Name').textContent = n1;
  $('tossT2Name').textContent = n2;
  showScreen('tossScreen');
});

// ═══════════════════════════════════════════════
// TOSS SCREEN — Step 1: Select calling team
// ═══════════════════════════════════════════════
function selectTossTeam(t) {
  state.tossCallingTeam = t;
  $('tossTeamSel').classList.add('hidden');
  $('callingName').textContent = state[t].name;
  $('tossCallSel').classList.remove('hidden');
}

$('selT1').addEventListener('click', () => selectTossTeam('team1'));
$('selT2').addEventListener('click', () => selectTossTeam('team2'));

// ═══════════════════════════════════════════════
// TOSS SCREEN — Step 2: Heads or Tails call
// ═══════════════════════════════════════════════
function doCall(call) {
  state.tossCall = call;
  state.tossResult = Math.random() < 0.5 ? 'heads' : 'tails';
  state.tossWinner = state.tossCall === state.tossResult
    ? state.tossCallingTeam
    : (state.tossCallingTeam === 'team1' ? 'team2' : 'team1');

  // Show coin flip overlay
  const overlay = $('coinOverlay');
  const coinEl  = $('coin');

  // Reset state
  overlay.classList.remove('show-result');
  coinEl.className = 'coin';
  $('flipMsg').style.display = 'block';
  overlay.classList.add('active');

  // Trigger flip animation after brief delay
  setTimeout(() => {
    coinEl.classList.add(state.tossResult === 'heads' ? 'result-heads' : 'result-tails');
  }, 100);

  // After flip completes, reveal result
  setTimeout(() => {
    const winner = state[state.tossWinner].name;
    const res = state.tossResult.charAt(0).toUpperCase() + state.tossResult.slice(1);
    $('flipMsg').style.display = 'none';
    $('coinResultLabel').textContent = `It's ${res}!`;
    $('coinResultSub').textContent = `${winner} won the toss!`;
    overlay.classList.add('show-result');
  }, 2200);
}

$('callHeads').addEventListener('click', () => doCall('heads'));
$('callTails').addEventListener('click', () => doCall('tails'));

// ═══════════════════════════════════════════════
// COIN OVERLAY — Continue button
// ═══════════════════════════════════════════════
$('coinContinueBtn').addEventListener('click', () => {
  const overlay = $('coinOverlay');
  overlay.classList.remove('active', 'show-result');

  const winner = state[state.tossWinner].name;
  const res = state.tossResult.charAt(0).toUpperCase() + state.tossResult.slice(1);

  $('tossOutcomeText').textContent = `It's ${res}!`;
  $('tossWinnerText').textContent = `${winner} won the toss!`;
  $('tossWinnerChooseName').textContent = winner;
  $('tossCallSel').classList.add('hidden');
  $('tossResult').classList.remove('hidden');
});

// ═══════════════════════════════════════════════
// TOSS SCREEN — Step 3: Bat or Bowl choice
// ═══════════════════════════════════════════════
$('chooseBat').addEventListener('click', () => {
  state.battingTeam = state.tossWinner;
  state.bowlingTeam = state.tossWinner === 'team1' ? 'team2' : 'team1';
  startLive();
});

$('chooseBowl').addEventListener('click', () => {
  state.bowlingTeam = state.tossWinner;
  state.battingTeam = state.tossWinner === 'team1' ? 'team2' : 'team1';
  startLive();
});

// ═══════════════════════════════════════════════
// LIVE MATCH — Start
// ═══════════════════════════════════════════════
function startLive() {
  $('s1Name').textContent = state.team1.name;
  $('s2Name').textContent = state.team2.name;
  updateUI();
  showScreen('liveScreen');
}

// ═══════════════════════════════════════════════
// LIVE MATCH — Delivery type buttons
// ═══════════════════════════════════════════════
['delNormal', 'delWide', 'delNoball'].forEach(id => {
  $(id).addEventListener('click', () => {
    state.deliveryType = $(id).dataset.type;

    // Update button styles
    ['delNormal', 'delWide', 'delNoball'].forEach(b => {
      $(b).classList.remove('active-normal', 'active-wide', 'active-noball');
    });
    const cls = state.deliveryType === 'normal' ? 'active-normal'
              : state.deliveryType === 'wide'   ? 'active-wide'
              : 'active-noball';
    $(id).classList.add(cls);

    // Show/hide info banners
    $('wideInfo').classList.toggle('show', state.deliveryType === 'wide');
    $('noballInfo').classList.toggle('show', state.deliveryType === 'noball');

    // Wicket rules per delivery type
    const wicketRow = $('wicketRow');
    if (state.deliveryType === 'wide') {
      wicketRow.classList.add('disabled');
      state.wicketChecked = false;
      wicketRow.classList.remove('checked');
      $('wicketNote').textContent = 'Not allowed on wide';
    } else if (state.deliveryType === 'noball') {
      $('wicketNote').textContent = 'Run out only';
      wicketRow.classList.remove('disabled');
    } else {
      $('wicketNote').textContent = '';
      wicketRow.classList.remove('disabled');
    }
  });
});

// ═══════════════════════════════════════════════
// LIVE MATCH — Run chips
// ═══════════════════════════════════════════════
document.querySelectorAll('.run-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.run-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    state.selectedRuns = parseInt(chip.dataset.r);
  });
});

// ═══════════════════════════════════════════════
// LIVE MATCH — Wicket toggle
// ═══════════════════════════════════════════════
$('wicketRow').addEventListener('click', () => {
  if ($('wicketRow').classList.contains('disabled')) return;
  state.wicketChecked = !state.wicketChecked;
  $('wicketRow').classList.toggle('checked', state.wicketChecked);
});

// ═══════════════════════════════════════════════
// LIVE MATCH — Record ball
// ═══════════════════════════════════════════════
$('recordBtn').addEventListener('click', recordBall);

function recordBall() {
  if (state.selectedRuns === null) return alert('Please select runs scored');

  const team = bat();
  const isWide   = state.deliveryType === 'wide';
  const isNoball = state.deliveryType === 'noball';
  const isExtra  = isWide || isNoball;

  // 1 penalty run for wide or no ball, plus any runs scored off bat
  const penaltyRun = isExtra ? 1 : 0;
  const totalRuns  = state.selectedRuns + penaltyRun;

  // Wide and no-ball deliveries do NOT count toward the over
  const countsAsBall = !isExtra;

  // Wicket not allowed on a wide
  const isWicket = state.wicketChecked && !isWide;

  // Update team stats
  team.runs    += totalRuns;
  team.extras  += penaltyRun;
  if (isWicket)      team.wickets += 1;
  if (countsAsBall)  team.balls   += 1;

  // Build ball label + class for history display
  let ballLabel, ballClass;
  if (isWide) {
    ballLabel = state.selectedRuns > 0 ? `Wd+${state.selectedRuns}` : 'Wd';
    ballClass = 'wide';
  } else if (isNoball) {
    ballLabel = state.selectedRuns > 0 ? `NB+${state.selectedRuns}` : 'NB';
    ballClass = 'noball';
  } else if (isWicket) {
    ballLabel = state.selectedRuns > 0 ? `W+${state.selectedRuns}` : 'W';
    ballClass = 'wicket';
  } else if (state.selectedRuns === 0) {
    ballLabel = '•';
    ballClass = 'dot';
  } else if (state.selectedRuns === 6) {
    ballLabel = '6';
    ballClass = 'six';
  } else if (state.selectedRuns === 4) {
    ballLabel = '4';
    ballClass = 'four';
  } else {
    ballLabel = String(state.selectedRuns);
    ballClass = 'runs';
  }

  team.ballHistory.push({ label: ballLabel, cls: ballClass, countsAsBall });

  // Reset inputs
  document.querySelectorAll('.run-chip').forEach(c => c.classList.remove('selected'));
  state.selectedRuns  = null;
  state.wicketChecked = false;
  $('wicketRow').classList.remove('checked');

  // Reset delivery type back to Normal
  state.deliveryType = 'normal';
  ['delNormal', 'delWide', 'delNoball'].forEach(b => $(b).classList.remove('active-normal', 'active-wide', 'active-noball'));
  $('delNormal').classList.add('active-normal');
  $('wideInfo').classList.remove('show');
  $('noballInfo').classList.remove('show');
  $('wicketRow').classList.remove('disabled');
  $('wicketNote').textContent = '';

  updateUI();

  if (checkInningsEnd()) return;
  if (state.currentInnings === 2) checkMatchEnd();
}

// ═══════════════════════════════════════════════
// LIVE MATCH — Innings end check
// ═══════════════════════════════════════════════
function checkInningsEnd() {
  const team = bat();
  if (team.wickets >= 10) {
    $('recordBtn').disabled = true;
    showToast(`${team.name} all out! End the innings to continue.`);
    return true;
  }
  if (team.balls >= state.totalBalls) {
    $('recordBtn').disabled = true;
    showToast('Overs complete! End the innings to continue.');
    return true;
  }
  return false;
}

// ═══════════════════════════════════════════════
// LIVE MATCH — Match end check (2nd innings)
// ═══════════════════════════════════════════════
function checkMatchEnd() {
  const chasers   = bat();
  const defenders = state.battingTeam === 'team1' ? state.team2 : state.team1;
  if (chasers.runs > defenders.runs) {
    showResult();
  }
}

// ═══════════════════════════════════════════════
// LIVE MATCH — Update all UI elements
// ═══════════════════════════════════════════════
function updateUI() {
  // Scores
  $('s1Score').textContent  = `${state.team1.runs}/${state.team1.wickets}`;
  $('s2Score').textContent  = `${state.team2.runs}/${state.team2.wickets}`;
  $('s1Overs').textContent  = toOvers(state.team1.balls);
  $('s2Overs').textContent  = toOvers(state.team2.balls);
  $('s1Extras').textContent = state.team1.extras;
  $('s2Extras').textContent = state.team2.extras;

  // Remaining balls
  if (state.battingTeam === 'team1') {
    $('s1Remaining').textContent = remainingBalls(state.team1.balls);
    $('s2Remaining').textContent = '—';
  } else {
    $('s2Remaining').textContent = remainingBalls(state.team2.balls);
    $('s1Remaining').textContent = '—';
  }

  // Batting card highlight
  $('scoreCard1').classList.toggle('batting', state.battingTeam === 'team1');
  $('scoreCard2').classList.toggle('batting', state.battingTeam === 'team2');

  // Innings label & target strip
  if (state.currentInnings === 1) {
    $('inningsBadge').textContent = 'First Innings';
    $('targetStrip').classList.remove('show');
  } else {
    $('inningsBadge').textContent = 'Second Innings — Chase';
    const def      = state.battingTeam === 'team1' ? state.team2 : state.team1;
    const chas     = bat();
    const runsNeed = (def.runs + 1) - chas.runs;
    const ballsLeft = remainingBalls(chas.balls);
    $('tgtRuns').textContent  = runsNeed > 0 ? runsNeed : 0;
    $('tgtBalls').textContent = ballsLeft;
    $('targetStrip').classList.add('show');
  }

  // Progress bar (based on legal balls bowled)
  const team = bat();
  $('overFill').style.width = Math.min(100, (team.balls / state.totalBalls) * 100) + '%';

  // Ball history — show last 8 deliveries
  const container = $('ballsRow');
  container.innerHTML = '';
  const recent = team.ballHistory.slice(-8);

  if (recent.length === 0) {
    container.innerHTML = '<span class="no-balls-msg">No balls bowled yet</span>';
  } else {
    recent.forEach(b => {
      const el = document.createElement('div');
      el.className = `ball-chip ${b.cls}`;
      el.textContent = b.label;
      container.appendChild(el);
    });
  }
}

// ═══════════════════════════════════════════════
// LIVE MATCH — End innings button
// ═══════════════════════════════════════════════
$('endInningsBtn').addEventListener('click', () => {
  if (state.currentInnings === 1) {
    // Switch to second innings
    state.currentInnings = 2;
    const tmp = state.battingTeam;
    state.battingTeam = state.bowlingTeam;
    state.bowlingTeam = tmp;
    $('recordBtn').disabled = false;
    updateUI();
    showToast(`${bat().name} innings begins!`);
  } else {
    showResult();
  }
});

// ═══════════════════════════════════════════════
// LIVE MATCH — Reset
// ═══════════════════════════════════════════════
$('resetBtn').addEventListener('click', () => {
  if (confirm('Reset the match? All data will be lost.')) location.reload();
});

// ═══════════════════════════════════════════════
// RESULT SCREEN
// ═══════════════════════════════════════════════
function showResult() {
  state.matchEnded = true;
  const t1 = state.team1;
  const t2 = state.team2;
  let winnerText;

  if (t1.runs > t2.runs) {
    const margin = t1.runs - t2.runs;
    winnerText = `${t1.name} won by ${margin} run${margin !== 1 ? 's' : ''}!`;
  } else if (t2.runs > t1.runs) {
    const wkts = 10 - t2.wickets;
    winnerText = `${t2.name} won by ${wkts} wicket${wkts !== 1 ? 's' : ''}!`;
  } else {
    winnerText = 'Match Tied!';
  }

  $('resultWinner').textContent = winnerText;

  $('rc1Name').textContent   = t1.name;
  $('rc1Score').textContent  = `${t1.runs}/${t1.wickets}`;
  $('rc1Detail').textContent = `${toOvers(t1.balls)} overs · ${t1.extras} extras`;

  $('rc2Name').textContent   = t2.name;
  $('rc2Score').textContent  = `${t2.runs}/${t2.wickets}`;
  $('rc2Detail').textContent = `${toOvers(t2.balls)} overs · ${t2.extras} extras`;

  showScreen('resultScreen');
}

$('newMatchBtn').addEventListener('click', () => location.reload());

// ═══════════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════════
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (t) t.remove();

  t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(232,184,75,0.15);
    border: 1px solid rgba(232,184,75,0.4);
    color: #e8b84b;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 1000;
    backdrop-filter: blur(10px);
    animation: toastIn 0.3s ease both;
    white-space: nowrap;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
