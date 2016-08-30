/**
 * Imports
 */
import React          from 'react';
import CustomSwitch   from 'components/composition/custom_switch'
import RadioInput     from 'components/composition/radio_input'
import CheckInput     from 'components/composition/check_input'
import { Input }      from 'react-materialize';
import TextInput      from 'components/composition/text_input'
import { DomainsStore } from 'data/domains'

/**
 * Domain editor
 */
export default class DomainEditor extends React.Component {

    /**
     * Constructor
     * @return {[type]} [description]
     */
    constructor(props) {
        super(props);
        this.state = {
            name: '',
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

    handleTextInputChange = (name) => {
        return (e) => {
            var obj = {};
            obj[name] = e.target.value;
            this.setState(obj);
        }
    }

    /**
     * Changing name on state
     */
    handleNameInput = (e) => {
        this.setState({ name: e.target.value });
    }

    /**
     * Return form state
     */
    getData = () => {
        return {
            name: this.state.name
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
                    <h4>{this.state.title || "Domain Editor"}</h4>
                </div>
                <div className="modal-content">
                    <form className='col s12'>
                        <div className='config-wrapper'>
                            <div className='cfg-item'>
                                <TextInput {...attrs} ref="name" s={12} label='Domain name' value={this.state.name} onChange={this.handleNameInput} />
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
