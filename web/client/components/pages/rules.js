/**
 * Imports
 */
import {Button, Icon, Row, Input} from 'react-materialize';
import appHistory                 from 'apphistory';
import RulesPanel                 from 'components/composition/rulesPanel';
import RuleItem                   from 'components/composition/ruleItem'

import 'styles/rules.scss';

/**
 * Class
 */
export default class Rules extends React.Component {

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
            <div className='grey darken-3 noselect valign-wrapper rules'>

                <Row className='container row valign center padding-1x'>

                    <div className='valign firewow-logo'></div>

                    <RulesPanel>
                        <RuleItem className='accept' name='Rule 1'/>
                        <RuleItem className='drop'   name='Rule 2'/>
                        <RuleItem className='accept' name='Rule 3'/>
                    </RulesPanel>

                </Row>
            </div>
        );
    }
}
