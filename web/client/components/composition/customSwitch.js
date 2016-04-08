/**
* Imports
*/
import React from 'react'

export default class CustomSwitch extends React.Component {

  render() {

    return(

      <div className={'custom-switch ' +  this.props.className}>

        <label className='custom-switch-label'>{this.props.label}</label>

        <div className={'switch'}>
          <label>
            {this.props.offText}
            <input type='checkbox'/>
            <span className='lever'></span>
            {this.props.onText}
          </label>
        </div>

      </div>

    );

  }

}
