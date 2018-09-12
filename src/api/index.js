import { firebasedb } from '../utils/config.js';

export function createGame (name) {
  const gameData = {
    name : name,
    teamAssign: false,
    teamPoints: {red: {point: 0}, blue: {point: 0}},
  };
  //get random keyId from firebase below:
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
}


