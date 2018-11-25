import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
import {submitWord} from './api/index.js';

class SpyMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedWords: {},
      num: 0,
      singleWord: '',
      turn: null,
      team: null
    };
  }
  componentDidMount () {
    const gameChange = firebasedb.ref('/games/' + this.props.id + '/');
    gameChange.on('value', (emptyMap) => {
      this.updateTeamGuess(emptyMap.val());
    });

    this.findPlayersTeam();

    const turnChange = firebasedb.ref('/games/' + this.props.id + '/turn');
    turnChange.on('value', (turn) => {
      this.handleTeamsTurn(turn.val());
    });
  };
  handleTeamsTurn = (turn) => {
      if(turn === this.state.team){
        this.setState(() => ({turn : true}));
      } else {
        this.setState(() => ({turn : false}));
      }
  }
  findPlayersTeam = () => {
    firebasedb.ref('/games/' + this.props.id + '/players').once('value').then((snapshot) => {
      let playersArr = Object.keys(snapshot.val());
      let playersObj = snapshot.val();
      for(var i = 0; i < playersArr.length; i++) {
        if(playersObj[playersArr[i]] === this.props.name) {
          this.setState({team: playersArr[i].slice(0,1)});
          break;
        }
      }
    });
  }
  redTeamsTurn = () => {
    return this.state.team === 'r'
  }
  isTurn = () => {
    return this.state.turn === true
  }
  updateTeamGuess = ({wordMap, words}) => {
    let updatedWords = {};
      for(var key in wordMap){
        if(words[key] !== false){
          if(words[key] === 'r'){
            updatedWords[key] = 'red-selected'
          } else if (words[key] === 'b'){
            updatedWords[key] = 'blue-selected'
          }
        } else {
          updatedWords[key] = wordMap[key];
        }
      }
    this.setState(() => ({updatedWords}));
  }
  handleNumber = (num) => {
    this.setState(() => ({num}));
  }
  handleInput = ({target}) => {
    this.setState(() => ({singleWord: target.value}));
  }
  handleSubmitWord = () => {
    submitWord(this.props.id, this.state.singleWord, this.state.num);
    this.setState(()=>({turn : false}));
  }
  handleSubmit = ()=> {
    console.log('enter word below');
  }
  render() {
    return (
      <div className="board">
        <h6 className='find-team'>
          {this.redTeamsTurn() === true
            ? <span className='find-team'><span className='it'>Red</span><span className='not-it'>Blue</span></span>
            : <span className='find-team'><span className='it'>Blue</span><span className='not-it'>Red</span></span>
          }
          <span className='not-it'>Field Operations</span>
          <span className='it'>SpyMaster</span>
        </h6>
        <CardField codeWordMap={this.state.updatedWords} handleSubmit={this.handleSubmit}/>
        {this.isTurn() === true
          ? <div>
              <input placeholder='word' onChange={this.handleInput} className='hint'/>
              <div className ='ol'>
                <div onClick={() => {this.handleNumber(1)}}> 1</div>
                <div onClick={() => {this.handleNumber(2)}}> 2</div>
                <div onClick={() => {this.handleNumber(3)}}> 3</div>
                <div onClick={() => {this.handleNumber(4)}}> 4</div>
                <div onClick={() => {this.handleNumber(5)}}> 5</div>
                <div onClick={() => {this.handleNumber(6)}}> 6</div>
              </div>
              <button onClick={this.handleSubmitWord}>Submit</button>
            </div>
          : <div> Other teams turn.. please wait</div>
        }
      </div>
    );
  }
}

export default SpyMasters;