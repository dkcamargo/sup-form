import React, { Component } from 'react'
import './header.css';

export default class Header extends Component {
    state = {
        headerId: "header-big",
        titleId: "header-title-big",
    };

    componentDidMount() {
        window.addEventListener('scroll', () => {
            const distanceY = window.pageYOffset ;
            const shrinkOn = "16";
            console.log(distanceY)
            //Now In the condition change the state to smaller so if the condition is true it will change to smaller otherwise to default state
            if (distanceY > shrinkOn) {
                this.setState({
                    headerId: "header-smaller",
                    titleId: "header-title-smaller"
                });
            } else {
                this.setState({
                    headerId: "header-big",
                    titleId: "header-title-big"
                });
            }
        });
    };

    render() {
        return (
            <header id={this.state.headerId}>
                <h1 id={this.state.titleId}>Formularios de Supervision</h1>
            </header>
        )
    }
}
