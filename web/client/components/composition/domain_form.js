/**
* Imports
*/
import React        from 'react'
import CustomSwitch from 'components/composition/custom_switch'
import RadioInput   from 'components/composition/radio_input'
import CheckInput   from 'components/composition/check_input'
import { Input }    from 'react-materialize';

export default class DomainForm extends React.Component {

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

  render() {

    var attrs={};

    if(this.props.disabled) {
      attrs['disabled'] = 'true';
    }

    return (
      <form className='col s12'>

          <hr className='sep'/>

      </form>
    );
  }

}
