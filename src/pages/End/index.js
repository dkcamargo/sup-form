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
      id,
      seller,
      route,
      clientCountage,
      formType
    } = this.props.location.state;
    console.log(this.props.location.state);

    // get progresses from lstorage
    const storedProgresses = JSON.parse(
      window.localStorage.getItem("progress")
    );
    let progresses;
    if (storedProgresses !== null) {
      /**
       * TODO
       */
      // if its not empty try to find this progress
      const thisProgress = storedProgresses.find((progress) => progress === id);
      // if found pop it from the array => add or addn't is decided after if it is or isn't the last one
      // set the progresses without the old data
      progresses = storedProgresses;
    } else {
      progresses = [];
    }

    // if its survey change the limit of submitions to 30
    if (formType === "relevamiento") {
      // if its not the max number of submitions
      if (clientCountage !== 2) {
        // append the new data to the progresses array of data
        progresses.push({
          id,
          formType,
          clientCountage,
          route,
          seller
        });
        // set it all to the local storage
        window.localStorage.setItem("progress", JSON.stringify(progresses));
      }
    } else if (formType === "coaching") {
      //if its coaching limit of sumitions 12
      if (clientCountage !== 12) {
        /**
         * TODO
         */
        return;
      }
    }
    return;
  };

  componentDidMount() {
    try {
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
    } catch (error) {
      console.log(error);
      this.props.history.push("/preventista");
      return;
    }
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
