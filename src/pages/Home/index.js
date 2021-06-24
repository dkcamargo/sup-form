import React, { Component } from 'react';

import Select from '../../components/Select';
import Input from '../../components/Input';
import Header from '../../components/Header';
import api from '../../services/api';

import './home.css'

export default class Home extends Component {
    state = {
        sucursales: [
            { value: 1, label: 'Corrientes' },
            { value: 2, label: 'Resistencia' },
            { value: 3, label: 'Posadas' }
        ],
        loadingLogIn: false,
        users: [],
        userId: '',
        password: '',
        sucursal: '',
        error: '',
        cordy: 0.0,
        cordx: 0.0
    };
    
    getOpttions = async () => {
        try {
            const response = await api.get('/users');
            
            this.setState({
                users: response.data.map(row => {
                    return { value: row.id, label: row.name}
                })
            });
        } catch (error) {
            this.setState({
                error: error.response !== undefined ? error.response.data.error : "Error no identificado al cargar datos"
            });
        }
    };

    handleLogin = async () => {
        try {
            const { userId, password, sucursal, cordy, cordx } = this.state;
            console.log({
                userId,
                password,
                sucursal,
                cordy,
                cordx
            });
            this.setState({loadingLogIn: true});
            await api.post('/login', {
                userId,
                password,
                sucursal,
                cordy,
                cordx
            });
            this.setState({loadingLogIn: false});
            
            // redirect now
            this.props.history.push('/preventista');
        } catch (error) {
            this.setState({
                error: error.response !== undefined ? error.response.data.error : "Error no identificado al hacer el login",
                loadingLogIn: false
            });
        }
    };

    // call axios get the supervisores data
    componentDidMount() {
        if (!("geolocation" in navigator)) {
            this.setState({
                error: 'Geolocalización no activada'
            })
        }

        navigator.geolocation.getCurrentPosition( position => {
            this.setState({
                cordy: position.coords.latitude,
                cordx: position.coords.longitude
            })
        });

        this.getOpttions()
    };

    render() {
        return (
            <div className="login-wrap">
                <Header />
                <main>
                    {/* value and label */}
                    <Select options={this.state.users} label="Supervisor" name="supervisor" id="supervisor" onChange={e => this.setState({ userId: e.target.value })} />
                    <Input label="Contraseña" type="password" name="password" id="password" onChange={e => this.setState({ password: e.target.value })} />
                    <Select options={this.state.sucursales} label="Sucursal" name="sucursal" id="sucursal" onChange={e => this.setState({ sucursal: e.target.value })} />
                    {this.state.error !== '' ? 
                        <div className="alert alert-danger" role="alert">
                            {this.state.error}
                        </div>
                    :null}   
                    <button disabled={this.state.loadingLogIn} onClick={this.handleLogin} id="login-button" className="btn btn-primary">
                            {this.state.loadingLogIn
                            ?
                                <i className="fas fa-circle-notch fa-spin"></i>
                            :
                                <>LogIn</>
                            }
                    </button>
                </main>
            </div>
        );
    }
}
