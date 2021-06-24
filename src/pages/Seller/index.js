import React, { Component } from "react";

import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./seller.css";

export default class Seller extends Component {
  state = {
    selectedSeller: "",
    selectedSellerRoutes: [],
    selectedRoute: "",
    sellers: [
      { value: "1", label: "Facundo Regalado" },
      { value: "2", label: "Gabriel Gomez" },
      { value: "3", label: "Belén Escalante" }
    ]
  };

  handleSellerSelection(selectedSellerValue) {
    // get the routes from api
    const routes = {
      "1": [
        { value: "1", label: "LUJU FACUNDO REGALADO" },
        { value: "101", label: "MAVI FACUNDO REGALADO" },
        { value: "201", label: "MISA FACUNDO REGALADO" }
      ],
      "2": [
        { value: "2", label: "LUJU GABRIEL GOMEZ" },
        { value: "102", label: "MAVI GABRIEL GOMEZ" },
        { value: "202", label: "MISA GABRIEL GOMEZ" }
      ],
      "3": [
        { value: "11", label: "MISA BELEN ESCALANTE" },
        { value: "203", label: "MAVI BELEN ESCALANTE" },
        { value: "211", label: "LUJU BELEN ESCALANTE" }
      ]
    };
    this.setState({
      selectedSellerRoutes: routes[selectedSellerValue]
    });
  }

  render() {
    return (
      <div className="seller-wrap">
        <Header />
        <main>
          <Select
            options={this.state.sellers}
            loadOption="Cargando"
            label="Vendedor a Supervisar"
            name="prevetista"
            id="prevetista"
            onChange={(e) => {
              this.setState({ selectedSeller: e.target.value });
              this.handleSellerSelection(e.target.value);
            }}
          />
          <Select
            options={this.state.selectedSellerRoutes}
            loadOption="Primero elegí un preventista"
            label="Ruta a supervisionar"
            name="ruta"
            id="ruta"
            onChange={(e) => this.setState({ selectedRoute: e.target.value })}
          />
          <button
            disabled={this.state.loadingLogIn}
            onClick={this.handleLogin}
            id="login-button"
            className="btn btn-primary"
          >
            Empezar
          </button>
        </main>
      </div>
    );
  }
}
