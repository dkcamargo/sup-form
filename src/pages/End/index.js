import React, { Component } from "react";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./end.css";

export default class Seller extends Component {
  state = {
    lastOne: false
  };

  handleSameRoute = (e) => {
    console.log(this.props);
    return this.props.history.push(`/${this.props.location.state.formType}`, {
      formType: this.props.location.state.formType,
      clientCountage: Number(this.props.location.state.clientCountage) + 1,
      seller: this.props.location.state.selectedSeller,
      route: this.props.location.state.selectedRoute
    });
  };

  handleBackToRouteSelection = (e) => {
    return this.props.history.push("/preventista");
  };

  saveProgressInLocalStorage = () => {
    const {
      seller,
      route,
      clientCountage,
      formType
    } = this.props.location.state;
    console.log(seller);
    console.log(route);
    console.log(clientCountage);
    console.log(formType);
    window.localStorage.removeItem(`${seller}-${route}`);
    if (formType === "relevamiento") {
      if (clientCountage !== 2) {
        window.localStorage.setItem(
          `${formType}-${seller}-${route}`,
          this.props.location.state
        );
      }
    } else if (formType === "coaching") {
      if (clientCountage !== 12) {
        window.localStorage.setItem(
          `${formType}-${seller}-${route}`,
          this.props.location.state
        );
      }
    }

    for (let i = 0; i < window.localStorage.length; i++) {
      console.log(window.localStorage.getItem(window.localStorage.key(i)));
    }

    return;
  };

  componentDidMount() {
    const { clientCountage, formType } = this.props.location.state;

    if (formType === "relevamiento") {
      if (clientCountage === 2) {
        this.setState({ lastOne: true });
      }
    } else if (formType === "coaching") {
      if (clientCountage === 12) {
        this.setState({ lastOne: true });
      }
    }

    this.saveProgressInLocalStorage();
  }
  // recovers actual client from localStorage if 30(survey) or 12(coaching)
  // coditional rendering the NextClient btn
  render() {
    const { lastOne } = this.state;
    return (
      <div className="end-wrap">
        {/* <Auth /> */}
        <Header />
        <main>
          <h2>Fin</h2>
          <hr />
          <div
            className={
              !lastOne
                ? "end-button-wrap"
                : "end-button-wrap end-button-wrap-ended"
            }
          >
            <button
              disabled={this.state.loadingLogIn}
              onClick={this.handleBackToRouteSelection}
              id="continue-button"
              className={
                !lastOne
                  ? "btn btn-danger  btn-lg end-button"
                  : "btn btn-danger  btn-lg end-button end-button-ended"
              }
            >
              Selección de ruta
            </button>
            {!lastOne ? (
              <button
                disabled={this.state.loadingLogIn}
                onClick={this.handleSameRoute}
                id="begin-button"
                className="btn btn-primary  btn-lg end-button"
              >
                Proximo cliente
              </button>
            ) : null}
          </div>
        </main>
      </div>
    );
  }
}
