/**
* Imports
*/
import React from 'react'

export default class CheckInput extends React.Component {

render() {

  var inputID = this._reactInternalInstance._rootNodeID;

  var element = '';

  if(this.props.inline) {
    element = (<span className={this.props.className ? this.props.className : ''}>
      <input name={this.props.group} type='checkbox' id={inputID} onChange={this.props.onChange} />
      <label htmlFor={inputID}>{this.props.text}</label>
    </span>);
  } else {
    element = (<p className={this.props.className ? this.props.className : ''}>
      <input name={this.props.group} type='checkbox' id={inputID} onChange={this.props.onChange} />
      <label htmlFor={inputID}>{this.props.text}</label>
    </p>);
  }

  return element;

}

}
