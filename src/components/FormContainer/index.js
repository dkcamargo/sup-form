import React, { Component } from "react";

import "./form_container.css";

export default class FormContainer extends Component {
  state = {
    headerHeight: "0px"
  };

  resizeMarginTop = () => {
    this.setState({
      headerHeight: `${document.querySelector(".header").clientHeight}px`
    });
  };

  componentDidMount() {
    // when the page resize change the margin top for being always above the header
    window.addEventListener("resize", this.resizeMarginTop);
    this.resizeMarginTop();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeMarginTop);
  }

  render() {
    return (
      <div
        id="wrap-form-container"
        style={{ marginTop: this.state.headerHeight }}
      >
        {this.props.children}
      </div>
    );
  }
}
