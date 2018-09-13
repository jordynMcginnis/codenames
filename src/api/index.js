import { firebasedb } from '../utils/config.js';

export function createGame (name) {
  const gameData = {
    name : name,
    teamAssign: false,
    redPoints: 0,
    bluePoints: 0,
    bluePlayer1: false,
    bluePlayer2: false,
    redPlayer1: false,
    redPlayer2: false
  }
  //get random keyId from firebase below:
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
};

export function SubmitName (name) {
  alert(name);
}