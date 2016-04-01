/**
 * Imports
 */
import React from 'react'

/**
 * Component
 */
export default class Menu extends React.Component {

    render() {
        return(
            <div className='menu'>
                {this.props.children}
            </div>
        );
    }

}
