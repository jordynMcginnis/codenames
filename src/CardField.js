import React, { Component } from 'react';
import Card from './Card.js';

class CardField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: []
    };
  }
  handleSelection = (guess) => {
    let playerGuesses = this.state.selection;
    playerGuesses[0] = guess;
    this.props.handleSubmit(this.state.selection);
  }
  wordNotGuessed = (codeWord) => {
    return this.props.codeWordMap[codeWord] === false
  }
  guessSelected = (codeWord) => {
    return this.state.selection.indexOf(codeWord) > -1
      ? 'selected'
      : JSON.stringify(this.props.codeWordMap[codeWord])
  }
  pastTeamGuesses = (codeWord) => {
    if(this.props.codeWordMap[codeWord] === 'red-selected'){
      return 'red-selected'
    } else if(this.props.codeWordMap[codeWord] === 'blue-selected'){
      return 'blue-selected'
    } else {
      return this.props.codeWordMap[codeWord]
    }
  }
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.codeWordMap).map((codeWord) => {
          if(this.wordNotGuessed(codeWord) === true){
            return <Card word={codeWord} handleSelection={this.handleSelection} chosenClassName={this.guessSelected(codeWord)}/>
          } else {
            return <Card word={codeWord} handleSelection={this.handleSelection} chosenClassName={this.pastTeamGuesses(codeWord)}/>
          }
        })}
      </div>
    );
  }
}

export default CardField;