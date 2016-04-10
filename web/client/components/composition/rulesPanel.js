/**
 * Imports
 */
import React           from 'react'
import { Icon, Input } from 'react-materialize';
import Loader          from 'components/composition/loader'
import Modal           from 'components/composition/modal'
import RuleForm        from 'components/composition/rule_form'

/**
 * Component
 */
export default class RulesPanel extends React.Component {

    constructor() {
        super();
    }

    showLoader = () => {
        var toastContent = $('#rulesPanelLoader').html();
        Materialize.toast(toastContent, 5000, 'white rounded');
    }

    hideLoader = () => {
        $('#toast-container').empty();
        var toastContent = $('#rulesPanelLoader').find('.toasted-done').clone().removeClass('esconder');
        Materialize.toast(toastContent, 5000, 'white rounded');
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

        $('.rules-action-bar li').tooltip({ delay: 50 });

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

                <Loader text='Processing changes' textDone='Process complete' id='rulesPanelLoader' className='esconder'/>

                <div className='rules-action-bar white grey darken-3-text'>

                    <div>RULES PANEL</div>

                    <ul>
                        <li data-position='top' data-tooltip='Flush rules' onClick={this.handleApplyChanges}><Icon>backup</Icon></li>
                        <li data-position='top' data-tooltip='Add a rule' onClick={this.handleRuleAdd}><Icon>add_circle</Icon></li>
                    </ul>

                </div>

                <div className='rules-list-wrapper'>

                    <ul className='rules-list' id='sortable'>

                        {this.props.children}

                    </ul>

                </div>

                <div className='rules-reminder'>
                    <span>* The priority of the rules are given by their order in the list.</span>
                    <span>* Your rules will not work until you flush them.</span>
                </div>

                <Modal
                    id='addModal'
                    headerColor='green'
                    title='Add a new rule'
                    content={
                        <RuleForm/>
                    }
                    buttons={addModalButtons}
                />

                <Modal
                    id='modModal'
                    headerColor='orange'
                    title='Modifying rule'
                    content={
                        <RuleForm/>
                    }
                    buttons={modModalButtons}
                />

                <Modal
                    id='remModal'
                    headerColor='deep-orange'
                    title='Removing rule'
                    content={
                        <RuleForm disabled={true} protocol='udp'/>
                    }
                    buttons={remModalButtons}
                />

            </div>
        );
    }

}
