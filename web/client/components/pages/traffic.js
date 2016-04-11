/**
 * Imports
 */
import {Button, Icon, Row, Input}     from 'react-materialize';
import appHistory                     from 'apphistory'
import { Sparklines, SparklinesLine } from 'react-sparklines';

import 'styles/traffic.scss';

/**
 * Class
 */
export default class TrafficView extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [5, 10, 5, 20, 8, 15]
        }
    }

    handleGoBack = () => {
        appHistory.push('/home');
    }

    componentDidMount() {

        setTimeout(() => {
            this.setState({
                data: [10, 20, 0, 20, 16, 30]
            });
        }, 1000);

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

                        <Sparklines data={this.state.data} limit={20} width={320} height={300}>
                            <SparklinesLine style={{ stroke: "none", fill: "#8e44af", fillOpacity: "1" }}/>
                        </Sparklines>
                    </div>

                </Row>
            </div>
        );
    }
}
