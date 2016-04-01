/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import appHistory from 'apphistory'

import { SessionActions } from 'data/session'

import 'styles/login.scss';

/**
 * Class
 */
export default class Login extends React.Component {

    handleLoginRequest = () => {
        SessionActions.loginSuccess({
            user: 'root'
        });
        appHistory.push('/home');
    }

    /**
     * Render
     */
    render() {
        return (
            <div className="valign-wrapper grey darken-3 noselect login">

                <Row className="row valign center padding-1x">

                    <div className="firewow-logo"></div>

                    <form className="login-form z-depth-1 col s12">
                        <Input s={12} label="User" pattern="[A-Za-z0-9]+">
                            <Icon>account_circle</Icon>
                        </Input>
                        <Input s={12} label="Password" type='password'>
                            <Icon>lock</Icon>
                        </Input>
                        <span onClick={this.handleLoginRequest}>
                            <Icon right className="raw-button">vpn_key</Icon>
                        </span>
                    </form>
                </Row>

            </div>
        );
    }
}
