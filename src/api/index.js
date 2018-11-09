import { firebasedb } from '../utils/config.js';
import codeWordsList from '../data.js';

function getPlayers (id) {
  return firebasedb.ref('/games/' + id + '/players').once('value').then((snapshot) => {
    return snapshot.val();
  });
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
      return firebasedb.ref(`/games/${id}/players`).update({[`${team}Player1`] : name});
    } else {
      return firebasedb.ref(`/games/${id}/players`).update({[`${team}Player2`] : name});
    }
  })
}

export function selectRounds (id, round) {
  firebasedb.ref('/games/' + id + '/').update({rounds: round});
}

export function switchSpyMaster (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let spyMastersRound = snapshot.val().spyMaster;
    spyMastersRound === 1 ? spyMastersRound = 2 : spyMastersRound = 1;
    return firebasedb.ref('/games/' + id + '/').update({spyMaster : spyMastersRound});
  });
}

export function checkStart (id) {
  let count = 0;
  firebasedb.ref('/games/' + id + '/players').once('value').then((snapshot) => {
    let playersObj = snapshot.val();
    for(var key in playersObj) {
      if(playersObj[key] !== false){
        count += 1
      }
    }
    if(count === 4){
      let result = {};
      result.start = true;
      firebasedb.ref('/games/' + id + '/').update(result);
    }
  });
}

export function submitWord (id, word, num) {
  firebasedb.ref('/games/' + id + '/').update({currentWord: word, currentNum: num});
}

export function checkData (id) {
  chooseCodeWords(id, 25, {});
}

export function startNextRound (id, kill) {
  firebasedb.ref('/games/' + id + '/').update({winner: false, words: false});
  chooseCodeWords(id, 25, {});
  if (kill === false){
    switchSpyMaster(id);
  }
}

export function sendWord (arr, id, round) {
  return firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let turn = snapshot.val().turn; //red
    let wordMap = snapshot.val().wordMap;
    let words = snapshot.val().words;
    let currentRound = snapshot.val().currentNum;

    for (var i = 0; i < arr.length; i++) {
      if(wordMap[arr[i]].slice(0,1) === turn){
        words[arr[i]] = turn;
        firebasedb.ref('/games/' + id + '/words').update(words);
        selectWinner(id);
        if(currentRound <= round){
          switchTurn(id);
          clearClue(id);
        }
        return true;
      } else if (wordMap[arr[i]] === 'killer'){
        let person = false;
        if(turn === 'b'){
          person = 'red'
        } else {
          person = 'blue'
        }
        selectWinner(id, 'end', person);
        switchTurn(id);
        clearClue(id);
        return;
      } else {
        switchTurn(id);
        clearClue(id);
        return false;
      }
    }
  });
}

export function endWord (id) {
   switchTurn(id);
   clearClue(id);
}

export function switchTurn (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let turn = snapshot.val().turn;
    let result = {};
    if(turn === 'b'){
      result.turn = 'r';
    } else {
      result.turn = 'b';
    }
    firebasedb.ref('/games/' + id + '/').update(result);
  });
}

export function selectWinner (id, stat, person) {
  let blueCount = 0;
  let redCount = 0;
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let result = {};
    let redPoints = snapshot.val().redPoints;
    let bluePoints = snapshot.val().bluePoints;
    let currentRound = snapshot.val().currentRound;
    let map = snapshot.val().words;

    if(stat === 'end'){
      result.winner = person;
      person === 'blue' ? result.bluePoints = bluePoints + 1 : result.redPoints = redPoints + 1;
      result.currentRound = currentRound + 1;
      startNextRound(id, false);
    } else {
      for(var key in map) {
        if(map[key] === 'b'){
          blueCount++;
        } else if (map[key] === 'r'){
          redCount++;
        }
      }
      if(blueCount >= 12){
        result.winner = 'blue';
        result.currentRound = currentRound + 1;
        result.bluePoints = bluePoints + 1;
        startNextRound(id, false);
      } else if (redCount >= 12){
        result.winner = 'red';
        result.currentRound = currentRound + 1;
        result.redPoints = redPoints + 1;
        startNextRound(id, false);
      }
    }

    firebasedb.ref('/games/' + id + '/').update(result);
  });
  checkEndGame(id);
};

export function checkEndGame (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    if(snapshot.val().currentRound === snapshot.val().rounds){
      firebasedb.ref('/games/' + id + '/').update({gameStatus : false, homeRender : false});
    }
  });
}

export function clearClue (id) {
  firebasedb.ref('/games/' + id + '/').update({currentWord: false, currentNum: false});
}

function chooseCodeWords (id, num, agentWordMap){
  if(num === 0){
    firebasedb.ref('/games/' + id + '/words').once('value').then((snapshot) => {
      if(snapshot.val() === false){
        firebasedb.ref('/games/' + id + '/').update({words: agentWordMap});
        fillWordMap(agentWordMap, id);
      } else {
        console.log('already filled')
      }
    });
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

  firebasedb.ref('/games/' + id + '/').update({wordMap: spyMasterWordMap});
}