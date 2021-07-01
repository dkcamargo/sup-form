import React, { Component } from "react";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./seller.css";
import { AiFillWindows } from "react-icons/ai";

export default class Seller extends Component {
  state = {
    selectedSeller: "",
    selectedRoute: "",
    evaluationType: "",
    selectedSellerRoutes: [],
    sellers: [
      { value: "1", label: "Facundo Regalado" },
      { value: "2", label: "Gabriel Gomez" },
      { value: "3", label: "Belén Escalante" }
    ],
    error: ""
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 1500);
  };

  handleSellerSelection = (selectedSellerValue) => {
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
  };

  handleSellerSubmit = async (event) => {
    const { evaluationType, selectedSeller, selectedRoute } = this.state;

    if (
      selectedSeller === "" ||
      selectedRoute === "" ||
      evaluationType === ""
    ) {
      return this.renderError("Tenés que elegir alguna opción");
    }

    return this.props.history.push(`/${evaluationType}`, {
      formType: evaluationType,
      clientCountage: 1,
      seller: this.state.selectedSeller,
      route: this.state.selectedRoute
    });
  };

  handleContinue = () => {
    return this.props.history.push("/continuar");
  };
  handleLogOut = () => {
    window.localStorage.clear();
    return this.props.history.push("/");
  };
  render() {
    return (
      <div className="seller-wrap">
        {/* <Auth /> */}
        <Header />
        <main>
          {/*  */}
          <h2>Elección de Ruta</h2>
          <hr />
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

          <div className="evaluation-type">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="evaluation-type"
                id="survey"
                value="relevamiento"
                onChange={(e) =>
                  this.setState({ evaluationType: e.target.value })
                }
              />
              <label className="form-check-label" htmlFor="relevamiento">
                Relevamiento
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="evaluation-type"
                id="coaching"
                value="coaching"
                onChange={(e) =>
                  this.setState({ evaluationType: e.target.value })
                }
              />
              <label className="form-check-label" htmlFor="coaching">
                Coaching
              </label>
            </div>
          </div>

          {this.state.error !== "" ? (
            <div className="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          ) : null}
          <button
            onClick={this.handleSellerSubmit}
            id="begin-button"
            className="btn btn-primary btn-lg submit-button seller-button"
          >
            Empezar
          </button>
          <div className="or">
            <hr />
            <p>o entonces</p>
            <hr />
          </div>
          <button
            onClick={this.handleContinue}
            id="continue-button"
            className="btn btn-secondary btn-lg submit-button seller-button"
          >
            Continuar
          </button>
          <button
            onClick={this.handleLogOut}
            id="continue-button"
            className="btn btn-danger btn-lg submit-button seller-button"
          >
            Log Out
          </button>
        </main>
      </div>
    );
  }
}
