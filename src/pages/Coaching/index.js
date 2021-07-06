import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./coaching.css";
import FormContainer from "../../components/FormContainer";

export default class Survey extends Component {
  state = {
    clientCountage: 0,
    clientId: 0,
    loadingSend: false
  };

  handleCoachingSubmit = () => {
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
      <>
        <Header />
        {/* <Auth /> */}
        <FormContainer>
          <main id="coaching">
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
              disabled={this.state.loadingSend}
              onClick={this.handleCoachingSubmit}
              id="survey-button"
              className="btn btn-primary btn-lg submit-button"
            >
              {this.state.loadingSend ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>Enviar Evaluación</>
              )}
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
