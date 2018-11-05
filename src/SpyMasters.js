import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
import {submitWord} from './api/index.js';
import {FaBullseye} from "react-icons/fa";

class SpyMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {},
      num: 0,
      singleWord: '',
      turn: false,
      team: false
    };
  }
  componentDidMount () {
    let games = firebasedb.ref('/games/' + this.props.id + '/');
    games.on('value', (snapshot) => {
      let words = {};
      let wordMap = snapshot.val().wordMap;
      let wordAgent = snapshot.val().words;
      for(var key in wordMap){
        if(wordAgent[key] !== false){
          if(wordAgent[key] === 'r'){
            words[key] = 'red-selected'
          } else if (wordAgent[key] === 'b'){
            words[key] = 'blue-selected'
          }
        } else {
          words[key] = wordMap[key];
        }
      }
      this.setState(() => ({words}));
    });
    const name = this.props.name;
    const key = firebasedb.ref('/games/' + this.props.id + '/players').once('value').then((snapshot) => {
      let playersArr = Object.keys(snapshot.val());
      let playersObj = snapshot.val();
      for(var i = 0; i < playersArr.length; i++) {
        if(playersObj[playersArr[i]] === name) {
          this.setState(() => ({team: playersArr[i].slice(0,1)}));
          break;
        }
      }
    });
    let team = firebasedb.ref('/games/' + this.props.id + '/turn');
    team.on('value', (snapshot) => {
      this.handleTeam();
    });
  };
  handleTeam = () => {
    const team = firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then((snapshot) => {
      let value = snapshot.val();
      if(value === this.state.team){
        this.setState(() => ({turn : true}));
      } else {
        this.setState(() => ({turn : false}));
      }
    });
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
    console.log('enter word');
  }
  render() {
    return (
      <div className="board">
        <h6 className='find-team'>
          {this.state.team === 'r'
            ? <span className='find-team'><span className='it'>Red</span><span className='not-it'>Blue</span></span>
            : <span className='find-team'><span className='it'>Blue</span><span className='not-it'>Red</span></span>
          }
          <span className='not-it'>Field Operations</span>
          <span className='it'>SpyMaster</span>
        </h6>
         <CardField data={this.state.words} handleSubmit={this.handleSubmit}/>
         {this.state.turn === true
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