import React, { Component } from "react";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./end.css";

export default class Seller extends Component {
  state = {};

  handleSameRoute = (e) => {
    console.log(this.props);
    return;
  };

  handleBackToRouteSelection(e) {
    return;
  }

  // recovers actual client from localStorage if 30(survey) or 12(coaching)
  // coditional rendering the NextClient btn
  render() {
    return (
      <div className="end-wrap">
        {/* <Auth /> */}
        <Header />
        <main>
          <h2>Fin</h2>
          <hr />
          <div className="button wrap"
          <button
            disabled={this.state.loadingLogIn}
            onClick={this.handleSameRoute}
            id="begin-button"
            className="btn btn-primary  btn-lg submit-button"
          >
            Proximo cliente
          </button>
          <button
            disabled={this.state.loadingLogIn}
            onClick={this.handleBackToRouteSelection}
            id="continue-button"
            className="btn btn-danger  btn-lg submit-button"
          >
            Selección de ruta
          </button>
          </div>
        </main>
      </div>
    );
  }
}
