/**
 * Imports
 */
import React           from 'react'
import { Icon, Input } from 'react-materialize';
import Loader          from 'components/composition/loader'
import Modal           from 'components/composition/modal'

require("jquery-ui/jquery-ui.js");

/**
 * Component
 */
export default class RulesPanel extends React.Component {

    showLoader = () => {
        $("#rulesPanelLoader").removeClass("esconder").hide();
        $("#rulesPanelLoader").fadeIn();
    }

    hideLoader = () => {
        $("#rulesPanelLoader").find(".loader").fadeOut();
        $("#rulesPanelLoader").find(".done").removeClass("esconder").hide().fadeIn();

        $("#rulesPanelLoader").fadeIn().delay(2500).fadeOut();
    }

    handleRuleAdd = () => {

        $('#addModal').openModal();

    }

    handleRuleModify = () => {

        $('#modModal').openModal();

    }

    handleRuleRemoval = () => {

        $('#remModal').openModal();

    }

    handleApplyChanges = () => {

      //Apply...

    }

    componentDidMount() {

        //Simulating loader
        var panel = this;

        setTimeout(function() {
            panel.showLoader();
            Materialize.toast('Suck me', 3000, 'rounded')

            setTimeout(function() {
                panel.hideLoader();
            }, 3000);
        }, 3000);

        $('.rule-actions i').on('click', function() {

            if($(this).text() === 'create') {
                panel.handleRuleModify();
            } else {
                panel.handleRuleRemoval();
            }

        });

        $( '#sortable' ).sortable({
          placeholder: 'drag-rule-helper',
          start: function( event, ui ) {
              ui.item.find('.rule-actions').animate({
                 width: 'toggle'
              });
          },
          stop: function( event, ui ) {
              ui.item.find('.rule-actions').clearQueue().stop().animate({
                  width: 0,
                  opacity: 0
              }, function() {
                  ui.item.find('.rule-actions').css('display', 'none');
              });
          }
        });

        $( '#sortable' ).disableSelection();

        $('.rules-list li').each(function() {

            var bar = $(this).find('.rule-actions');
            bar.animate({
                width: 'toggle'
            });

        });

        $('.rules-list li').hover(function() {

            var bar = $(this).find('.rule-actions');

            bar.css('display', 'block');

            bar.clearQueue().stop().animate({
                width: 100,
                opacity: 1
            });

        }, function() {

            var bar = $(this).find('.rule-actions');

            bar.clearQueue().stop().animate({
                width: 0,
                opacity: 0
            }, function() {
                bar.css('display', 'none');
            });

        });

    }

    render() {

        var addModalButtons = [
            {text: 'ADD', isClose: true},
            {text: 'CANCEL', isClose: true}
        ];

        var modModalButtons = [
            {text: 'MODIFY', isClose: true},
            {text: 'CANCEL', isClose: true}
        ];

        var remModalButtons = [
            {text: 'REMOVE IT!', isClose: true},
            {text: 'CANCEL', isClose: true}
        ];

        return(
            <div className='rules-panel'>

                <Loader text="Processing changes" id="rulesPanelLoader" className="esconder"/>

                <div className='rules-action-bar white grey darken-3-text'>

                    <div>RULES PANEL</div>

                    <ul>
                        <li className="tooltipped" data-position="right" onClick={this.handleApplyChanges} data-tooltip="Apply changes"><Icon>backup</Icon></li>
                        <li className="tooltipped" data-position="right" onClick={this.handleRuleAdd} data-tooltip="Add a rule"><Icon>add_circle</Icon></li>
                    </ul>

                </div>

                <div className='rules-list-wrapper'>

                    <ul className='rules-list' id='sortable'>

                        {this.props.children}

                    </ul>

                </div>

                <div className="rules-reminder">
                    <span>* The priority of the rules are given by their order in the list.</span>
                    <span>* Your rules will not work until you flush them.</span>
                </div>

                <Modal
                    id='addModal'
                    title='Add a new rule'
                    content={
                        <form className='col s12'>
                            <Input s={12} label='IP' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+'>
                                <Icon>account_circle</Icon>
                            </Input>
                            <Input s={12} label='PORT' type='number'>
                                <Icon>lock</Icon>
                            </Input>
                        </form>
                    }
                    buttons={addModalButtons}
                />

                <Modal
                    id='modModal'
                    title='Modifying rule'
                    content={
                        <form className='col s12'>
                            <Input s={12} label='IP' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+'>
                                <Icon>account_circle</Icon>
                            </Input>
                            <Input s={12} label='PORT' type='number'>
                                <Icon>lock</Icon>
                            </Input>
                        </form>
                    }
                    buttons={modModalButtons}
                />

                <Modal
                    id='remModal'
                    title='Removing rule'
                    content={
                        <form className='col s12'>
                            <Input disabled s={12} label='IP' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+'>
                                <Icon>account_circle</Icon>
                            </Input>
                            <Input disabled s={12} label='PORT' type='number'>
                                <Icon>lock</Icon>
                            </Input>
                        </form>
                    }
                    buttons={remModalButtons}
                />

            </div>
        );
    }

}
