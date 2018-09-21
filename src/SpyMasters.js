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
    //this.setState(()=> ({turn: this.props.turn}));
    console.log('SpyMaster component rerenders here')
    //THIS ONLY RUNS WHEN WORDMAP IS UPDATED SO NOT OFTEN LOL
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
      console.log('right here ran and updated');
    })


    const name = this.props.name;
    const that = this;
    const key = firebasedb.ref('/games/' + this.props.id + '/players').once('value').then(function(snapshot) {
      let playersArr = Object.keys(snapshot.val());
      let playersObj = snapshot.val();
      for(var i = 0; i < playersArr.length; i++) {
        if(playersObj[playersArr[i]] === name) {
          that.setState(() => ({team: playersArr[i].slice(0,1)}));
          //that.handleTeam();
          break;
        }
      }
    });
    //EVERYTIME TURN CHANGES CALLS HANDLETEAM
    let team = firebasedb.ref('/games/' + this.props.id + '/turn');
    team.on('value', (snapshot) => {
    //   let value = snapshot.val();
    //   //this.setState(() => ({words}));
    //   //THIS SHOULD RUN EVERYTIME BUTTON GETS PUSHED? CHECK
    //   console.log('value here:', value)
    //   console.log('state team here:', that.state.team);

    //   if(value === that.state.team){
    //     that.setState(() => ({turn : true}));
    //   }
    that.handleTeam();
    })


  };


  handleTeam = () => {
    const that = this;

    const team = firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then(function(snapshot) {
      let value = snapshot.val();
      console.log('value here:', value)
      console.log('state team here:', that.state.team);
      //console.log('this.props.turn here:', that.props.turn)
      if(value === that.state.team){
        that.setState(() => ({turn : true}));
      } else {
        that.setState(() => ({turn : false}));
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
    console.log('enter word')
  }
  render() {
    return (
      <div className="board">
         <h6>Spy Master for Team:
           {this.state.team === 'r'
             ? <span className='red-team1'> Red</span>
             : <span className='blue-team1'> Blue</span>
           }
           Team
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