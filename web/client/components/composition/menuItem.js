/**
 * Imports
 */
import React from 'react'

/**
 * Component
 */
export default class Menu extends React.Component {

    render() {
        
        var innerCssClass = 'menu-item ' + this.props.orientation;

        return(
            <div className={innerCssClass}>
                <p>{this.props.text}</p>
            </div>
        );
    }

}
