/**
 * Imports
 */
import React from 'react';


export default class Modal extends React.Component {

    render () {

        var buttons = this.props.buttons.map(function(button, key) {
            return (
                <a href="#!" key={key} className={'waves-effect waves-teal btn-flat' + (button.isClose ? ' modal-action modal-close' : '')}>{button.text}</a>
            );
        });

        return (
            <div id={this.props.id} className={'modal ' + this.props.className}>
                <div className="modal-content">
                    <h4>{this.props.title}</h4>
                    {this.props.content}
                </div>

                <div className="modal-footer">
                    {buttons}
                </div>
            </div>

        );

    }

}
