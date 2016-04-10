/**
* Imports
*/
import React        from 'react'
import CustomSwitch from 'components/composition/customSwitch'
import RadioInput   from 'components/composition/radioInput'
import CheckInput   from 'components/composition/checkInput'
import { Input }    from 'react-materialize';

export default class RuleForm extends React.Component {

  constructor() {
      super();

      this.state = {
        protocol:      'tcp',
        srcaddr_type:  'any',
        srcport_type:  'any',
        destaddr_type: 'any',
        destport_type: 'any'
      };
  }

  handleStateChange = (name, type) => {
    return () => {
      console.log('changing ' + name + ' to ' + type);
      var obj = {};
      obj[name] = type;
      this.setState(obj);
    };
  }

  renderSourceAddress() {
    switch (this.state.srcaddr_type) {
      case 'any':
        return (
          <span>&nbsp;</span>
        );
      case 'single':
        return (
          <Input ref="srcaddr_start" s={12} label='Address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
        );
      case 'range':
        return (
          <div>
            <Input ref="srcaddr_start" s={12} label='Start address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
            <Input ref="srcaddr_end" s={12} label='End address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
          </div>
        );
      default:
        return 'Can\'t find an action for: ' + this.state.srcaddr_type;
    }
  }

  renderDestinationAddress() {
    switch (this.state.destaddr_type) {
      case 'any':
        return (
          <span>&nbsp;</span>
        );
      case 'single':
        return (
          <Input ref="destaddr_start" s={12} label='Address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
        );
      case 'range':
        return (
          <div>
            <Input ref="destaddr_start" s={12} label='Start address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
            <Input ref="destaddr_end" s={12} label='End address' pattern='[0-9(4)\.0-9(4)\.0-9(4)\.0-9(4)]+' />
          </div>
        );
      default:
        return 'Can\'t find an action for: ' + this.state.destaddr_type;
    }
  }

  renderSourcePort() {
    switch (this.state.srcport_type) {
      case 'any':
        return (
          <span>&nbsp;</span>
        );
      case 'single':
        return (
          <Input ref="srcport_start" s={12} label='Port number' type='number'/>
        );
      case 'range':
        return (
          <div>
            <Input ref="srcport_start" s={12} label='Start on port' type='number'/>
            <Input ref="srcport_end" s={12} label='End on port' type='number'/>
          </div>
        );
      default:
        return 'Can\'t find an action for: ' + this.state.srcport_type;
    }
  }

  renderDestinationPort() {
    switch (this.state.destport_type) {
      case 'any':
        return (
          <span>&nbsp;</span>
        );
      case 'single':
        return (
          <Input ref="destport_start" s={12} label='Port number' type='number'/>
        );
      case 'range':
        return (
          <div>
            <Input ref="destport_start" s={12} label='Start on port' type='number'/>
            <Input ref="destport_end" s={12} label='End on port' type='number'/>
          </div>
        );
      default:
        return 'Can\'t find an action for: ' + this.state.destport_type;
    }
  }

  render() {

    var attrs={};

    if(this.props.disabled) {
      attrs['disabled'] = 'true';
    }

    return (
      <form className='col s12'>

          <CustomSwitch {...attrs} label='ACTION' onText='PASS' offText='BLOCK' className='rule-policy'/>

          <hr className='sep'/>

          <div className="col s12 protocol-policy">
            <label className="lbl">Protocol</label>
            <RadioInput {...attrs} text='TCP'  value='tcp'  inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'tcp')}  checked={'tcp' === this.state.protocol}/>
            <RadioInput {...attrs} text='UDP'  value='udp'  inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'udp')}  checked={'udp' === this.state.protocol}/>
            <RadioInput {...attrs} text='BOTH' value='both' inline={true} group='protocol' onChange={this.handleStateChange('protocol', 'both')} checked={'both' === this.state.protocol}/>
          </div>

          <hr className='sep'/>

          <div className='source-settings'>
            <h4>Source settings</h4>

            <div className='cfg-item'>
              <h5 className='col s12'>Source IP</h5>
              <div className="col s12 protocol-policy">
                <RadioInput {...attrs} text='ANY' inline={true} group='src_ip' onChange={this.handleStateChange('srcaddr_type', 'any')} checked={'any' === this.state.srcaddr_type} />
                <RadioInput {...attrs} text='SINGLE' inline={true} group='src_ip' onChange={this.handleStateChange('srcaddr_type', 'single')} checked={'single' === this.state.srcaddr_type} />
                <RadioInput {...attrs} text='RANGE' inline={true} group='src_ip' onChange={this.handleStateChange('srcaddr_type', 'range')} checked={'range' === this.state.srcaddr_type} />
              </div>

              {this.renderSourceAddress()}
            </div>

            <div className='cfg-item'>
              <h5 className='col s12'>Source Port</h5>
              <div className="col s12 protocol-policy">
                <RadioInput {...attrs} text='ANY' inline={true} group='src_port' onChange={this.handleStateChange('srcport_type', 'any')} checked={'any' === this.state.srcport_type} />
                <RadioInput {...attrs} text='SINGLE' inline={true} group='src_port' onChange={this.handleStateChange('srcport_type', 'single')} checked={'single' === this.state.srcport_type} />
                <RadioInput {...attrs} text='RANGE' inline={true} group='src_port' onChange={this.handleStateChange('srcport_type', 'range')} checked={'range' === this.state.srcport_type} />
              </div>

              {this.renderSourcePort()}
            </div>

          </div>

          <hr className='sep'/>

          <div className='destination-settings'>
            <h4>Destination settings</h4>

            <div className='cfg-item'>
              <h5 className='col s12'>Destination IP</h5>
              <div className="col s12 protocol-policy">
                <RadioInput {...attrs} text='ANY' inline={true} group='dest_ip' onChange={this.handleStateChange('destaddr_type', 'any')} checked={'any' === this.state.destaddr_type} />
                <RadioInput {...attrs} text='SINGLE' inline={true} group='dest_ip' onChange={this.handleStateChange('destaddr_type', 'single')} checked={'single' === this.state.destaddr_type} />
                <RadioInput {...attrs} text='RANGE' inline={true} group='dest_ip' onChange={this.handleStateChange('destaddr_type', 'range')} checked={'range' === this.state.destaddr_type} />
              </div>

              {this.renderDestinationAddress()}
            </div>

            <div className='cfg-item'>
              <h5 className='col s12'>Destination Port</h5>
              <div className="col s12 protocol-policy">
                <RadioInput {...attrs} text='ANY'    inline={true} group='dest_port' onChange={this.handleStateChange('destport_type', 'any')}    checked={'any' === this.state.destport_type} />
                <RadioInput {...attrs} text='SINGLE' inline={true} group='dest_port' onChange={this.handleStateChange('destport_type', 'single')} checked={'single' === this.state.destport_type} />
                <RadioInput {...attrs} text='RANGE'  inline={true} group='dest_port' onChange={this.handleStateChange('destport_type', 'range')}  checked={'range' === this.state.destport_type} />
              </div>

              {this.renderDestinationPort()}
            </div>

          </div>

      </form>
    );
  }

}
