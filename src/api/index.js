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
    words: false
  }
  //get random keyId from firebase below:
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
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
    firebasedb.ref('/games/' + id + '/players').once('value').then(function(snapshot) {
      let spyMaster = snapshot.val().spyMaster;
      spyMaster === 1 ? spyMaster = 2 : spyMaster = 1;
    return firebasedb.ref('/games/' + id + '/players').update(spyMaster);
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
