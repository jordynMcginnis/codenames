import { firebasedb } from '../utils/config.js';

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
    start: false
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
  firebasedb.ref('/games/' + id + '/players').once('value').then(function(snapshot) {
    let playersObj = snapshot.val();
    let start = true;
    for(var key in playersObj) {
      playersObj[key] === false ? start = false : null;
    }
    start === true
      ? firebasedb.ref('/games/' + id + '/start').update(start)
      : false;
  });
}
