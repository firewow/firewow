/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import { SessionStore }           from 'data/session'
import Menu                       from 'components/composition/menu'
import MenuItem                   from 'components/composition/menu_item'
import MenuDivider                from 'components/composition/menu_divider'
import appHistory                 from 'apphistory'

import 'styles/home.scss';

/**
 * Class
 */
export default class MenuRenderer extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {

    }

    componentWillUnmount() {

    }

    handleGoToRulesManagement = () => {
        appHistory.push("/");
    }

    handleGoToTrafficView = () => {
        appHistory.push("/traffic");
    }

    handleGoToAbout = () => {
        appHistory.push("/about");
    }

    componentDidMount() {
      $('.tooltipped').tooltip({delay: 50});
    }

    /**
     * Render
     */
    render() {
        return (
            <div className="blue-grey darken-3 logoWrapper">
                <div className="firewow-logo"></div>

                <Menu className="">
                    <MenuDivider>
                        <MenuItem orientation="horizontal" size="half" text="rules management" position="left" onClick={this.handleGoToRulesManagement} color="white-text text-darken-3"/>
                        <MenuItem orientation="horizontal" size="half" text="traffic view"     position="left" onClick={this.handleGoToTrafficView} color="white-text text-darken-3"/>
                        <MenuItem orientation="horizontal" size="half" text="about" position="left" onClick={this.handleGoToAbout} color="white-text text-darken-3"/>
                    </MenuDivider>
                </Menu>
            </div>
        );
    }
}
