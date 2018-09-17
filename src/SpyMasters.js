import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';

class SpyMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {},
      num: '',
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
    this.setState(num => ({num}));
  }
  handleInput = ({target}) => {
    this.setState(() => ({singleWord: target.value}));
  }
  submitWord = () => {

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
         <button>Submit</button>
      </div>
    );
  }
}

export default SpyMasters;