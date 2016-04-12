/**
 * Imports
 */
import React from 'react'

export default class TextInput extends React.Component {

    componentWillMount() {
      this.id = Math.random().toString(36).substring(7) + Math.floor((Math.random() * 1000) + 1);
    }

    render() {

        var inputType = (this.props.type ? this.props.type : 'text');

        var labelClass = (this.props.value ? (this.props.value.length > 0 ? 'active' : '') : '');

        var attrs = [];

        if(this.props.value) {
            attrs['value'] = this.props.value;
        }

        return(
            <div className={'input-field' + (this.props.s ? ' col s' + this.props.s : '')}>
              <input {...attrs} disabled={this.props.disabled} id={this.id} type={inputType} className={this.props.className} onChange={this.props.onChange} />
              <label className={labelClass} htmlFor={this.id}>{this.props.label}</label>
            </div>
        );
    }

}
