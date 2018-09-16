import React, { Component } from 'react';
import Card from './Card.js';

class CardField extends Component {
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.data).map((obj) => <Card value={obj} class1={JSON.stringify(this.props.data[obj])}/>)}
      </div>
    );
  }
}

export default CardField;
