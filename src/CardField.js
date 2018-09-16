import React, { Component } from 'react';
import Card from './Card.js';

class CardField extends Component {
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.data).map(() => <Card/>)}
      </div>
    );
  }
}

export default CardField;
