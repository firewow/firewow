/**
 * Imports
 */
import { Router, Route, IndexRoute } from 'react-router'
import Application                   from 'components/application'
import Rules                         from 'components/pages/rules'
import Home                          from 'components/pages/home'
import Login                         from 'components/pages/login'
import TrafficView                   from 'components/pages/traffic'
import About                         from 'components/pages/about'

/**
 * Router export
 */
export default (
    <Route component={Application} path="/">
        <IndexRoute component={Login} />

        <Route component={Home}        path="home" />
        <Route component={Rules}       path="rules" />
        <Route component={TrafficView} path="traffic" />
        <Route component={About}       path="about" />
    </Route>
);
