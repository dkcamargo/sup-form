import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Input from "../../components/Input";
import Switch from "../../components/Switch";
import SwitchToggleButtons from "../../components/SwitchToggleButtons";
import Header from "../../components/Header";
// import api from "../../services/api";

import "./survey.css";
import FormContainer from "../../components/FormContainer";

export default class Survey extends Component {
  state = {
    clientCountage: 0,
    loadingSend: false,
    clientId: 0,
    clientName: "",
    clientVisited: "",
    numberOfVisits: ""
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
    try {
      this.setState({
        clientCountage: this.props.location.state.clientCountage
      });
    } catch (error) {
      this.props.history.push("/preventista");
    }
  }
  render() {
    const { clientCountage } = this.state;
    return (
      <>
        <Header />
        {/* <Auth /> */}
        <FormContainer>
          <main id="survey">
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
            <Input
              label="Nombre del Cliente"
              type="text"
              name="client-name"
              id="client-name"
              onChange={(e) => this.setState({ clientName: e.target.value })}
            />
            <Switch
              label="Cliente con Visita?"
              name="client-visited"
              id="client-visited"
              onChange={(e) => this.setState({ clientVisited: e.target.value })}
            />
            <SwitchToggleButtons
              label="Frecuencia de visita:"
              options={[
                { label: "menos de una vez", value: "-1", name: "less-one" },
                { label: "una vez", value: "1", name: "once" },
                { label: "dos veces", value: "2", name: "twice" }
              ]}
              name="times-visited"
              onChange={(e) =>
                this.setState({ numberOfVisits: e.target.value })
              }
            />

            <button
              disabled={this.state.loadingSend}
              onClick={this.handleSurveySubmit}
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
