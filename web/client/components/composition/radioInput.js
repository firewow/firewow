/**
* Imports
*/
import React from 'react'

export default class RadioInput extends React.Component {

componentWillMount() {
  this.id = Math.random().toString(36).substring(7) + Math.floor((Math.random() * 1000) + 1);
}


componentDidMount() {
  if(this.props.checked) {

    $("#" + this.id).prop("checked", true);

  }
}


render() {

  var element = '';

  if(this.props.inline) {

    element = (<span>
      <input name={this.props.group} type='radio' id={this.id} />
      <label htmlFor={this.id}>{this.props.text}</label>
    </span>);

  } else {
    element = (<p>
      <input name={this.props.group} type='radio' id={this.id} />
      <label htmlFor={this.id}>{this.props.text}</label>
    </p>);
  }

  return element;

}

}
