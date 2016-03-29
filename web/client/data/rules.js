/**
 * Imports
 */

import alt from './index'
import axios from 'axios'
import { Actions, Store, Handles } from 'utils/decorator'

/**
 * Actions
 */
@Actions()
class RulesActions {

    create(rule) {

        axios.post("/rules/create", rule).then((response) => {
            this.actions.createSuccess(response);
        }, (error) => {
            this.actions.createFailed(error);
        });

        this.dispatch();

    }

    createSuccess(response) {
        return response;
    }

    createFailed(error) {
        return error;
    }

    fetch() {
        this.dispatch();
    }

    update(rule) {
        this.dispatch();
    }

    destroy(rule) {
        this.dispatch();
    }

}

/**
 * Store
 */
@Store()
class RulesStore {

    constructor() {
        this.rules = [];
    }

}
