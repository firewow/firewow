/**
 * Imports
 */
import React            from 'react'
import { Icon, Input }  from 'react-materialize';
import Loader           from 'components/composition/loader'
import Modal            from 'components/composition/modal'
import RuleItem         from 'components/composition/rule_item'
import RuleForm         from 'components/composition/rule_form'
import RuleEditor       from 'components/composition/rule_editor'
import { RulesStore, RulesActions }   from 'data/rules'

/**
 * Component
 */
export default class RulesPanel extends React.Component {

    /**
     * Constructor
     */
    constructor() {
        super();
        this.state = {
            rules: RulesStore.getState().rules
        };
    }

    /**
     * Show loader
     */
    showLoader = () => {
        var toastContent = $('#rulesPanelLoader').html();
        Materialize.toast(toastContent, 5000, 'white rounded');
    }

    /**
     * Hide loader
     */
    hideLoader = () => {
        $('#toast-container').empty();
        var toastContent = $('#rulesPanelLoader').find('.toasted-done').clone().removeClass('esconder');
        Materialize.toast(toastContent, 5000, 'white rounded');
    }

    /**
     * Add rule
     */
    handleAddRule = () => {
        this.refs.editor.open({
            color: 'green',
            title: 'New rule',
            editable: true,
            buttons: {
                submit: (editor) => {
                    console.log('form data: ', editor.getState());
                    editor.close();
                },
                cancel: (editor) => {
                    editor.close();
                }
            }
        });
    }

    /**
     * Modify
     */
    handleModifyRule = (index) => {
        return () => {
            this.refs.editor.open({
                color: 'orange',
                title: 'Edit rule',
                editable: true,
                buttons: {
                    submit: (editor, data) => {
                        console.log('modify called');
                        editor.close();
                    },
                    cancel: (editor) => {
                        editor.close();
                    }
                }
            });
        };
    }

    /**
     * Destroy
     */
    handleDestroyRule = (index) => {
        return () => {
            this.refs.editor.open({
                color: 'red',
                title: 'Remove rule',
                editable: false,
                buttons: {
                    destroy: (editor, data) => {
                        console.log('destroy called');
                        editor.close();
                    },
                    cancel: (editor) => {
                        editor.close();
                    }
                }
            });
        };
    }

    /**
     * Handle apply changes
     */
    handleApplyChanges = () => {
        console.log('apply changes');
    }

    /**
     * Form action
     */
    handleFlush = (data) => {
        console.log('flush rules');
    }

    /**
     * Component mount
     * @return {[type]} [description]
     */
    componentDidMount() {

        $('.rules-action-bar li').tooltip({
            delay: 50
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
                width: 90,
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

        /// Listen
        RulesStore.listen(this.handleRulesUpdate);

        /// Fetch
        RulesActions.fetch.defer();
    }

    /**
     * Unmount
     */
    componentWillUnmount() {
        RulesStore.unlisten(this.handleRulesUpdate);
    }

    /**
     * Rule store updated
     */
    handleRulesUpdate = () => {
        this.setState({
            rules: RulesStore.getState().rules
        });
    }

    /**
     * Render rule list
     */
    renderRules() {
        return Object.keys(this.state.rules).map((key, index) => {
            var rule = this.state.rules[key];
            return (
                <RuleItem
                    key={key}
                    action={rule.action}
                    direction={rule.direction}
                    protocol={rule.protocol}
                    name={rule.name}
                    onModify={this.handleModifyRule(index)}
                    onDestroy={this.handleDestroyRule(index)}
                    />
            );
        });
    }

    /**
     * Render rule panel
     */
    render() {

        var rules = this.renderRules();
        var rulesElement = null;

        if (rules.length == 0) {
            rulesElement = (
                <div style={{color: 'white', margin: 20}}>
                    There are no rules detected at the moment. Maybe create a new one?
                </div>
            );
        } else {
            rulesElement = (
                <ul className='rules-list' id='sortable'>
                    {rules}
                </ul>
            );
        }

        return (
            <div className='rules-panel'>

                <Loader text='Processing changes' textDone='Process complete' id='rulesPanelLoader' className='esconder'/>

                <div className='rules-action-bar white grey darken-3-text'>
                    <div>RULES</div>
                    <ul>
                        <li data-position='top' data-tooltip='Flush rules' onClick={this.handleFlush}><Icon>backup</Icon></li>
                        <li data-position='top' data-tooltip='Add a rule' onClick={this.handleAddRule}><Icon>add_circle</Icon></li>
                    </ul>
                </div>

                <div className='rules-list-wrapper'>
                    {rulesElement}
                </div>

                <div className='rules-reminder'>
                    <span>* The priority of the rules are given by their order in the list.</span>
                    <span>* Your rules will not work until you flush them.</span>
                </div>

                <RuleEditor modal_id="rule_editor" ref="editor" />

                {/*
                <Modal
                    id='modal'
                    headerColor={this.state.modal.headerColor}
                    title={this.state.modal.title}
                    content={ <RuleForm ref='rule_form' formData={this.state.modal.data} submitCallback={this.handleFormAction} disabled={this.state.modal.disabled} /> }
                    buttons={this.state.modal.buttons}
                />
                */}

            </div>
        );
    }
}
