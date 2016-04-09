/**
 * Imports
 */
import React           from 'react'
import { Icon, Input } from 'react-materialize';
import Loader          from 'components/composition/loader'
import Modal           from 'components/composition/modal'
import CustomSwitch    from 'components/composition/customSwitch'
import RadioInput      from 'components/composition/radioInput'
import CheckInput      from 'components/composition/checkInput'

/**
 * Component
 */
export default class RulesPanel extends React.Component {

    constructor() {
        super();
        this.state = {
          protocol: 'tcp',
          srcaddr_type: 'any'
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

    handleToggleIpSourceRange = () => {

      if($(".siprange").css("display") === "none") {
        $(".siprange").removeClass('esconder').hide();
        $(".siprange").slideDown("slow");
      } else {
        $(".siprange").slideUp("slow");
      }

    }

    handleStateChange = (name, type) => {
      return () => {
        console.log('changing ' + name + ' to ' + type);
        var obj = {};
        obj[name] = type;
        this.setState(obj);
      };
    }

    renderSourceAddress() {
      switch (this.state.srcaddr_type) {
        case 'any':
          return (
            <span>&nbsp;</span>
          );
        case 'single':
          return (
            <Input ref="srcaddr_start" s={12} label='Address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
          );
        case 'range':
          return (
            <div>
            <Input ref="srcaddr_start" s={12} label='Start address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
            <Input ref="srcaddr_end" s={12} label='End address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
            </div>
          );
        default:
          return "wtf u did";
      }
    }

    componentDidMount() {
        //Simulating loader
        var panel = this;

        setTimeout(function() {
            panel.showLoader();

            setTimeout(function() {
                panel.hideLoader();
            }, 2000);
        }, 3000);

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
                        <form className='col s12'>

                            <CustomSwitch label='ACTION' onText='PASS' offText='BLOCK' className='rule-policy'/>

                            <div className="col s12 protocol-policy">
                              <label className="lbl">Protocol</label>
                              <RadioInput text='TCP'  inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'tcp')} />
                              <RadioInput text='UDP'  inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'udp')} />
                              <RadioInput text='BOTH' inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'both')} />
                            </div>

                            <div className='source-settings'>
                              <h4>Source settings</h4>

                              <h5 className='col s12'>Source IP</h5>
                              <div className="col s12 protocol-policy">
                                <RadioInput text='ANY' inline={true} group='protocol' onChange={this.handleStateChange('srcaddr_type', 'any')} />
                                <RadioInput text='SINGLE' inline={true} group='protocol' onChange={this.handleStateChange('srcaddr_type', 'single')} />
                                <RadioInput text='RANGE' inline={true} group='protocol' onChange={this.handleStateChange('srcaddr_type', 'range')} />
                              </div>

                              {this.renderSourceAddress()}

                              <h5 className='col s12'>Source Port</h5>
                              <CheckInput text='Use range for source port' inline={true} group='useRangeSource' className='left padding-1x-left'/>
                              <Input s={12} label='Starts from port' type='number'/>
                              <div className='sportrange esconder'>
                                <Input s={12} label='Ends on port' type='number'/>
                              </div>
                            </div>

                            <CheckInput text='Use range for destination IP' inline={true} group='useRangeSource' className='left padding-1x-left'/>
                            <Input s={12} label='Type the destination IP address to start' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                            <div className='diprange esconder'>
                              <Input s={12} label='Type the destination IP address to end' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                            </div>

                            <CheckInput text='Use range for destination port' inline={true} group='useRangeSource' className='left padding-1x-left'/>
                            <Input s={12} label='Starts from port' type='number'/>
                            <div className='dportrange esconder'>
                              <Input s={12} label='Ends on port' type='number'/>
                            </div>

                        </form>
                    }
                    buttons={addModalButtons}
                />

                <Modal
                    id='modModal'
                    headerColor='orange'
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
                    headerColor='deep-orange'
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
