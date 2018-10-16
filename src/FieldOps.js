import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
import {sendWord, switchTurn, gatherData, clearClue, selectWinner, endWord} from './api/index.js';
import {FaBullseye} from "react-icons/fa";


class FieldOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {},
      turn: false,
      team: false,
      currentWord: false,
      currentNum: false,
      arr: [],
      round: 0
    };
  }
  componentDidMount () {
    //this.setState(()=> ({turn: this.props.turn}));


    console.log('turn passed from gameboard', this.props.turn);
    const name = this.props.name;
    const that = this;

    const key = firebasedb.ref('/games/' + this.props.id + '/players').once('value').then(function(snapshot) {
      let playersArr = Object.keys(snapshot.val());
      let playersObj = snapshot.val();
      for(var i = 0; i < playersArr.length; i++) {
        if(playersObj[playersArr[i]] === name) {
          that.setState(() => ({team: playersArr[i].slice(0,1)}));
          break;
        }
      }
    });
   this.handleTeam();
   //const that = this;
    let team = firebasedb.ref('/games/' + this.props.id + '/turn');
    team.on('value', (snapshot) => {
      // let value = snapshot.val();
      // //this.setState(() => ({words}));
      // if(value === that.state.team){
      //   that.setState(() => ({turn : true}));
      // }
      that.handleTeam();
      //IF NOT TRY HANDLE TURN THINK THAT CURRENT WORD NEEDS TO CHANGE ALSO
    })
  }
  handleTeam = () => {
    const that = this;
    let games = firebasedb.ref('/games/' + this.props.id + '/words');
    games.on('value', (snapshot) => {
      let words = snapshot.val();
      that.setState(() => ({words}));
    })
    let word = firebasedb.ref('/games/' + this.props.id + '/currentWord');
    word.on('value', (snapshot) => {
      let currentWord = snapshot.val();
      that.setState(() => ({currentWord}));
    })
    let num = firebasedb.ref('/games/' + this.props.id + '/currentNum');
    num.on('value', (snapshot) => {
      let currentNum = snapshot.val();
      that.setState(() => ({currentNum}));
    })
    const team = firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then(function(snapshot) {
      let value = snapshot.val();
      if(value === that.state.team){
        that.setState(() => ({turn : true}));
      } else {
        that.setState(() => ({turn: false}))
      };
    });
    // const that = this;
    // let team = firebasedb.ref('/games/' + this.props.id + '/turn');
    // team.on('value', (snapshot) => {
    //   let value = snapshot.val();
    //   //this.setState(() => ({words}));
    //   if(value === that.state.team){
    //     that.setState(() => ({turn : true}));
    //   }
    // })
  }
  handleTurn = () => {
    let that = this;
    const team = firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then(function(snapshot) {
      let value = snapshot.val();
      if(value === that.state.team){
        that.setState(() => ({turn : true}));
      } else {
        that.setState(() => ({turn: false}))
      };
    });
  }
  handleSubmit = (arr) => {
    console.log('selected options', arr);

    this.setState(()=> ({arr}))

    //switchTurn();
  }
  finalSubmit = () => {
    let currentRound = this.state.round + 1;
    console.log('currentRound: ', currentRound);
    sendWord(this.state.arr, this.props.id, currentRound).then((res)=> {
      if(res === false) {
        console.log('SEND WORD CAME BACK FALSE, CALLING SKIPTURN')
        this.skipTurn();
        //this.setState(() => ({round: 0}));
      } else if (res === true){
        console.log('SEND WORD CAME BACK TRUE')
        if(currentRound >= this.state.currentNum){
          this.setState(()=>({round: 0}));
        } else {
          this.setState(()=> ({round: currentRound}));
        }
      }
    });
    //selectWinner(this.props.id);
    //GET RESPONSE BACK FROM SEND WORD THEN DO BELOW OR SKIPTURN;

  }
  skipTurn = () => {
    //why calling again though?
    //sendWord(this.state.arr, this.props.id, this.state.round);
    this.setState(() => ({round: 0}));
  }
  endTurn = () => {
    endWord(this.props.id)
    this.setState(() => ({round: 0}));
  }
  render() {
    return (
      <div className="board">
        <h6 className='find-team'>
          {this.state.team === 'r'
            ? <span className='find-team'> <span className='it' >Red</span> <span className='not-it'> Blue</span> </span>
            : <span className='find-team'> <span className='it'>Blue</span> <span className='not-it' > Red </span> </span>
          }
          <span  className='it'>Field Operations</span>
          <span className='not-it'>SpyMaster</span>
        </h6>
        <CardField data={this.state.words} handleSubmit={this.handleSubmit} maxNum={this.state.currentNum}/>
         {this.state.currentWord === false
          ? <div> Waiting for clue... </div>
          : <div> CLUE WORD: {this.state.currentWord} : {this.state.currentNum} </div>
        }

        {this.state.turn === true
          ? <div className='chooser'>
              {this.state.currentWord !== false
                ? <div> <button onClick={() => {this.finalSubmit()}}>submit {this.state.round}/{this.state.currentNum}</button>
                  <button onClick={this.endTurn}>Stop Guessing</button> </div>
                : null
              }

            </div>

          : <div>Please wait.. other teams turn</div>
        }


      </div>
    );
  }
}

export default FieldOps;
