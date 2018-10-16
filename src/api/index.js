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
    winner: false,
    rounds: 2,
    currentRound: 0,
    gameStatus: true,
    homeRender : true
  }
  //get random keyId from firebase below:
  const key = firebasedb.ref().child('games').push().key;
  let updates = {};
  updates[key] = gameData;
  return firebasedb.ref('/games/').update(updates);
  //switchTurn('b', key);
};

export function submitName (name, id, team) {
  const key = firebasedb.ref('/games/' + id + '/players').once('value').then(function(snapshot) {
    let playersArr = Object.keys(snapshot.val());
    let playersObj = snapshot.val();
    // for(var i = 0; i < playersArr.length; i++) {
    //   if(playersObj[playersArr[i]] === false) {
    //     playersObj[playersArr[i]] = name;
    //     break;
    //   }
    // }
    if(team === 'blue'){
      if(playersObj.bluePlayer1 === false){
        playersObj.bluePlayer1 = name;
      } else if (playersObj.bluePlayer2 === false){
        playersObj.bluePlayer2 = name;
      } else {
        if(playersObj.redPlayer1 === false){
        playersObj.redPlayer1 = name;
        } else if (playersObj.redPlayer2 === false){
        playersObj.redPlayer2 = name;
        }
      }
    } else {
       if(playersObj.redPlayer1 === false){
        playersObj.redPlayer1 = name;
      } else if (playersObj.redPlayer2 === false){
        playersObj.redPlayer2 = name;
      } else {
        if(playersObj.bluePlayer1 === false){
        playersObj.bluePlayer1 = name;
        } else if (playersObj.bluePlayer2 === false){
        playersObj.bluePlayer2 = name;
        }
      }
    }
    return firebasedb.ref('/games/' + id + '/players').update(playersObj);
  });
}

export function selectRounds (id, round) {
  // firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
  //   let result = {};
  //   result.
  // });
  let result = {};
  result.rounds = round;
  firebasedb.ref('/games/' + id + '/').update(result);
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
      spyMaster === 1 ? spyMaster = 2 : spyMaster = 1;
      //spyMaster = 1;
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
  chooseData(id, 25, {});
  //console.log('words:', words);

  // firebasedb.ref('/games/' + id + '/words').once('value').then(function(snapshot) {
  //   let value = snapshot.val();

  //   if(value === false){
  //     let result = {};
  //     result.words = words; //undefined
  //     firebasedb.ref('/games/' + id + '/').update(result);
  //   } else {
  //     console.log('already filled')
  //   }
  // });
}

export function updateGame (id, winner, kill) {
  console.log(winner + ' won, running update game to change word maps')
  firebasedb.ref('/games/' + id + '/words').once('value').then(function(snapshot) {
    let result = {};
    result.winner = false;
    //result.winner = winner;
    result.words = chooseData(id, 25, {});
    //I don't think that I am updating word map?
    firebasedb.ref('/games/' + id + '/').update(result);
  });
  if (kill === false){

    switchSpyMaster(id);
  }

}

export function sendWord (arr, id, round) {
  return firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let turn = snapshot.val().turn; //red
    let wordMap = snapshot.val().wordMap;
    let words = snapshot.val().words;
    let currentRound = snapshot.val().currentNum;

//was at bottom;
  // if(currentRound <= round){
  //     switchTurn(id);
  //     clearClue(id);
  //     //selectWinner(id);
  //   }
    for (var i = 0; i < arr.length; i++) {
      if(wordMap[arr[i]].slice(0,1) === turn){
        words[arr[i]] = turn;
        firebasedb.ref('/games/' + id + '/words').update(words);
        selectWinner(id);
          if(currentRound <= round){
            switchTurn(id);
            clearClue(id);
            //selectWinner(id);
          }
        return true;
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
        //result.winner = person;
        //firebasedb.ref('/games/' + id + '/').update(result);
        selectWinner(id, 'end', person);
        if(currentRound <= round){
            switchTurn(id);
            clearClue(id);
            //selectWinner(id);
          }
        return;
      } else {
          if(currentRound <= round){
            switchTurn(id);
            clearClue(id);
          }
        return false;
      }
    }
    //check if round passed is equal to Current Num.. if it is then call switchTurn//
    //if not than don't call switch turn
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

export function selectWinner (id, stat, person) {
  let blueCount = 0;
  let redCount = 0;
  console.log('winner function ran')
  firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let result = {};
    let redPoints = snapshot.val().redPoints;
    let bluePoints = snapshot.val().bluePoints;
    let currentRound = snapshot.val().currentRound;
    let map = snapshot.val().words;
    let teamTurn = snapshot.val().turn;

    if(stat === 'end'){
      result.winner = person;
      person === 'blue' ? result.bluePoints = bluePoints + 1 : result.redPoints = redPoints + 1;
      result.currentRound = currentRound + 1;

      console.log('say winner should be:', person);
      updateGame(id, person, false);
    } else {
      for(var key in map) {
        if(map[key] === 'b'){
          blueCount++;
        } else if (map[key] === 'r'){
          redCount++;
        }
      }

      if(blueCount >= 12){
          console.log('blue team won')
          result.winner = 'blue';
          result.currentRound = currentRound + 1;
          result.bluePoints = bluePoints + 1;

          updateGame(id, 'blue', false);
      } else if (redCount >= 12){
          console.log('red team won')
          result.winner = 'red';
          result.currentRound = currentRound + 1;
          result.redPoints = redPoints + 1;
          updateGame(id, 'red', false);
      }
    }
    firebasedb.ref('/games/' + id + '/').update(result);
  });

  checkEnd(id);
};

export function checkEnd (id) {
  //RIGHT HERE WRONG SHOULD NOT UPDATE CURRENT ROUND ONLY WHEN WINNER
  firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let result = {};
    let round = snapshot.val().currentRound;
    let roundMax = snapshot.val().rounds;
    console.log('currentRound: ' + round + ' MaxRound: ' + roundMax);
    if(round === roundMax){
      result.gameStatus = false;
      result.homeRender = false;
    }
    firebasedb.ref('/games/' + id + '/').update(result);
  });
}

export function clearClue (id) {
  firebasedb.ref('/games/' + id + '/').once('value').then(function(snapshot) {
    let value = snapshot.val();
    let result = {};
    result.currentWord = false;
    result.currentNum = false;
    firebasedb.ref('/games/' + id + '/').update(result);
  });
}

// function chooseData (id) {
//   var newData = {};
//   for(var i = 0; i < 25; i++){
//     let ranNum = Math.floor(Math.random() * Math.floor(374));
//     newData[data[ranNum]] = false;
//     if(Object.keys(newData).length === 25) {
//       console.log('arr length', Object.keys(newData).length);
//       chooseTeamWords(newData, id)
//       return newData;
//     }
//   }
// }

function chooseData (id, num, obj){
  if(num === 0){
  firebasedb.ref('/games/' + id + '/words').once('value').then(function(snapshot) {
    console.log('jordyn should only run once')
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
    console.log('this should only run once calling chooseTeamWords')

    return;
  } else {
    let ranNum = Math.floor(Math.random() * Math.floor(374));
    obj[data[ranNum]] = false;
    chooseData(id, num - 1, obj);
  }
}

function fillWordMap(obj, id) {
  console.log('obj received:', obj);
  let newData = {};
  let BlueCount = 12;
  let RedCount = 12;
  let killer = 1;

  for(var key in obj){
    console.log(key);
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
  console.log('final edit here:', newData);
  let result = {};
  result.wordMap = newData;
  firebasedb.ref('/games/' + id + '/').update(result);
}
