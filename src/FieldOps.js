import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';

class FieldOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {},
      turn: false,
      team: false
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
    const team = firebasedb.ref('/games/' + this.props.id + '/turn').once('value').then(function(snapshot) {
      let value = snapshot.val();
      if(value === that.state.team){
        that.setState(() => ({turn : true}));
      }
    });
  }
  render() {
    return (
      <div className="board">
        <h6>Field Operations</h6>
        <CardField data={this.state.words}/>
        {this.state.turn === true ? <button>Submit</button> : null}
      </div>
    );
  }
}

export default FieldOps;
