/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';


export default class RuleItem extends React.Component {
  
    render() {

        return (
            <li className={this.props.className}>
                <span>{this.props.name}</span>

                <div className='rule-actions'>
                  <div onClick={this.props.onInteraction('modify')}>
                    <Icon>create</Icon>
                  </div>

                  <div onClick={this.props.onInteraction('destroy')}>
                    <Icon>remove_circle_outline</Icon>
                  </div>
                </div>
            </li>
        );
    }

}
