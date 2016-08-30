/**
 * Imports
 */
import React                          from 'react'
import { Icon, Input }                from 'react-materialize'
import Loader                         from 'components/composition/loader'
import Modal                          from 'components/composition/modal'
import DomainItem                       from 'components/composition/domain_item'
import DomainForm                       from 'components/composition/domain_form'
import DomainEditor                     from 'components/composition/domain_editor'
import { DomainsStore, DomainsActions }   from 'data/domains'

/**
 * Component
 */
export default class DomainsPanel extends React.Component {

    /**
     * Constructor
     */
    constructor() {
        super();
        this.state = {
            domains: DomainsStore.getState().domains
        };
    }

    /**
     * Show loader
     */
    showLoader = () => {
        var toastContent = $('#domainsPanelLoader').html();
        Materialize.toast(toastContent, 5000, 'white rounded');
    }

    /**
     * Hide loader
     */
    hideLoader = () => {
        $('#toast-container').empty();
        var toastContent = $('#domainsPanelLoader').find('.toasted-done').clone().removeClass('esconder');
        Materialize.toast(toastContent, 5000, 'white rounded');
    }

    showTrash = () => {
        $(this.refs.trash).slideDown("slow");
    }

    hideTrash = () => {
        $(this.refs.trash).slideUp("slow");
    }

    /**
     * Add domain
     */
    handleAddDomain = () => {

        var emptyDomain = {
            name: ''
        };

        this.refs.editor.open($.extend(emptyDomain, {
            name: '',
            color: 'green',
            title: 'New domain',
            editable: true,
            buttons: {
                submit: (editor) => {
                    this.pushDomain(editor.getData());
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
    handleModifyDomain = (index) => {
        return () => {
            this.refs.editor.open($.extend(this.state.domains[index], {
                color: 'orange',
                title: 'Edit domain',
                editable: true,
                buttons: {
                    submit: (editor) => {
                        this.updateDomain(index, editor.getData());
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
    handleDestroyDomain = (index) => {
        return () => {
            this.refs.editor.open($.extend(this.state.domains[index], {
                color: 'deep-orange',
                title: 'Remove domain',
                editable: false,
                buttons: {
                    destroy: (editor) => {
                        this.removeDomain(index);
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
     * Domain saved locally
     */
    pushDomain = (domain) => {
        var domains = this.state.domains;
        domains.push(domain);
        this.setState({ domains });
        this.showTrash();
    }


    /**
     * Domain updated locally
     */
    updateDomain = (index, domain) => {
        var domains = this.state.domains;
        domains[index] = domain;
        this.setState({ domains });
        this.showTrash();
    }

    /**
     * Domain removed locally
     */
    removeDomain = (index) => {
        var domains = this.state.domains;
        domains.splice(index, 1);
        this.setState({ domains });
        this.showTrash();
    }

    /**
     * Form action
     */
    handleFlush = (data) => {
        DomainsActions.flush(this.state.domains);
        this.hideTrash();
    }

    /**
     * Discard all changes that have not been flushed yet
     */
    handleDiscardChanges = () => {
        this.handleDomainsUpdate();
        this.hideTrash();
    }

    /**
     * Component mount
     * @return {[type]} [description]
     */
    componentDidMount() {

        $('.domains-action-bar li').tooltip({
            delay: 50
        });

        this.hideTrash();

        // Listen
        DomainsStore.listen(this.handleDomainsUpdate);

        // Fetch
        DomainsActions.fetch.defer();
    }

    /**
     * Update
     */
    componentDidUpdate() {
        /*
        $( '#sortable' ).sortable({
            placeholder: 'drag-domain-helper',
            start: ( event, ui ) => {
                ui.item.find('.domain-actions').animate({
                    width: 'toggle'
                });

                this.oldPosition = ui.item.index();
            },
            stop: ( event, ui ) => {
                ui.item.find('.domain-actions').clearQueue().stop().animate({
                    width: 0,
                    opacity: 0
                }, function() {
                    ui.item.find('.domain-actions').css('display', 'none');
                });

                this.reorderDomains(this.oldPosition, ui.item.index());
            },
            update: ( event, ui ) => {
                this.showTrash();
            }

        });

        $( '#sortable' ).disableSelection();
        */
    }

    /**
     * Unmount
     */
    componentWillUnmount() {
        DomainsStore.unlisten(this.handleDomainsUpdate);
    }

    /**
     * Domain store updated
     */
    handleDomainsUpdate = () => {
        var domains = JSON.parse(JSON.stringify(DomainsStore.getState().domains));

        this.setState({
            domains: domains
        });
    }

    /**
     * Reorder requested
     */
    reorderDomains = (oldPosition, newPosition) => {

        var domains = this.state.domains;

        var element = domains.splice(oldPosition, 1)[0];

        domains.splice(newPosition, 0, element);

        this.setState({ domains: domains });

    }

    /**
     * Render domain list
     */
    renderDomains() {
        return Object.keys(this.state.domains).map((key, index) => {
            var domain = this.state.domains[key];
            return (
                <DomainItem
                    key={Math.random()}
                    action='drop'
                    name={domain.name}
                    onModify={this.handleModifyDomain(index)}
                    onDestroy={this.handleDestroyDomain(index)}
                    />
            );
        });
    }

    /**
     * Render domain panel
     */
    render() {

        var domains = this.renderDomains();
        var domainsElement = null;

        if (domains.length == 0) {
            domainsElement = (
                <div style={{color: 'white', margin: 20}}>
                    There are no domains detected at the moment. Maybe you need create a new one...
                </div>
            );
        } else {
            domainsElement = (
                <ul ref='domains_list' className='domains-list' id='sortable'>
                    {domains}
                </ul>
            );
        }

        return (
            <div className='domains-panel'>

                <Loader text='Processing changes' textDone='Process complete' id='domainsPanelLoader' className='esconder'/>

                <div className='domains-action-bar grey lighten-2 grey darken-3-text'>
                    <div>Domains</div>
                    <ul>
                        <li data-position='top' ref='trash' data-tooltip='Discard changes' onClick={this.handleDiscardChanges}><Icon>delete</Icon></li>
                        <li data-position='top' data-tooltip='Flush domains' onClick={this.handleFlush}><Icon>backup</Icon></li>
                        <li data-position='top' data-tooltip='Add a domain' onClick={this.handleAddDomain}><Icon>add_circle</Icon></li>
                    </ul>
                </div>

                <div className='domains-list-wrapper'>
                    {domainsElement}
                </div>

                <div className='domains-reminder'>
                    <span>* The priority of the domains are given by their order in the list.</span>
                    <span>* Your domains will not work until you flush them.</span>
                </div>

                <DomainEditor modal_id="domain_editor" ref="editor" />

            </div>
        );
    }
}
