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
      singleWord: ''
    };
  }
  componentDidMount () {
    let games = firebasedb.ref('/games/' + this.props.id + '/wordMap');
    games.on('value', (snapshot) => {
      let words = snapshot.val();
      this.setState(() => ({words}));
    })
  }
  handleNumber = (num) => {
    this.setState(() => ({num}));
  }
  handleInput = ({target}) => {
    this.setState(() => ({singleWord: target.value}));
  }
  handleSubmitWord = () => {
    submitWord(this.props.id, this.state.singleWord, this.state.num);
  }
  render() {
    return (
      <div className="board">
         <h6>Spy Master</h6>
         <CardField data={this.state.words}/>
         <input placeholder='word' onChange={this.handleInput}/>
         <ol>
           <li onClick={() => {this.handleNumber(1)}}> </li>
           <li onClick={() => {this.handleNumber(2)}}> </li>
           <li onClick={() => {this.handleNumber(3)}}> </li>
           <li onClick={() => {this.handleNumber(4)}}> </li>
         </ol>
         <button onClick={this.handleSubmitWord}>Submit</button>
      </div>
    );
  }
}

export default SpyMasters;