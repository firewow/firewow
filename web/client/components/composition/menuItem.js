/**
 * Imports
 */
import React from 'react'

/**
 * Component
 */
export default class Menu extends React.Component {

    render() {

        var innerCssClass = 'menu-item ' + this.props.orientation + ' ' + this.props.color;

        return(
            <div className={innerCssClass} onClick={this.props.onClick}>
                <p>{this.props.text}</p>
            </div>
        );
    }

}
