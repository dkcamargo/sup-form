import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Input from "../../components/Input";
import CheckInput from "../../components/CheckInput";
import Textarea from "../../components/Textarea";
import Switch from "../../components/Switch";
import SwitchToggleButtons from "../../components/SwitchToggleButtons";
import TableCheckToggleButtons from "../../components/TableCheckToggleButtons";
import TableSwitches from "../../components/TableSwitches";
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
    frequency: "",
    logisticsProblems: "",
    logisicProblemComment: ""
  };

  handleTableCheckSelect = () => {
    const redcomProductsArray = [
      ...document
        .getElementById("survey-redcom-products")
        .getElementsByTagName("input")
    ];

    console.log(redcomProductsArray);

    redcomProductsArray.forEach(function (element, index, array) {
      // console.log(`${element.id} ${element.checked}`);
      if (element.checked) {
        if (element.id.split("-")[1] === "gondola") {
          console.log("test");
          document
            .getElementById(`${element.id.split("-")[0]}-no-product`)
            .setAttribute("checked", true);
        }
      }
    });
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
              Cliente Numero <strong>{clientCountage}</strong>
            </h2>
            <hr />
            <Input
              label="Nombre del Cliente"
              type="text"
              name="client-name"
              id="client-name"
              onChange={(e) => this.setState({ clientName: e.target.value })}
            />
            <CheckInput
              label="Codigo del Cliente"
              type="number"
              pattern="\d*"
              name="client-id"
              id="client-id"
              info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
              onChange={(e) => this.setState({ clientId: e.target.value })}
            />
            <Switch
              label="Cliente con Visita?"
              name="client-visited"
              id="client-visited"
              onChange={(e) =>
                this.setState({ clientVisited: e.target.checked })
              }
            />
            <SwitchToggleButtons
              label="Frecuencia de visita:"
              options={[
                { label: "Dos veces", value: "twice", name: "twice" },
                { label: "Una vez", value: "once", name: "once" },
                { label: "No visita", value: "no", name: "no" },
                { label: "Distancia", value: "distance", name: "distance" }
              ]}
              name="times-visited"
              onChange={(e) => {
                this.setState({ frequency: e.target.value });
              }}
            />
            <TableCheckToggleButtons
              label="Relevamiento productos REDCOM:"
              columns={[
                {
                  label: "Sin Producto",
                  value: "sin-producto",
                  name: "no-product"
                },
                { label: "Gondola", value: "gondola", name: "gondola" },
                { label: "Afiche", value: "afiche", name: "poster" },
                {
                  label: "Precificación",
                  value: "precificacion",
                  name: "pricing"
                }
              ]}
              lines={[
                { name: "secco", label: "Secco" },
                { name: "sdlp", label: "Sierra de Los Padres" },
                { name: "nevares", label: "Nevares" },
                { name: "vitalissima", label: "Vitalissima" },
                { name: "quento", label: "Snacks Quento" },
                { name: "linea", label: "Linea Papel" }
              ]}
              onChange={this.handleTableCheckSelect}
              name="survey-redcom-products"
            />

            <TableSwitches
              name="exhibition"
              label="Exhibición Marcas:"
              lines={[
                { name: "secco", label: "Secco" },
                { name: "sdlp", label: "Sierra de Los Padres" },
                { name: "nevares", label: "Nevares" },
                { name: "vitalissima", label: "Vitalissima" },
                { name: "quento", label: "Snacks Quento" },
                { name: "linea", label: "Linea Papel" }
              ]}
            />

            <TableCheckToggleButtons
              label="Relevamiento Competencia Gaseosas:"
              columns={[
                {
                  label: "Sin Producto",
                  value: "sin-producto",
                  name: "no-product"
                },
                { label: "Gondola", value: "gondola", name: "gondola" },
                { label: "Afiche", value: "afiche", name: "poster" },
                {
                  label: "Precificación",
                  value: "precificacion",
                  name: "pricing"
                }
              ]}
              lines={[
                { name: "cabalgata", label: "Cabalgata" },
                { name: "manaos", label: "Manaos" },
                { name: "caribe", label: "Caribe" },
                { name: "cunnington", label: "Cunnington" },
                { name: "axis", label: "Axis" }
              ]}
            />

            <TableCheckToggleButtons
              label="Relevamiento Competencia Gaseosas:"
              columns={[
                {
                  label: "Sin Producto",
                  value: "sin-producto",
                  name: "no-product"
                },
                { label: "Gondola", value: "gondola", name: "gondola" },
                { label: "Afiche", value: "afiche", name: "poster" },
                {
                  label: "Precificación",
                  value: "precificacion",
                  name: "pricing"
                }
              ]}
              lines={[
                { name: "levite", label: "Levite" },
                { name: "aquarius", label: "Aquarius" },
                { name: "awafruit", label: "Awafruit" },
                { name: "baggio-fresh", label: "Baggio Fresh" }
              ]}
            />
            <Textarea label="Comentarios Generales:" name="general-comment" />
            <Switch
              label="Reclamos Logistica?"
              name="logistics"
              id="logistics"
              value={true}
              onChange={(e) => {
                this.setState({ logisticsProblems: e.target.checked });
              }}
            />
            {this.state.logisticsProblems ? (
              <Textarea
                label="Comentarios Logistica:"
                name="logistics-comment"
                onChange={(e) => {
                  this.setState({ logisicProblemComment: e.target.value });
                }}
              />
            ) : (
              <></>
            )}

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
