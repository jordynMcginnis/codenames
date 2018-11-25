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
    this.props.handleSubmit([guess]);
  }
  wordNotGuessed = (codeWord) => {
    return this.props.codeWordMap[codeWord] === false
  }
  guessSelected = (codeWord) => {
    return this.state.selection.includes(codeWord)
      ? 'selected'
      : JSON.stringify(this.props.codeWordMap[codeWord])
  }
  pastTeamGuesses = (codeWord) => {
    return this.props.codeWordMap[codeWord];
  }
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.codeWordMap).map((codeWord) => {
          return (
            <Card
              word={codeWord}
              handleSelection={this.handleSelection}
              chosenClassName={this.wordNotGuessed(codeWord) === true
                ? this.guessSelected(codeWord)
                : this.pastTeamGuesses(codeWord)
              }
            />
          )
        })}
      </div>
    );
  }
}

export default CardField;