/**
 * Imports
 */
import { Router, Route, IndexRoute } from 'react-router'

import Application from 'components/application'
import Home from 'components/pages/home'

/**
 * Router export
 */
export default (
	<Route component={Application} path="/">
  		<IndexRoute component={Home} />
	</Route>
);
