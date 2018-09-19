import { firebasedb } from '../utils/config.js';
import data from '../data.js';

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
    winner: false
  }
  //get random keyId from firebase below:
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
  //switchTurn('b', key);
};

export function submitName (name, id) {
  const key = firebasedb.ref('/games/' + id + '/players').once('value').then(function(snapshot) {
    let playersArr = Object.keys(snapshot.val());
    let playersObj = snapshot.val();
    for(var i = 0; i < playersArr.length; i++) {
      if(playersObj[playersArr[i]] === false) {
        playersObj[playersArr[i]] = name;
        break;
      }
    }
    return firebasedb.ref('/games/' + id + '/players').update(playersObj);
  });
}

export function switchTeam (id) {
  firebasedb.ref('/games/' + id + '/players').once('value').then(function(snapshot) {
    let playersArr = Object.keys(snapshot.val());
    let playersObj = snapshot.val();
    let playersNames = [];
    let randomize = {};
    for(var key in playersObj) {
      playersNames.push(playersObj[key]);
    }
    let value = playersNames.pop();
    playersNames.unshift(value);
    for(var i = 0; i < playersArr.length; i++) {
     randomize[playersArr[i]] = playersNames[i];
    }
    return firebasedb.ref('/games/' + id + '/players').update(randomize);
  });
}

export function switchSpyMaster (id) {
    //changed spyMaster to 1 perinently then to 2 to see what will happen
    firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
      let spyMaster = snapshot.val().spyMaster;
      spyMaster = 1;
      let result = {};
      result.spyMaster = spyMaster;
    return firebasedb.ref('/games/' + id + '/').update(result);
  });
}

export function checkStart (id) {
  let start = true;
  let count = 0;
  firebasedb.ref('/games/' + id + '/players').once('value').then(function(snapshot) {
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
  firebasedb.ref('/games/' + id + '/currentWord').once('value').then(function(snapshot) {
    let value = snapshot.val();
      let result = {};
      result.currentWord = word;
      firebasedb.ref('/games/' + id + '/').update(result);
  });
  firebasedb.ref('/games/' + id + '/currentNum').once('value').then(function(snapshot) {
    let value = snapshot.val();
      let result = {};
      result.currentNum = num
      firebasedb.ref('/games/' + id + '/').update(result);
  });
}

export function checkData (id) {
  firebasedb.ref('/games/' + id + '/words').once('value').then(function(snapshot) {
    let value = snapshot.val();
    console.log('here', value);
    if(value === false){
      let result = {};
      result.words = chooseData(id);
      firebasedb.ref('/games/' + id + '/').update(result);
    } else {
      console.log('already filled')
    }
  });
}

export function updateGame (id) {
  firebasedb.ref('/games/' + id + '/words').once('value').then(function(snapshot) {
    let result = {};
    let redPoints = snapshot.val().redPoints;
    let bluePoints = snapshot.val().redPoints;
    let value = snapshot.val();
    let winner = snapshot.val().winner;
    if(winner === 'blue'){
      result.bluePoints = bluePoints + 1;
      result.winner = false;
    } else if (winner === 'red'){
      result.redPoints = redPoints + 1;
      result.winner = false
    }
    result.words = chooseData(id);
    firebasedb.ref('/games/' + id + '/').update(result);
  });
  switchSpyMaster(id);
}

export function sendWord (arr, id) {
  firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let turn = snapshot.val().turn;
    let wordMap = snapshot.val().wordMap;
    let words = snapshot.val().words;
    for(var i = 0; i < arr.length; i++) {
      if(wordMap[arr[i]].slice(0,1) === turn){
        words[arr[i]] = turn;
      } else if (wordMap[arr[i]] === 'killer'){
        //switchTurn(turn, id);
        //selectWinner(id);
        //NEED TO FIX HERE
        let person = false;
        if(turn === 'b'){
          person = 'red'
        } else {
          person = 'blue'
        }
        let result = {};
        result.winner = person;
        firebasedb.ref('/games/' + id + '/').update(result);
      }
    }
    firebasedb.ref('/games/' + id + '/words').update(words);
    //switchTurn(turn, id);
  });


}

export function switchTurn (id) {
    firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let turn = snapshot.val().turn;
    let result = {};
    if(turn === 'b'){
      result.turn = 'r';
    } else {
      result.turn = 'b';
    }
    firebasedb.ref('/games/' + id + '/').update(result);
    //switchSpyMaster(id);
  });

  console.log('got here to switch turn');

  //firebasedb.ref('/games/' + id + '/').update(result);
}

export function selectWinner (id) {
  let blueCount = 0;
  let redCount = 0;
  console.log('winner function ran')
  firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let result = {};
    let map = snapshot.val().words;
    for(var key in map) {
      if(map[key] === 'b'){
        blueCount++;
      } else if (map[key] === 'r'){
        redCount++;
      }
    }
    if(blueCount >= 12){
        result.winner = 'blue'
    } else if (redCount >= 12){
        result.winner = 'red'
    }
    firebasedb.ref('/games/' + id + '/').update(result);
  });
};



export function clearClue (id) {
    firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
      let value = snapshot.val();
      let result = {};
      result.currentWord = false;
      result.currentNum = false;
      firebasedb.ref('/games/' + id + '/').update(result);
    });
}

function chooseData (id) {
  var newData = {};
  for(var i = 0; i < 25; i++){
    let index = Math.floor(Math.random() * Math.floor(374));
    newData[data[index]] = false;
  }
  chooseTeamWords(newData, id)
  return newData;
}

function chooseTeamWords(data, id) {
  let newData = {};
  let BlueCount = 12;
  let RedCount = 12;
  let killer = 1;

  for(var key in data){
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
  result.wordMap = newData
  firebasedb.ref('/games/' + id + '/').update(result);
}
