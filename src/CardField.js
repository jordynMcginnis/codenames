import React, { Component } from 'react';
import Card from './Card.js';

class CardField extends Component {
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.data).map((obj) => {
          if(this.props.data[obj] === false){
            return <Card value={obj} class1={JSON.stringify(this.props.data[obj])}/>
          } else {
            return <Card value={obj} class1={this.props.data[obj]}/>
          }
        }

          )}
      </div>
    );
  }
}

export default CardField;
