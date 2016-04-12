/**
 * Imports
 */
import React                          from 'react'
import { Icon, Input }                from 'react-materialize'
import Loader                         from 'components/composition/loader'
import Modal                          from 'components/composition/modal'
import RuleItem                       from 'components/composition/rule_item'
import RuleForm                       from 'components/composition/rule_form'
import RuleEditor                     from 'components/composition/rule_editor'
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

    showTrash = () => {
        $(this.refs.trash).slideDown("slow");
    }

    hideTrash = () => {
        $(this.refs.trash).slideUp("slow");
    }

    /**
     * Add rule
     */
    handleAddRule = () => {

        var emptyRule = {
            name: '',

            action: 'accept',
            protocol: 'tcp',

            direction: 'in',

            srcaddr_type: 'any',
            srcaddr_min: '',
            srcaddr_max: '',

            srcport_type: 'any',
            srcport_min: 0,
            srcport_max: 0,

            dstaddr_type: 'any',
            dstaddr_min: '',
            dstaddr_max: '',

            dstport_type: 'any',
            dstport_min: 0,
            dstport_max: 0
        };


        this.refs.editor.open($.extend(emptyRule, {
            color: 'green',
            title: 'New rule',
            editable: true,
            buttons: {
                submit: (editor) => {
                    this.pushRule(editor.getData());
                    editor.close();
                },
                cancel: (editor) => {
                    editor.close();
                }
            }
        }));
    }

    /**
     * Modify
     */
    handleModifyRule = (index) => {
        return () => {
            this.refs.editor.open($.extend(this.state.rules[index], {
                color: 'orange',
                title: 'Edit rule',
                editable: true,
                buttons: {
                    submit: (editor) => {
                        this.updateRule(index, editor.getData());
                        editor.close();
                    },
                    cancel: (editor) => {
                        editor.close();
                    }
                }
            }));
        };
    }

    /**
     * Destroy
     */
    handleDestroyRule = (index) => {
        return () => {

            this.refs.editor.open($.extend(this.state.rules[index], {
                color: 'deep-orange',
                title: 'Remove rule',
                editable: false,
                buttons: {
                    destroy: (editor) => {
                        this.removeRule(index);
                        editor.close();
                    },
                    cancel: (editor) => {
                        editor.close();
                    }
                }
            }));
        };
    }

    /**
     * Rule saved locally
     */
    pushRule = (rule) => {
        var rules = this.state.rules;
        rules.push(rule);
        this.setState({ rules });
        this.showTrash();
    }


    /**
     * Rule updated locally
     */
    updateRule = (index, rule) => {

        var rules = this.state.rules;
        rules[index] = rule;
        this.setState({ rules });
        this.showTrash();

    }

    /**
     * Rule removed locally
     */
    removeRule = (index) => {

        var rules = this.state.rules;
        rules.splice(index, 1);
        this.setState({ rules });
        this.showTrash();

    }

    /**
     * Form action
     */
    handleFlush = (data) => {
        console.log('flush rules');
        this.hideTrash();
    }

    /**
     * Discard all changes that have not been flushed yet
     */
    handleDiscardChanges = () => {
        this.handleRulesUpdate();
        this.hideTrash();
    }

    /**
     * Component mount
     * @return {[type]} [description]
     */
    componentDidMount() {

        $('.rules-action-bar li').tooltip({
            delay: 50
        });

        this.hideTrash();

        // Listen
        RulesStore.listen(this.handleRulesUpdate);

        // Fetch
        RulesActions.fetch.defer();
    }

    /**
     * Update
     */
    componentDidUpdate() {
        $( '#sortable' ).sortable({
            placeholder: 'drag-rule-helper',
            start: ( event, ui ) => {
                ui.item.find('.rule-actions').animate({
                    width: 'toggle'
                });

                this.oldPosition = ui.item.index();
            },
            stop: ( event, ui ) => {
                ui.item.find('.rule-actions').clearQueue().stop().animate({
                    width: 0,
                    opacity: 0
                }, function() {
                    ui.item.find('.rule-actions').css('display', 'none');
                });

                this.reorderRules(this.oldPosition, ui.item.index());
            },
            update: ( event, ui ) => {
                this.showTrash();
            }

        });

        $( '#sortable' ).disableSelection();
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
        var rules = JSON.parse(JSON.stringify(RulesStore.getState().rules));

        this.setState({
            rules: rules
        });
    }

    /**
     * Reorder requested
     */
    reorderRules = (oldPosition, newPosition) => {

        var rules = this.state.rules;

        var element = rules.splice(oldPosition, 1)[0];

        rules.splice(newPosition, 0, element);

        this.setState({ rules: rules });

    }

    /**
     * Render rule list
     */
    renderRules() {
        return Object.keys(this.state.rules).map((key, index) => {
            var rule = this.state.rules[key];
            return (
                <RuleItem
                    key={Math.random()}
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
                    There are no rules detected at the moment. Maybe you need create a new one...
                </div>
            );
        } else {
            rulesElement = (
                <ul ref='rules_list' className='rules-list' id='sortable'>
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
                        <li data-position='top' ref='trash' data-tooltip='Discard changes' onClick={this.handleDiscardChanges}><Icon>delete</Icon></li>
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

            </div>
        );
    }
}
