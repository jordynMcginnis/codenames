import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
import {submitWord} from './api/index.js';

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
    let games = firebasedb.ref('/games/' + this.props.id + '/wordMap');
    games.on('value', (snapshot) => {
      let words = snapshot.val();
      this.setState(() => ({words}));
    })
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
    // let team = firebasedb.ref('/games/' + this.props.id + '/turn');
    // team.on('value', (snapshot) => {
    //   let value = snapshot.val();
    //   //this.setState(() => ({words}));
    //   if(value === that.state.team){
    //     that.setState(() => ({turn : true}));
    //   }
    // })
    const team = firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then(function(snapshot) {
      let value = snapshot.val();
      console.log('value here:', value)
      console.log('team here:', that.state.team);
      if(value === that.state.team){
        that.setState(() => ({turn : true}));
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
    //this.setState(()=>({turn : false}));
  }
  render() {
    return (
      <div className="board">
         <h6>Spy Master : {this.state.team} Team</h6>
         <CardField data={this.state.words}/>
         {this.state.turn === true
          ? <div>
              <input placeholder='word' onChange={this.handleInput}/>
              <div className ='ol'>
                <div onClick={() => {this.handleNumber(1)}}> </div>
                <div onClick={() => {this.handleNumber(2)}}> </div>
                <div onClick={() => {this.handleNumber(3)}}> </div>
                <div onClick={() => {this.handleNumber(4)}}> </div>
              </div>
             <button onClick={this.handleSubmitWord}>Submit</button>
            </div>
          : null
         }
      </div>
    );
  }
}

export default SpyMasters;