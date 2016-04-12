/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';


export default class RuleItem extends React.Component {

    componentDidMount() {

        var bar = $(this.refs.item).find('.rule-actions');
        bar.animate({
            width: 'toggle'
        });

        $(this.refs.item).hover(function() {
            bar.css('display', 'block');
            bar.clearQueue().stop().animate({
                width: 90,
                opacity: 1
            });
        }, function() {
            bar.clearQueue().stop().animate({
                width: 0,
                opacity: 0
            }, function() {
                bar.css('display', 'none');
            });
        });
    }

    render() {

        var protocol = this.props.protocol;

        if(protocol === 'both') {
            protocol = 'TCP/UDP'
        }

        return (
            <li ref='item' className={this.props.action}>
                <span className={'rule-direction ' + this.props.direction}>{this.props.direction}</span>
                <span className={'rule-protocol ' + this.props.protocol}>{protocol}</span>
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
