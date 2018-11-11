import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
import {endWord, checkCorrectWord} from './api/index.js';


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
    const name = this.props.name;

    firebasedb.ref('/games/' + this.props.id + '/players').once('value').then((snapshot) => {
      let playersArr = Object.keys(snapshot.val());
      let playersObj = snapshot.val();
      for(var i = 0; i < playersArr.length; i++) {
        if(playersObj[playersArr[i]] === name) {
          this.setState({team: playersArr[i].slice(0,1)});
          break;
        }
      }
    });
    this.handleTeam();
    const team = firebasedb.ref('/games/' + this.props.id + '/turn');
    team.on('value', (snapshot) => {
      this.handleTeam();
    })
  }
  handleTeam = () => {
    const games = firebasedb.ref('/games/' + this.props.id + '/words');
    games.on('value', (snapshot) => {
      const words = snapshot.val();
      this.setState(() => ({words}));
    })
    const word = firebasedb.ref('/games/' + this.props.id + '/currentWord');
    word.on('value', (snapshot) => {
      const currentWord = snapshot.val();
      this.setState(() => ({currentWord}));
    })
    const num = firebasedb.ref('/games/' + this.props.id + '/currentNum');
    num.on('value', (snapshot) => {
      const currentNum = snapshot.val();
      this.setState(() => ({currentNum}));
    })
    firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then((snapshot) => {
      const value = snapshot.val();
      if(value === this.state.team){
        this.setState(() => ({turn : true}));
      } else {
        this.setState(() => ({turn: false}))
      };
    });
  }
  handleTurn = () => {
    firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then((snapshot) => {
      const value = snapshot.val();
      if(value === this.state.team){
        this.setState(() => ({turn : true}));
      } else {
        this.setState(() => ({turn: false}));
      };
    });
  }
  handleSubmit = (arr) => {
    this.setState(()=> ({arr}));
  }
  finalSubmit = () => {
    let currentRound = this.state.round + 1;
    checkCorrectWord(this.state.arr, this.props.id, currentRound).then((res) => {
      if(res === false) {
        this.skipTurn();
      } else if (res === true){
        if(currentRound >= this.state.currentNum){
          this.setState(()=>({round: 0}));
        } else {
          this.setState(()=> ({round: currentRound}));
        }
      }
    });
  }
  skipTurn = () => {
    this.setState(() => ({round: 0}));
  }
  endTurn = () => {
    endWord(this.props.id);
    this.setState(() => ({round: 0}));
  }
  render() {
    return (
      <div className="board">
        <h6 className='find-team'>
          {this.state.team === 'r'
            ? <span className='find-team'><span className='it'>Red</span><span className='not-it'>Blue</span></span>
            : <span className='find-team'><span className='it'>Blue</span><span className='not-it'>Red</span></span>
          }
          <span className='it'>Field Operations</span>
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
                ? <div>
                    <button onClick={() => {this.finalSubmit()}}>submit {this.state.round}/{this.state.currentNum}</button>
                    <button onClick={this.endTurn}>Stop Guessing</button>
                  </div>
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