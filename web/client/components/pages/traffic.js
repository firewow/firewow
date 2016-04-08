/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import appHistory                 from 'apphistory'

import 'styles/traffic.scss';

/**
 * Class
 */
export default class TrafficView extends React.Component {

    constructor() {
        super();
    }

    handleGoBack = () => {
        appHistory.push('/home');
    }

    /**
     * Render
     */
    render() {

        return (
            <div className='grey darken-3 noselect valign-wrapper traffic'>

                <Row className='container row valign center padding-1x'>

                    <div className='valign firewow-logo'></div>

                    <div>
                        <h4>Traffic View</h4>                        

                    </div>

                </Row>
            </div>
        );
    }
}
