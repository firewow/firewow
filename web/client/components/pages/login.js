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
                <div className="firewow-logo">
                    <img src={require("images/logo-white.png")} />
                </div>
                <Row className="row valign center">
                    <Input s={12} label="Usuário" validate pattern="[A-Za-z0-9]+">
                        <Icon>account_circle</Icon>
                    </Input>
                    <Input s={12} label="Senha" validate type='password'>
                        <Icon>lock</Icon>
                    </Input>
                </Row>
            </div>
        );
    }
}
