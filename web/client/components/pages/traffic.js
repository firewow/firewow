/**
 * Imports
 */
import { Button, Icon, Row, Input } from 'react-materialize'
import MenuRenderer                 from 'components/composition/menu_renderer'
import { Sparklines, SparklinesLine, SparklinesSpots  } from 'react-sparklines'

import appHistory from 'apphistory'
import RTChart from 'react-rt-chart'
import io from 'socket.io-client'

import 'c3/c3.css'
import 'styles/traffic.scss'

/**
 * Class
 */
export default class TrafficView extends React.Component {

    /**
     * Constructor
     * @return {[type]} [description]
     */
    constructor() {
        super();
        this.state = {
            fields: [],
            data_rx: {},
            data_tx: {}
        };
        console.log('constructor');
    }

    /**
     * Go back
     */
    handleGoBack = () => {
        appHistory.push('/');
    }

    /**
     * Mount
     */
    componentDidMount() {
        console.log('mounting');
        this.io = io();
        this.io.on('bw', (bandwidth) => {

            var ifaces = [];
            var data = { date: new Date() };

            for (var iface in bandwidth) {
                ifaces.push(iface + ' download');
                ifaces.push(iface + ' upload');
                data[iface + ' download'] = Math.round(bandwidth[iface].rx);
                data[iface + ' upload'] = Math.round(bandwidth[iface].tx);
            }

            this.setState({
                fields: ifaces,
                data: data
            });

            this.forceUpdate();
        });
    }

    /**
     * Unmount
     */
    componentWillUnmount() {
        console.log('unmounting');
        if (!this.io) {
            return;
        }
        this.io.disconnect();
        delete this.io;
    }

    /**
     * Render
     */
    render() {
        return (
            <div className='white noselect'>

                <MenuRenderer/>

                <Row>
                    <div className="traffic container center">
                        <div className='white'>
                            <h4>Traffic View</h4>
                            <RTChart
                                chart={{size : { height: 280 }, tooltip: { show: false }}}
                                flow={{duration: 0}}
                                fields={this.state.fields}
                                data={this.state.data} />
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}
