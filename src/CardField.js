import React, { Component } from 'react';
import Card from './Card.js';

class CardField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: []
    };
  }
  handleSelection = (value) => {
    let currentArr = this.state.selection;
    if(currentArr.length === this.props.maxNum){
      currentArr.shift();
      currentArr.push(value);
      this.setState(()=> ({selection : currentArr}));
    } else {
      currentArr.push(value);
      this.setState(()=> ({selection : currentArr}));
    }
    this.props.handleSubmit(this.state.selection);
  }
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.data).map((obj) => {
          if(this.props.data[obj] === false){
            if(this.state.selection.indexOf(this.props.data[obj]) > -1){
              return <Card value={obj} handleSelection={this.handleSelection} class1='selected'/>
            } else {
              return <Card value={obj} handleSelection={this.handleSelection} class1={JSON.stringify(this.props.data[obj])}/>
            }

          } else {
            return <Card value={obj} handleSelection={this.handleSelection} class1={this.props.data[obj]}/>
          }
          }
        )}
      </div>
    );
  }
}

export default CardField;
