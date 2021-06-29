import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class Auth extends Component {
    state = {
        logged: false
    }
    componentDidMount() {
        this.setState({ logged: window.localStorage.getItem('logged') });
    };

    render() {
        const { logged } = this.state;
        if (!logged) {
            return <Redirect to='/' />
        } else {
            return <></> 
        }
    }
}
