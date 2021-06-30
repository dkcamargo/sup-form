import React, { Component } from "react";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./continue.css";

export default class Seller extends Component {
  state = {
    error: ""
  };

  handleGoBack = () => {
    return this.props.history.push("/preventista");
  };
  // render a list of buttons redirect to the selected route in the number it lasted
  render() {
    return (
      <div className="continue-wrap">
        {/* <Auth /> */}
        <Header />
        <main>
          <h2>Elegí la ruta que querés continuar:</h2>
          <hr />

          {this.state.error !== "" ? (
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          ) : null}

          <button
            onClick={this.handleGoBack}
            id="back-button"
            className="btn btn-danger  btn-lg submit-button"
          >
            Volver
          </button>
        </main>
      </div>
    );
  }
}
