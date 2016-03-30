/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import 'styles/login.scss';

/**
 * Class
 */
export default class Login extends React.Component {

    /**
     * Render
     */
    render() {
        return (
            <div className="valign-wrapper grey darken-3 noselect login">
                <Row className="row valign center padding-1x">
                    <div className="firewow-logo">
                        <img src={require("images/logo-white.png")} />
                    </div>

                    <form>
                        <Input s={12} label="User" pattern="[A-Za-z0-9]+">
                            <Icon>account_circle</Icon>
                        </Input>
                        <Input s={12} label="Password" type='password'>
                            <Icon>lock</Icon>
                        </Input>
                        <Icon right className="raw-button">vpn_key</Icon>
                    </form>
                </Row>

            </div>
        );
    }
}
