import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./survey.css";

export default class Survey extends Component {
  state = {
    clientCountage: 0,
    clientId: 0
  };

  handleSurveySubmit = () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to end pass the type by query
     */
    return this.props.history.push("/fin", this.props.location.state);
  };

  componentDidMount() {
    this.setState({ clientCountage: this.props.location.state.clientCountage });
  }
  render() {
    const { clientCountage } = this.state;
    return (
      <div className="survey-wrap">
        <Header />
        {/* <Auth /> */}
        <main id="main">
          <h2>
            Cliente Numero: <strong>{clientCountage}</strong>
          </h2>
          <hr />
          <Input
            label="Codigo del Cliente"
            type="number"
            pattern="\d*"
            name="client-id"
            id="client-id"
            onChange={(e) => this.setState({ clientId: e.target.value })}
          />

          <button
            disabled={this.state.loadingLogIn}
            onClick={this.handleSurveySubmit}
            id="survey-button"
            className="btn btn-primary btn-lg submit-button"
          >
            {this.state.loadingLogIn ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : (
              <>Enviar Evaluación</>
            )}
          </button>
        </main>
      </div>
    );
  }
}
