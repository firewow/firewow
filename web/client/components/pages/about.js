/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import appHistory                 from 'apphistory'

import 'styles/about.scss';

/**
 * Class
 */
export default class About extends React.Component {

    constructor() {
        super();
    }

    handleGoBack = () => {
        appHistory.push("/home");
    }

    /**
     * Render
     */
    render() {
        return (
            <div className="grey darken-3 noselect valign-wrapper about">

                <Row className="container row valign center padding-1x">

                    <div className="valign firewow-logo"></div>

                    <p className="brand">Made with <Icon>favorite</Icon> using</p>

                    <div className='tools z-depth-1'>

                        <div className='node'></div>
                        <div className='webpack'></div>
                        <div className='react'></div>
                        <div className='sass'></div>
                        <div className='babel'></div>
                        <div className='bower'></div>
                        <div className='nodemon'></div>
                        <div className='npm'></div>
                        <div className='express'></div>

                        <div className='authors pink white-text'>
                            <h4>AUTHORS</h4>
                            <p>Augusto Russo  (augustopaladin@gmail.com)</p>
                            <p>João F. Biondo (wolfulus@gmail.com)</p>
                        </div>

                    </div>

                </Row>
            </div>
        );
    }
}
