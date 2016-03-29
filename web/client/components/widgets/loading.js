/**
 * Imports
 */

import React from 'react'
import { Link } from 'react-router'
import { Button, Modal, Form, Input } from 'react-bootstrap'
import { AccountActions } from 'data/account'

/**
 * Component
 */
export default class Loading extends React.Component {

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render
     */
    render() {
        return (
            <div style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.50)' }}>
                <div style={{
                    position: 'fixed',
                    left: 'calc(50vw - 100px)',
                    top: 'calc(50vh - 40px)',
                    width: '200px',
                    height: '80px',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    lineHeight: '80px',
                    backgroundColor: 'rgba(0, 0, 0, 0.50)',
                    color: '#FFF',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    borderRadius: '8px'
                }}>
                    Loading...
                </div>
            </div>
        );
    }

}
