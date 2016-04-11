/**
 * Imports
 */
import React from 'react';


export default class Modal extends React.Component {

    render () {

        var buttons = this.props.buttons.map(function(button, key) {
            return (
                <a href="#!" key={key} className='waves-effect waves-light btn-flat white-text' onClick={button.callback}>{button.text}</a>
            );
        });

        return (
            <div id={this.props.id} className={'modal modal-fixed-header' + (this.props.className ? ' ' + this.props.className : '')}>
                <div className={"modal-header " + this.props.headerColor}>
                    <h4>{this.props.title}</h4>
                </div>

                <div className="modal-content">

                    {this.props.content}

                </div>

                <div className="modal-footer">
                    {buttons}
                </div>

            </div>

        );

    }

}
