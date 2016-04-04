/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import appHistory                 from 'apphistory'
import LineChart                  from 'components/composition/lineChart'

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

        var data = [
            ['Time', 'Download', 'Upload'],
            [ 8,      12,     3],
            [ 9,      5.5,    6],
            [ 10,     14,     3],
            [ 11,     5,      6],
            [ 12,     3.5,    2],
            [ 13,     7,      1]
        ];

        var graph = '';

        if(typeof google !== "undefined") {
            graph = <div id="liveGraph">
                <LineChart data={data} graphName="liveGraph" />
            </div>
        }

        return (
            <div className='grey darken-3 noselect valign-wrapper traffic'>

                <Row className='container row valign center padding-1x'>

                    <div className='valign firewow-logo'></div>

                    <div>
                        <h4>Traffic View</h4>

                        {graph}

                    </div>

                </Row>
            </div>
        );
    }
}
