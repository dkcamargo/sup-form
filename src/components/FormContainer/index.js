
import React, { Component } from 'react'

import "./form_container.css";

export default class FormContainer extends Component {
    state =  {
        headerHeight: '0px' 
    }
    componentDidMount() {
        console.log(document.querySelector('.header'));
        console.log(document.querySelector('.header').clientHeight);

        this.setState({ headerHeight: `${document.querySelector('.header').clientHeight}px`});
    }

    render() {
        return (
            <div 
                id="wrap-form-container"
                style={{marginTop: this.state.headerHeight}}
            >
                {this.props.children}
            </div>
        );
    }
}
