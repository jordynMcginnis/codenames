import { firebasedb } from '../utils/config.js';
import codeWords from '../data.js';

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
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
};

export function submitName (name, id, team) {
  return firebasedb.ref('/games/' + id + '/players').once('value').then((snapshot) => {
    let playersObj = snapshot.val();

    if(team === 'blue'){
      if(playersObj.bluePlayer1 === false){
        playersObj.bluePlayer1 = name;
      } else if(playersObj.bluePlayer2 === false){
        playersObj.bluePlayer2 = name;
      } else {
        return true;
      }
    } else {
      if(playersObj.redPlayer1 === false){
        playersObj.redPlayer1 = name;
      } else if(playersObj.redPlayer2 === false){
        playersObj.redPlayer2 = name;
      } else {
        return true;
      }
    }

    firebasedb.ref('/games/' + id + '/players').update(playersObj);
    return false;
  });
}

export function selectRounds (id, round) {
  let result = {};
  result.rounds = round;
  firebasedb.ref('/games/' + id + '/').update(result);
}

export function switchSpyMaster (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let spyMaster = snapshot.val().spyMaster;
    spyMaster === 1 ? spyMaster = 2 : spyMaster = 1;
    let result = {};
    result.spyMaster = spyMaster;
    return firebasedb.ref('/games/' + id + '/').update(result);
  });
}

export function checkStart (id) {
  let count = 0;
  firebasedb.ref('/games/' + id + '/players').once('value').then((snapshot) => {
    let playersObj = snapshot.val();
    for(var key in playersObj) {
      playersObj[key] !== false ? count += 1 : null;
    }
    if(count === 4){
      let result = {};
      result.start = true;
      firebasedb.ref('/games/' + id + '/').update(result);
    }
  });
}

export function submitWord (id, word, num){
  firebasedb.ref('/games/' + id + '/').update({currentWord: word, currentNum: num});
}

export function checkData (id) {
  chooseData(id, 25, {});
}

export function updateGame (id, kill) {
  // let result = {};
  // result.winner = false;
  // result.words = false;
  //firebasedb.ref('/games/' + id + '/words').once('value').then((snapshot) => {
    firebasedb.ref('/games/' + id + '/').update({winner: false, words: false});
    chooseData(id, 25, {});
  //});
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
      updateGame(id, false);
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
        updateGame(id, false);
      } else if (redCount >= 12){
        result.winner = 'red';
        result.currentRound = currentRound + 1;
        result.redPoints = redPoints + 1;
        updateGame(id, false);
      }
    }
    firebasedb.ref('/games/' + id + '/').update(result);
  });
  checkEnd(id);
};

export function checkEnd (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let result = {};
    let round = snapshot.val().currentRound;
    let roundMax = snapshot.val().rounds;
    if(round === roundMax){
      result.gameStatus = false;
      result.homeRender = false;
    }
    firebasedb.ref('/games/' + id + '/').update(result);
  });
}

export function clearClue (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then((snapshot) => {
    let result = {};
    result.currentWord = false;
    result.currentNum = false;
    firebasedb.ref('/games/' + id + '/').update(result);
  });
}

function chooseData (id, num, obj, arr){
  if(num === 0){
  firebasedb.ref('/games/' + id + '/words').once('value').then((snapshot) => {
    let value = snapshot.val();
    if(value === false){
      let result = {};
      result.words = obj //undefined
      firebasedb.ref('/games/' + id + '/').update(result);
      fillWordMap(obj, id);
    } else {
      console.log('already filled')
    }
  });
    return;
  } else {
    let ranNum = randomNum();
    while(obj[codeWords[ranNum]] === false){
      ranNum = randomNum();
    }
    obj[codeWords[ranNum]] = false;
    chooseData(id, num - 1, obj);
  }
}

function randomNum () {
  return Math.floor(Math.random() * Math.floor(350));
}

function fillWordMap(obj, id) {
  let newData = {};
  let BlueCount = 12;
  let RedCount = 12;
  let killer = 1;

  for(var key in obj){
    if(BlueCount > 0) {
      newData[key] = 'blue';
      BlueCount -= 1;
    } else if (RedCount > 0){
      newData[key] = 'red';
      RedCount -= 1;
    } else if (killer > 0){
      newData[key] = 'killer';
      killer -= 1;
    }
  }
  let result = {};
  result.wordMap = newData;
  firebasedb.ref('/games/' + id + '/').update(result);
}