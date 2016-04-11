/**
 * Imports
 */
import React        from 'react';
import CustomSwitch from 'components/composition/custom_switch'
import RadioInput   from 'components/composition/radio_input'
import CheckInput   from 'components/composition/check_input'
import { Input }    from 'react-materialize';
import { RulesStore } from 'data/rules'

/**
 * Rule editor
 */
export default class RuleEditor extends React.Component {

    /**
     * Constructor
     * @return {[type]} [description]
     */
    constructor(props) {
        super(props);
        this.state = {
            name: '',

            action: 'accept',
            protocol: 'tcp',

            direction: 'in',

            srcaddr_type: 'any',
            srcaddr_min: '',
            srcaddr_max: '',

            srcport_type: 'any',
            srcport_min: 0,
            srcport_max: 0,

            dstaddr_type: 'any',
            dstaddr_min: '',
            dstaddr_max: '',

            dstport_type: 'any',
            dstport_min: 0,
            dstport_max: 0,

            color: 'green',
            editable: true,
            buttons: [
            ]
        };
    }

    /**
     * State change callback
     */
    handleStateChange = (name, type) => {
        return () => {
            var obj = {};
            obj[name] = type;
            this.setState(obj);
        };
    }

    /**
     * Render source address
     */
    renderSourceAddress() {

        var attrs={};
        if (!this.state.editable) {
            attrs['disabled'] = 'disabled';
        }

        switch (this.state.srcaddr_type) {
            case 'any':
                return (
                  <span>&nbsp;</span>
                );
            case 'single':
                return (
                    <Input {...attrs} ref="srcaddr_start" s={12} label='Address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                );
            case 'range':
                return (
                    <div>
                        <Input {...attrs} ref="srcaddr_start" s={12} label='Start address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                        <Input {...attrs} ref="srcaddr_end" s={12} label='Final address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                    </div>
                );
            default:
                return 'Can\'t find an action for: ' + this.state.srcaddr_type;
        }

    }

    /**
     * Render destination address
     */
    renderDestinationAddress() {

        var attrs={};
        if (!this.state.editable) {
            attrs['disabled'] = 'disabled';
        }

        switch (this.state.dstaddr_type) {
            case 'any':
                return (
                    <span>&nbsp;</span>
                );
            case 'single':
                return (
                    <Input {...attrs} ref="dstaddr_start" s={12} label='Address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                );
            case 'range':
                return (
                    <div>
                        <Input {...attrs} ref="dstaddr_start" s={12} label='Start address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                        <Input {...attrs} ref="dstaddr_end" s={12} label='Final address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
                    </div>
                );
            default:
                return 'Can\'t find an action for: ' + this.state.dstaddr_type;
        }

    }

    /**
     * Render source port
     */
    renderSourcePort() {

        var attrs={};
        if (!this.state.editable) {
            attrs['disabled'] = 'disabled';
        }

        switch (this.state.srcport_type) {
            case 'any':
                return (
                    <span>&nbsp;</span>
                );
            case 'single':
                return (
                    <Input {...attrs} ref="srcport_start" s={12} label='Port number' type='number'/>
                );
            case 'range':
                return (
                    <div>
                        <Input {...attrs} ref="srcport_start" s={12} label='First port' type='number'/>
                        <Input {...attrs} ref="srcport_end" s={12} label='Final port' type='number'/>
                    </div>
                );
            default:
                return 'Can\'t find an action for: ' + this.state.srcport_type;
        }

    }

    /**
     * Render destination port
     */
    renderDestinationPort() {

        var attrs={};
        if (!this.state.editable) {
            attrs['disabled'] = 'disabled';
        }

        switch (this.state.dstport_type) {
            case 'any':
                return (
                    <span>&nbsp;</span>
                );
            case 'single':
                return (
                    <Input {...attrs} ref="dstport_start" s={12} label='Port number' type='number'/>
                );
            case 'range':
                return (
                    <div>
                        <Input {...attrs} ref="dstport_start" s={12} label='First port' type='number'/>
                        <Input {...attrs} ref="dstport_end" s={12} label='Final port' type='number'/>
                    </div>
                );
            default:
                return 'Can\'t find an action for: ' + this.state.dstport_type;
        }

    }

    /**
     * Open
     */
    open(options) {
        this.setState(options);
        $(this.refs.modal).openModal();
    }

    /**
     * Close modal
     */
    close() {
        $(this.refs.modal).closeModal();
    }

    /**
     * Handles button press
     */
    handleButtonPress = (callback) => {
        return () => {
            callback(this);
        };
    }

    /**
     * Renders all buttons
     */
    renderButtons() {
        var buttons = [];
        if (this.state.buttons) {
            buttons = Object.keys(this.state.buttons).map((key) => {
                var callback = this.state.buttons[key];
                return (
                    <a key={key} className='waves-effect waves-light btn-flat white-text' onClick={this.handleButtonPress(callback)}>{key.toUpperCase()}</a>
                );
            });
        }
        return buttons;
    }

    /**
     * Component rendering
     */
    render () {

        var attrs={};
        if (!this.state.editable) {
            attrs['disabled'] = 'disabled';
        }

        return (
            <div ref="modal" className={'modal modal-fixed-header' + (this.props.className ? ' ' + this.props.className : '')}>
                <div className={"modal-header " + (this.state.color || "orange")}>
                    <h4>{this.state.title || "Rule Editor"}</h4>
                </div>
                <div className="modal-content">

                    <form className='col s12'>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <Input {...attrs} ref="name" s={12} label='Rule name' type='text'/>
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Direction</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='INCOMING' value='in' inline={true} group='direction' onChange={this.handleStateChange('direction', 'in')} checked={'in' === this.state.direction}/>
                                    <RadioInput {...attrs} text='OUTGOING' value='out' inline={true} group='direction' onChange={this.handleStateChange('direction', 'out')} checked={'out' === this.state.direction}/>
                                </div>
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Action</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='ACCEPT' inline={true} group='action' onChange={this.handleStateChange('action', 'accept')} checked={'accept' === this.state.action} />
                                    <RadioInput {...attrs} text='DROP' inline={true} group='action' onChange={this.handleStateChange('action', 'drop')} checked={'drop' === this.state.action} />
                                </div>
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Protocol</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='TCP' value='tcp' inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'tcp')}  checked={'tcp' === this.state.protocol}/>
                                    <RadioInput {...attrs} text='UDP' value='udp' inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'udp')}  checked={'udp' === this.state.protocol}/>
                                    <RadioInput {...attrs} text='BOTH' value='both' inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'both')} checked={'both' === this.state.protocol}/>
                                </div>
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Source Address</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='ANY' inline={true} group='src_ip' onChange={this.handleStateChange('srcaddr_type', 'any')} checked={'any' === this.state.srcaddr_type} />
                                    <RadioInput {...attrs} text='SINGLE' inline={true} group='src_ip' onChange={this.handleStateChange('srcaddr_type', 'single')} checked={'single' === this.state.srcaddr_type} />
                                    <RadioInput {...attrs} text='RANGE' inline={true} group='src_ip' onChange={this.handleStateChange('srcaddr_type', 'range')} checked={'range' === this.state.srcaddr_type} />
                                </div>
                                {this.renderSourceAddress()}
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Source Port</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='ANY' inline={true} group='src_port' onChange={this.handleStateChange('srcport_type', 'any')} checked={'any' === this.state.srcport_type} />
                                    <RadioInput {...attrs} text='SINGLE' inline={true} group='src_port' onChange={this.handleStateChange('srcport_type', 'single')} checked={'single' === this.state.srcport_type} />
                                    <RadioInput {...attrs} text='RANGE' inline={true} group='src_port' onChange={this.handleStateChange('srcport_type', 'range')} checked={'range' === this.state.srcport_type} />
                                </div>
                                {this.renderSourcePort()}
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Destination Address</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='ANY' inline={true} group='dest_ip' onChange={this.handleStateChange('dstaddr_type', 'any')} checked={'any' === this.state.dstaddr_type} />
                                    <RadioInput {...attrs} text='SINGLE' inline={true} group='dest_ip' onChange={this.handleStateChange('dstaddr_type', 'single')} checked={'single' === this.state.dstaddr_type} />
                                    <RadioInput {...attrs} text='RANGE' inline={true} group='dest_ip' onChange={this.handleStateChange('dstaddr_type', 'range')} checked={'range' === this.state.dstaddr_type} />
                                </div>
                                {this.renderDestinationAddress()}
                            </div>
                        </div>

                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <div className="col s4 aligner">
                                    <label className="lbl">Destination Port</label>
                                </div>
                                <div className="col s8 aligner">
                                    <RadioInput {...attrs} text='ANY' inline={true} group='dest_port' onChange={this.handleStateChange('dstport_type', 'any')}    checked={'any' === this.state.dstport_type} />
                                    <RadioInput {...attrs} text='SINGLE' inline={true} group='dest_port' onChange={this.handleStateChange('dstport_type', 'single')} checked={'single' === this.state.dstport_type} />
                                    <RadioInput {...attrs} text='RANGE' inline={true} group='dest_port' onChange={this.handleStateChange('dstport_type', 'range')}  checked={'range' === this.state.dstport_type} />
                                </div>
                                {this.renderDestinationPort()}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    {this.renderButtons()}
                </div>
            </div>
        );

    }

}
