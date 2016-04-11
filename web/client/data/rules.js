/**
 * Imports
 */

import alt from './index'
import axios from 'axios'
import { Actions, Store, Handles } from 'utils/decorators'

/**
 * Actions
 */
@Actions()
class RulesActions {

    /**
     * Flush
     */
    flush(rules) {
        setTimeout(() => {
            this.actions.flushSuccess();
        }, 1000);
        this.dispatch();
    }

    /**
     * Flush success
     */
    flushSuccess() {
        this.dispatch();
    }

    /**
     * Flush failed
     */
    flushFailed(error) {
        this.dispatch(error);
    }

    /**
     * Fetch
     */
    fetch() {
        /*
        axios.post("/rules/create", rule).then((response) => {
            this.actions.createSuccess(response);
        }, (error) => {
            this.actions.createFailed(error);
        });
        */
        setTimeout(() => {
            this.actions.fetchSuccess([
                {
                    name: 'Proxy server',
                    action: 'accept',
                    protocol: 'tcp',
                    direction: 'out',
                    srcaddr_type: 'single',
                    srcaddr_min: '192.168.0.1',
                    srcaddr_max: '*',
                    srcport_type: 'any',
                    srcport_min: '*',
                    srcport_max: '*',
                    dstaddr_type: 'any',
                    dstaddr_min: '*',
                    dstaddr_max: '*',
                    dstport_type: 'single',
                    dstport_min: '8080',
                    dstport_max: '*'
                }, {
                    name: 'Block outgoing HTTP',
                    action: 'drop',
                    protocol: 'tcp',
                    direction: 'out',
                    srcaddr_type: 'any',
                    srcaddr_min: '*',
                    srcaddr_max: '*',
                    srcport_type: 'any',
                    srcport_min: '*',
                    srcport_max: '*',
                    dstaddr_type: 'any',
                    dstaddr_min: '*',
                    dstaddr_max: '*',
                    dstport_type: 'single',
                    dstport_min: '80',
                    dstport_max: '*'
                }, {
                    name: 'Block outgoing HTTPS',
                    action: 'drop',
                    protocol: 'tcp',
                    direction: 'out',
                    srcaddr_type: 'any',
                    srcaddr_min: '*',
                    srcaddr_max: '*',
                    srcport_type: 'any',
                    srcport_min: '*',
                    srcport_max: '*',
                    dstaddr_type: 'any',
                    dstaddr_min: '*',
                    dstaddr_max: '*',
                    dstport_type: 'single',
                    dstport_min: '443',
                    dstport_max: '*'
                }
            ]);
        }, 1000);
        this.dispatch();
    }

    /**
     * Rules fetch success
     */
    fetchSuccess(rules) {
        this.dispatch(rules);
    }

    /**
     * Rules fetch failed
     */
    fetchFailed(error) {
        this.dispatch(error);
    }

}

/**
 * Store
 */
@Store()
class RulesStore {

    /**
     * Constructor
     */
    constructor() {
        this.rules = [];
    }

    /**
     * Update store after fetch
     */
    @Handles(RulesActions.fetchSuccess)
    handleFetchSuccess(rules) {
        this.rules = rules;
    }

}

/**
 * Export
 */
export {
    RulesActions,
    RulesStore
};
