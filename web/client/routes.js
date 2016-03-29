/**
 * Imports
 */
import { Router, Route, IndexRoute } from 'react-router'

import Application from 'components/application'
import Rules from 'components/pages/rules'

/**
 * Router export
 */

export default (
    <Route component={Application} path="/">
        <IndexRoute component={Rules} />
        <Route component={Rules} path="rules" />
    </Route>
);
