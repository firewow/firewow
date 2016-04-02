/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';

/**
 * Component
 */
export default class Menu extends React.Component {

    render() {
        return(
            <div className='rules-panel'>

                <div className='rules-action-bar red white-text'>

                    <ul>
                        <li><Icon>face</Icon></li>
                    </ul>

                </div>

                <ul className='rules-list'>

                    <li>A rule :D</li>
                    {this.props.children}

                </ul>

            </div>
        );
    }

}
