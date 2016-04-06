/**
 * Imports
 */
import React    from 'react'
import { Icon } from 'react-materialize';

/**
 * Component
 */
export default class Loader extends React.Component {

    render() {
        return(

            <div className={'app-loader ' + this.props.className} id={this.props.id}>

                <div className="toasted-loader">

                    <div className="preloader-wrapper small active">
                      <div className="spinner-layer spinner-blue">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div><div className="gap-patch">
                          <div className="circle"></div>
                        </div><div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>

                      <div className="spinner-layer spinner-red">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div><div className="gap-patch">
                          <div className="circle"></div>
                        </div><div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>

                      <div className="spinner-layer spinner-yellow">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div><div className="gap-patch">
                          <div className="circle"></div>
                        </div><div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>

                      <div className="spinner-layer spinner-green">
                        <div className="circle-clipper left">
                          <div className="circle"></div>
                        </div><div className="gap-patch">
                          <div className="circle"></div>
                        </div><div className="circle-clipper right">
                          <div className="circle"></div>
                        </div>
                      </div>
                    </div>

                    <div className="loader-text">
                        <span>
                            {this.props.text}
                        </span>
                    </div>
                </div>

                <div className="toasted-done esconder">
                    <Icon>check</Icon>

                    <div className="loader-text">
                        <span>
                            {this.props.textDone}
                        </span>
                    </div>
                </div>

            </div>

        );
    }

}
