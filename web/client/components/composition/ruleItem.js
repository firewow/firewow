/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';


export default class RuleItem extends React.Component {

    render() {

        return (
            <li>
                <span>{this.props.name}</span>

                <div className='rule-actions'>
                    <Icon>create</Icon>
                    <Icon>remove_circle_outline</Icon>
                </div>
            </li>
        );
    }

}
