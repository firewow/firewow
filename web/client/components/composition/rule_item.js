/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';


export default class RuleItem extends React.Component {

    render() {
        return (
            <li className={this.props.action}>
                <span className={'rule-direction ' + this.props.direction}>{this.props.direction}</span>
                <span className={'rule-protocol ' + this.props.protocol}>{this.props.protocol}</span>
                <span className='rule-name'>{this.props.name}</span>
                <div className='rule-actions'>
                  <div onClick={this.props.onModify}>
                    <Icon>create</Icon>
                  </div>
                  <div onClick={this.props.onDestroy}>
                    <Icon>remove_circle_outline</Icon>
                  </div>
                </div>
            </li>
        );
    }

}
