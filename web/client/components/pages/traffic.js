/**
 * Imports
 */
import {Button, Icon, Row, Input}     from 'react-materialize';
import appHistory                     from 'apphistory'
import { Sparklines, SparklinesLine, SparklinesSpots  } from 'react-sparklines';

import 'styles/traffic.scss';

/**
 * Class
 */
export default class TrafficView extends React.Component {

    constructor() {
        super();
        var d = [];
        for (var i = 0; i < 32; i++) {
            d.push(Math.round(25 + (Math.random() * 75)));
        }
        this.state = {
            data: d
        };
    }

    handleGoBack = () => {
        appHistory.push('/home');
    }

    componentDidMount() {
        setInterval(() => {
            var data = this.state.data.concat(Math.round(25 + (Math.random() * 75)));
            if (data.length > 64) {
                data = data.splice(32);
            }
            this.setState({
                data: data
            });
        }, 500);
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
                        <Sparklines data={this.state.data} limit={32} width={600} height={50}>
                            <SparklinesLine style={{ stroke: "none", fill: "#8e44af", fillOpacity: "1" }}/>
                            <SparklinesSpots />
                        </Sparklines>
                    </div>
                </Row>
            </div>
        );
    }
}
