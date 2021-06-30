import React, { Component } from "react";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./seller.css";

export default class Seller extends Component {
  state = {
  };

  handleSameRoute(e) {
    return;
  };

  handleBackToRouteSelection(e) {
    return;
  };

  // recovers actual client from localStorage if 30(survey) or 12(coaching) 
  // coditional rendering the NextClient btn
  render() {
    return (
      <div className="seller-wrap">
        {/* <Auth /> */}
        <Header />
        <main>
          <h2>Elección de Ruta</h2>
          <hr />
          <button
            onClick={this.handleSameRoute}
            id="login-button"
            className="btn btn-secondary  btn-lg"
          >
            Proximo Cliente
          </button>
          <button
            onClick={this.handleBackToRouteSelection}
            id="login-button"
            className="btn btn-secondary  btn-lg"
          >
            Vovler a Selección de Ruta
          </button>
        </main>
      </div>
    );
  }
}
