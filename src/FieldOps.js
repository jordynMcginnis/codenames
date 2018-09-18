import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
import {sendWord, switchTurn, gatherData} from './api/index.js';
class FieldOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {},
      turn: false,
      team: false,
      currentWord: false,
      currentNum: false,
      arr: []
    };
  }
  componentDidMount () {
    console.log('name', this.props.name);
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
      }
    });
  }
  handleSubmit = (arr) => {
    console.log('selected options', arr);
    this.setState(()=> ({arr}))
    sendWord(arr, this.props.id);
    //switchTurn();
  }
  render() {
    return (
      <div className="board">
        <h6>Field Operations : {this.state.team} Team</h6>
        <CardField data={this.state.words} handleSubmit={this.handleSubmit} maxNum={this.state.currentNum}/>
        {this.state.turn === true
          ? <button onClick={() => {switchTurn(this.props.id)}}> submit</button>
          : null
        }
        {this.state.currentWord} : {this.state.currentNum}
      </div>
    );
  }
}

export default FieldOps;
