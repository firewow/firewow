/**
 * Imports
 */
import React           from 'react'
import { Icon, Input } from 'react-materialize';
import Loader          from 'components/composition/loader'
import Modal           from 'components/composition/modal'
import RuleItem        from 'components/composition/ruleItem'
import RuleForm        from 'components/composition/rule_form'

/**
 * Component
 */
export default class RulesPanel extends React.Component {

    constructor() {
        super();

        this.state = {
          modal: {
            headerColor: 'grey',
            title: '',
            disabled: false,
            data: {},
            buttons: []
          },

          rules: [
            { name: 'Rule 1', className: 'accept' },
            { name: 'Rule 2', className: 'drop' },
            { name: 'Rule 3', className: 'accept' },
            { name: 'Rule 4', className: 'drop' }
          ]
        };
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

    handleOpenModal = (type) => {

      return () => {

        console.log('changing modal to ' + type);

        var callbackCancel = () => {
          $("#modal").closeModal();
        }

        switch (type) {
          case 'create':

            this.setState({
              modal: {
                headerColor: 'green',
                title: 'Creating rule',
                disabled: false,
                data: {},
                buttons: [
                  {text: 'ADD'   , isClose: true},
                  {text: 'CANCEL', isClose: true, callback: callbackCancel}
                ]
              }
            });
            break;

          case 'modify':

            this.setState({
              modal: {
                headerColor: 'orange',
                title: 'Modifying rule',
                disabled: false,
                data: {},
                buttons: [
                  {text: 'MODIFY', isClose: true},
                  {text: 'CANCEL', isClose: true, callback: callbackCancel}
                ]
              }
            });
            break;

          case 'destroy':
            this.setState({
              modal: {
                headerColor: 'deep-orange',
                title: 'Removing rule',
                disabled: true,
                data: {},
                buttons: [
                  {text: 'REMOVE IT!', isClose: true},
                  {text: 'CANCEL'    , isClose: true, callback: callbackCancel}
                ]
              }
            });
            break;

          default:
            console.log('No form was found for ' + type);
        }

        $('#modal').openModal();

      }

    }

    handleApplyChanges = () => {

      //Flush rules

    }

    handleFormAction = (data) => {

      console.log('saving form ', data);

    }

    componentDidMount() {

        $('.rules-action-bar li').tooltip({ delay: 50 });

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

      var rules = this.state.rules.map((rule, key) => {
          return (
              <RuleItem key={key} className={rule.className} name={rule.name} onInteraction={this.handleOpenModal} />
          );
      });

      return(
          <div className='rules-panel'>

              <Loader text='Processing changes' textDone='Process complete' id='rulesPanelLoader' className='esconder'/>

              <div className='rules-action-bar white grey darken-3-text'>

                  <div>RULES PANEL</div>

                  <ul>
                      <li data-position='top' data-tooltip='Flush rules' onClick={this.handleApplyChanges}><Icon>backup</Icon></li>
                      <li data-position='top' data-tooltip='Add a rule' onClick={this.handleOpenModal('create')}><Icon>add_circle</Icon></li>
                  </ul>

              </div>

              <div className='rules-list-wrapper'>

                  <ul className='rules-list' id='sortable'>

                      {rules}

                  </ul>

              </div>

              <div className='rules-reminder'>
                  <span>* The priority of the rules are given by their order in the list.</span>
                  <span>* Your rules will not work until you flush them.</span>
              </div>

              <Modal
                  id='modal'
                  headerColor={this.state.modal.headerColor}
                  title={this.state.modal.title}
                  content={ <RuleForm ref='rule_form' formData={this.state.modal.data} submitCallback={this.handleFormAction} disabled={this.state.modal.disabled} /> }
                  buttons={this.state.modal.buttons}
              />

          </div>
      );
  }
}
