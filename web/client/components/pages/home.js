/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import { SessionStore }           from 'data/session'
import Menu                       from 'components/composition/menu'
import MenuItem                   from 'components/composition/menuItem'
import MenuDivider                from 'components/composition/menuDivider'
import appHistory                 from 'apphistory'

import 'styles/home.scss';

/**
 * Class
 */
export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            username: SessionStore.getState().session.user
        };
    }

    componentWillMount() {
        SessionStore.listen(this.handleSessionChange);
    }

    componentWillUnmount() {
        SessionStore.unlisten(this.handleSessionChange);
    }

    handleSessionChange = () => {
        this.setState({
            username: SessionStore.getState().session.user
        });
    }

    handleGoToRulesManagement = () => {
        appHistory.push("/rules");
    }

    handleGoToTrafficView = () => {
        appHistory.push("/traffic");
    }

    handleGoToAbout = () => {
        appHistory.push("/about");
    }

    /**
     * Render
     */
    render() {
        return (
            <div className="grey darken-3 noselect valign-wrapper home">

                <Row className="container row valign center padding-1x">

                    <div className="valign firewow-logo"></div>

                    <p className="welcome">Logged as {this.state.username}</p>

                    <Menu className="valign row">
                        <MenuDivider>
                            <MenuItem orientation="vertical"
                                    size="half"
                                    text="about"
                                    position="left"
                                    onClick={this.handleGoToAbout}
                                    color="deep-purple"/>
                        </MenuDivider>

                        <MenuDivider>
                            <MenuItem orientation="horizontal" size="half" text="rules management" position="right" onClick={this.handleGoToRulesManagement} color="deep-purple"/>
                            <MenuItem orientation="horizontal" size="half" text="traffic view"     position="right" onClick={this.handleGoToTrafficView} color="deep-purple"/>
                        </MenuDivider>
                    </Menu>

                </Row>
            </div>
        );
    }
}
