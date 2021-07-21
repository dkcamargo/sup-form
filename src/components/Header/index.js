import React, { Component } from "react";
import "./header.css";

export default class Header extends Component {
  state = {
    headerId: "header-big",
    titleId: "header-title-big"
  };

  handleShrinkOnScroll = () => {
    const shrinkOn = 16;
    //Now In the condition change the state to smaller so if the condition is true it will change to smaller otherwise to default state
    if (
      document.body.scrollTop > shrinkOn ||
      document.documentElement.scrollTop > shrinkOn
    ) {
      this.setState({
        headerId: "header-smaller",
        titleId: "header-title-smaller"
      });
      return;
    } else if (
      document.body.scrollTop < shrinkOn - 2 ||
      document.documentElement.scrollTop < shrinkOn - 2
    ) {
      this.setState({
        headerId: "header-big",
        titleId: "header-title-big"
      });
      return;
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleShrinkOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleShrinkOnScroll);
  }

  render() {
    return (
      <header id={this.state.headerId} className="header">
        <h1 id={this.state.titleId}>Formularios de Supervision Redcom</h1>
      </header>
    );
  }
}
