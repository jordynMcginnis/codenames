import React, { Component } from 'react';

class Card extends Component {
  render() {
    return (
      <div className={this.props.chosenClassName} onClick={() => {this.props.handleSelection(this.props.word)}}>
        {this.props.word}
      </div>
    );
  }
}

export default Card;