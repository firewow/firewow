/**
 * Imports
 */
import { Router, Route, IndexRoute } from 'react-router'

import Application from 'components/application'
import Login from 'components/pages/login'

/**
 * Router export
 */

export default (
	<Route component={Application} path="/">
  		<IndexRoute component={Login} />
	</Route>
);
