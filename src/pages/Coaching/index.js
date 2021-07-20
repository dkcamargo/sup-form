import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Input from "../../components/Input";
import Switch from "../../components/Switch";
import SwitchToggleButtons from "../../components/SwitchToggleButtons";
import CheckInput from "../../components/CheckInput";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Auth from "../../components/Auth";
import api from "../../services/api";

import "./coaching.css";

export default class Coaching extends Component {
  state = {
    clientCountage: 0,
    clientId: 0,
    clientName: "",
    loadingSend: false,
    lastOrder: false,
    sellPlan: false,
    pop: false,
    stock: false,
    exposition: false,
    competitorSales: false,
    sales: false,
    sellPropouse: false,
    deliveryPrecautions: false,
    popPricing: false,
    timeManagement: false,
    catalogue: false,
    relationship: ""
  };

  handleCoachingSubmit = () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to end pass the type by query
     */
    const {
      clientCountage,
      clientId,
      clientName,
      loadingSend,
      lastOrder,
      sellPlan,
      pop,
      stock,
      exposition,
      competitorSales,
      sales,
      sellPropouse,
      deliveryPrecautions,
      popPricing,
      timeManagement,
      catalogue,
      relationship
    } = this.state;
    console.log({
      clientCountage,
      clientId,
      clientName,
      loadingSend,
      lastOrder,
      sellPlan,
      pop,
      stock,
      exposition,
      competitorSales,
      sales,
      sellPropouse,
      deliveryPrecautions,
      popPricing,
      timeManagement,
      catalogue,
      relationship
    });

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
        <Auth />
        <FormContainer>
          <main id="coaching">
            <h2>
              Cliente Numero: <strong>{clientCountage}</strong>
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
              info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
              pattern="\d*"
              name="client-id"
              id="client-id"
              onChange={(e) => this.setState({ clientId: e.target.value })}
            />

            <Switch
              label="¿Indaga sobre el último pedido?"
              name="last-order"
              id="last-order"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ lastOrder: e.target.checked })}
            />
            <Switch
              label="¿Planifica el pedido antes de ingresar al PDV?"
              name="sell-plan"
              id="sell-plan"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ sellPlan: e.target.checked })}
            />
            <Switch
              label="¿POP?"
              name="pop"
              id="pop"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ pop: e.target.checked })}
            />
            <Switch
              label="¿Verifica el stock en todas las áreas del PDV?"
              name="stock"
              id="stock"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ stock: e.target.checked })}
            />

            <Switch
              label="¿Trabaja en una mayor exposición de los productos?"
              name="exposition"
              id="exposition"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ exposition: e.target.checked })}
            />
            <Switch
              label="¿Indaga y verifica la situación y las acciones de la competencia?"
              name="competitor-sales"
              id="competitor-sales"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ competitorSales: e.target.checked })
              }
            />
            <Switch
              label="¿Comunica las acciones comerciales vigentes?"
              name="sales"
              id="sales"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ sales: e.target.checked })}
            />
            <Switch
              label="¿Realiza la propuesta de ventas, ofreciendo todos los productos?"
              name="sell-propouse"
              id="sell-propouse"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ sellPropouse: e.target.checked })
              }
            />
            <Switch
              label="¿Toma todos los recaudos necesarios para facilitar la entrega? (pedido, dinero, horario, etc.)"
              name="delivery-precautions"
              id="delivery-precautions"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ deliveryPrecautions: e.target.checked })
              }
            />
            <Switch
              label="¿Renueva, coloca y pone precios al POP? Siguiendo criterios del PDV"
              name="pop-pricing"
              id="pop-pricing"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ popPricing: e.target.checked })}
            />
            <Switch
              label="¿Administra el tiempo de permanencia en el PDV?"
              name="time-management"
              id="time-management"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ timeManagement: e.target.checked })
              }
            />
            <Switch
              label="Uso de Catálogo"
              name="catalogue"
              id="catalogue"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ catalogue: e.target.checked })}
            />
            <SwitchToggleButtons
              label="Relación con el cliente:"
              options={[
                { label: "Muy buena", value: "Muy buena", name: "very-good" },
                { label: "Buena", value: "Buena", name: "good" },
                { label: "Regular", value: "Regular", name: "regular" },
                { label: "Mala", value: "Mala", name: "bad" }
              ]}
              labelStyle={{
                fontSize: "1.8rem"
              }}
              name="relationship"
              onChange={(e) => this.setState({ relationship: e.target.value })}
            />

            <hr />
            <button
              disabled={this.state.loadingSend}
              onClick={this.handleCoachingSubmit}
              id="coaching-button"
              className="btn btn-primary btn-lg submit-button"
              style={{ marginTop: "2rem" }}
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
