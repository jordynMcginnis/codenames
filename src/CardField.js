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
    console.log('maximun', this.props.maxNum)
    // if(this.props.maxNum !== false){
    //   if(currentArr.length === this.props.maxNum){
    //     currentArr.shift();
    //     currentArr.push(value);
    //     this.setState(()=> ({selection : currentArr}));
    //   } else {
    //     currentArr.push(value);
    //     this.setState(()=> ({selection : currentArr}));
    //   }
    //   this.props.handleSubmit(this.state.selection);
    // }
    currentArr[0] = value;
    this.props.handleSubmit(this.state.selection)
  }
  render() {
    return (
      <div className="card-field">
        {Object.keys(this.props.data).map((obj) => {
          if(this.props.data[obj] === false){
            if(this.state.selection.indexOf(obj) > -1){
              console.log(true)
              return <Card value={obj} handleSelection={this.handleSelection} class1='selected'/>
            } else {
              console.log(false, this.props.data[obj])
              return <Card value={obj} handleSelection={this.handleSelection} class1={JSON.stringify(this.props.data[obj])}/>
            }

          } else {
            if(this.props.data[obj] === 'red-selected'){
              return <Card value={obj} handleSelection={this.handleSelection} class1='red-selected'/>
            } else if (this.props.data[obj] === 'blue-selected') {
              return <Card value={obj} handleSelection={this.handleSelection} class1='blue-selected'/>
            } else {
              return <Card value={obj} handleSelection={this.handleSelection} class1={this.props.data[obj]}/>
            }

          }
          }
        )}
      </div>
    );
  }
}

export default CardField;
