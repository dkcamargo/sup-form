import React, { Component } from 'react';

import Select from '../../components/Select';
import Input from '../../components/Input';
import api from '../../services/api';

import './home.css'

export default class Home extends Component {
    state = {
        sucursales: [
            { value: 1, label: 'Corrientes' },
            { value: 2, label: 'Resistencia' },
            { value: 3, label: 'Posadas' }
        ],
        users: [],
        headerId: "",
        titleId: "login-title",
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
                error: error.response.data.error
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
            await api.post('/login', {
                userId,
                password,
                sucursal,
                cordy,
                cordx
            });

            // redirect now
            
        } catch (error) {
            this.setState({
                error: error.response.data.error
            });
        }
    };

    // call axios get the supervisores data
    componentDidMount() {
        window.addEventListener('scroll', () => {
            const distanceY = window.pageYOffset || document.documentElement.scrollTop;
            const shrinkOn = "16";
            console.log(distanceY)
            //Now In the condition change the state to smaller so if the condition is true it will change to smaller otherwise to default state
            if (distanceY > shrinkOn) {
                this.setState({
                    headerId: "header-smaller",
                    titleId: "login-title-smaller"
                });
            } else {
                this.setState({
                    headerId: "",
                    titleId: "login-title"
                });
            }
        });

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
                <header id={this.state.headerId}>
                    <h1 id={this.state.titleId}>Formularios de Supervision</h1>
                </header>

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
                    <button onClick={this.handleLogin} id="login-button" className="btn btn-primary">LogIn</button>
                </main>
            </div>
        );
    }
}
