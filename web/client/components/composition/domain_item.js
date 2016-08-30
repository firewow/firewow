/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';


export default class DomainItem extends React.Component {

    componentDidMount() {

        var bar = $(this.refs.item).find('.domain-actions');
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
        return (
            <li ref='item' className={this.props.action}>
                <span className='domain-name'>{this.props.name}</span>
                <div className='domain-actions'>
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
