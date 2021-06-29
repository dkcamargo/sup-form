import React, { Component } from "react";
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

  handleSurveySubmit() {
    return;
  }

  componentDidMount() {
    this.setState({ clientCountage: this.props.match.params.id });
  }
  render() {
    const { clientCountage } = this.state;
    return (
      <div className="evaluation-wrap">
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
            onClick={this.handleSendSrvey}
            id="submit-button"
            className="btn btn-primary btn-lg"
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
