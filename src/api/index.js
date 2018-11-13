import { firebasedb } from '../utils/config.js';
import codeWordsList from '../data.js';

function getPlayers (id) {
  return firebasedb.ref('/games/' + id + '/players').once('value').then((snapshot) => {
    return snapshot.val();
  });
}

function getGame (id) {
  return firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    return snapshot.val();
  });
}

function getSpyMaster (id) {
  return firebasedb.ref('/games/' + id + '/spyMaster').once('value').then((snapshot) => {
    return snapshot.val();
  });
}

function updateGame (id, obj) {
  firebasedb.ref('/games/' + id + '/').update(obj);
}

function updatePlayers (id, obj) {
  firebasedb.ref(`/games/${id}/players`).update(obj);
}

export function createGame (name) {
  const gameData = {
    name : name,
    teamAssign: false,
    redPoints: 0,
    bluePoints: 0,
    players: {
      bluePlayer1: false,
      bluePlayer2: false,
      redPlayer1: false,
      redPlayer2: false
    },
    spyMaster: 1,
    start: false,
    wordMap: false,
    gameMap: false,
    words: false,
    currentWord: false,
    currentNum: false,
    turn: 'b',
    winner: false,
    rounds: 2,
    currentRound: 0,
    gameStatus: true,
    homeRender : true
  }
  const key = firebasedb.ref().child('games').push().key;
  return firebasedb.ref('/games/').update({[key] : gameData});
};

export function teamFull (id, team) {
  return getPlayers(id).then((players) => {
    return players[`${team}Player1`] !== false && players[`${team}Player2`] !== false
  });
}

export function submitName (name, id, team) {
  getPlayers(id).then((players) => {
    if(players[`${team}Player1`] === false){
      return updatePlayers(id, {[`${team}Player1`] : name});
    } else {
      return updatePlayers(id, {[`${team}Player2`] : name});
    }
  })
}

export function selectRounds (id, round) {
  updateGame(id, {rounds: round})
}

export function switchSpyMaster (id) {
  getSpyMaster(id).then((spyMastersRound) => {
    spyMastersRound === 1 ? spyMastersRound = 2 : spyMastersRound = 1;
    return updateGame(id, {spyMaster : spyMastersRound});
  })
}

export function checkStart (id) {
  let count = 0;
  getPlayers(id).then((players) => {
    for(var key in players) {
      if(players[key] !== false){
        count += 1
      }
    }
    if(count === 4){
      updateGame(id, {start : true});
    }
  })
}

export function submitWord (id, word, num) {
  updateGame(id, {currentWord: word, currentNum: num});
}

export function checkData (id) {
  chooseCodeWords(id, 25, {});
}

export function startNextRound (id, kill) {
  updateGame(id, {winner: false, words: false})
  chooseCodeWords(id, 25, {});
  if (kill === false){
    switchSpyMaster(id);
  }
}

function updateNextHint (id) {
  switchTurn(id);
  clearClue(id);
}

function updateIncorrectGuess (id) {
  updateNextHint(id);
}

function updateKillerGuessed (id, turn) {
  turn === 'b'
    ? selectWinner(id, 'end', 'red')
    : selectWinner(id, 'end', 'blue')
  updateNextHint(id);
}

function updateCorrectGuess (id, guess, fieldOpWords, turn, round, currentNum) {
  firebasedb.ref('/games/' + id + '/words').update({[guess] : turn});
  selectWinner(id);
  if(currentNum <= round){
    updateNextHint(id)
  }
}

export function checkCorrectWord (arr, id, round) {
  return getGame(id).then(({turn, wordMap, words, currentNum}) => {
    for (var i = 0; i < arr.length; i++) {
      if(wordMap[arr[i]].slice(0,1) === turn){
        updateCorrectGuess(id, arr[i], words, turn, round, currentNum);
        return true;
      } else if (wordMap[arr[i]] === 'killer'){
        updateKillerGuessed(id, turn)
        return;
      } else {
        updateIncorrectGuess(id);
        return false;
      }
    }
  })
}

export function endWord (id) {
   switchTurn(id);
   clearClue(id);
}

export function switchTurn (id) {
  getGame(id).then(({turn}) => {
    turn === 'b'
      ? updateGame(id, {turn : 'r'})
      : updateGame(id, {turn : 'b'})
  })
}

function countGuessedWords (wordMap, team) {
  let teamPoints = 0;
  for(var word in wordMap){
    if(wordMap[word] ===  team){
      teamPoints++;
    }
  }
  return teamPoints;
}

export function selectWinner (id, stat, person) {
  getGame(id).then(({redPoints, bluePoints, currentRound, words}) => {
    if(stat === 'end'){
      person === 'blue'
        ? updateGame(id, {winner: person, 'bluePoints': bluePoints += 1, 'redPoints' : redPoints, 'currentRound' : currentRound + 1})
        : updateGame(id, {winner: person, 'bluePoints': bluePoints, 'redPoints' : redPoints += 1, 'currentRound' : currentRound + 1})
      startNextRound(id, false);
    } else {
      const blueWordsGuessed = countGuessedWords(words, 'b');
      const redWordsGuessed = countGuessedWords(words, 'r');
      if(blueWordsGuessed >= 12){
        startNextRound(id, false);
        updateGame(id, {winner : 'blue', currentRound : currentRound + 1, bluePoints : bluePoints + 1})
      } else if(redWordsGuessed >= 12){
        startNextRound(id, false);
        updateGame(id, {winner: 'red',currentRound : currentRound + 1, redPoints : redPoints + 1});
      }
    }
  })
  checkEndGame(id);
};

export function checkEndGame (id) {
  getGame(id).then(({currentRound, rounds}) => {
    currentRound === rounds
      ? updateGame(id, {gameStatus : false, homeRender : false})
      : null
  })
}

export function clearClue (id) {
  updateGame(id, {currentWord: false, currentNum: false})
}

function chooseCodeWords (id, num, agentWordMap){
  if(num === 0){
    getGame(id).then(({words}) => {
      if(words === false){
        updateGame(id, {words: agentWordMap});
        fillWordMap(agentWordMap, id);
      } else {
        console.log('already filled')
      }
    })
    return;
  } else {
    let ranNum = randomNum();

    while(agentWordMap[codeWordsList[ranNum]] === false){
      ranNum = randomNum();
    }
    agentWordMap[codeWordsList[ranNum]] = false;
    chooseCodeWords(id, num - 1, agentWordMap);
  }
}

function randomNum () {
  return Math.floor(Math.random() * Math.floor(350));
}

function fillWordMap(agentWordMap, id) {
  let spyMasterWordMap = {};
  let BlueCount = 12;
  let RedCount = 12;
  let killer = 1;

  for(var key in agentWordMap){
    if(BlueCount > 0) {
      spyMasterWordMap[key] = 'blue';
      BlueCount -= 1;
    } else if (RedCount > 0){
      spyMasterWordMap[key] = 'red';
      RedCount -= 1;
    } else if (killer > 0){
      spyMasterWordMap[key] = 'killer';
      killer -= 1;
    }
  }

  updateGame(id, {wordMap: spyMasterWordMap});
}