import { firebasedb } from '../utils/config.js';

export function createGame (name) {
  const gameData = {
    name : name,
    teamAssign: false,
    redPoints: 0,
    bluePoints: 0,
  }
  //get random keyId from firebase below:
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
};

// export function fetchGames () {
//   return firebasedb.ref('/games/').once('value').then(function(snapshot) {
//   //console.log(snapshot.val())
//     return snapshot.val();
//   });
// };

export function fetchGames () {
  var games = firebasedb.ref('/games/');
  return games.on('value', function (snapshot) {
    return snapshot.val();
  })
};
