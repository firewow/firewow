/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize'
import appHistory                 from 'apphistory'
import DomainsPanel                 from 'components/composition/domains_panel'
import DomainItem                   from 'components/composition/domain_item'
import MenuRenderer               from 'components/composition/menu_renderer'

import 'styles/domains.scss';

/**
 * Class
 */
export default class Domains extends React.Component {

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
            <div className='white noselect'>
                <MenuRenderer/>
                <Row>
                    <div className="valign-wrapper domains">
                        <div className="container row valign center padding-1x">
                            <div className='valign firewow-logo'></div>
                            <DomainsPanel/>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}
