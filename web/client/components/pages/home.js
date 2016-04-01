/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import { SessionStore }           from 'data/session'
import Menu                       from 'components/composition/menu'
import MenuItem                   from 'components/composition/menuItem'
import MenuDivider                from 'components/composition/menuDivider'  

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

    /**
     * Render
     */
    render() {
        return (
            <div className="grey darken-3 noselect valign-wrapper home">

                <Row className="row valign center padding-1x">

                    <div className="valign firewow-logo"></div>

                    <p>Bem-vindo <strong>{this.state.username}</strong>!</p>

                    <Menu className="valign row">
                        <MenuDivider>
                            <MenuItem orientation="vertical"   size="half" text="about"            position="left"/>
                        </MenuDivider>

                        <MenuDivider>
                            <MenuItem orientation="horizontal" size="half" text="rules management" position="right"/>
                            <MenuItem orientation="horizontal" size="half" text="traffic view"     position="right"/>
                        </MenuDivider>
                    </Menu>

                </Row>
            </div>
        );
    }
}
