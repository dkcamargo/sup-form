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
    relationship: "",
    cordy: 0.0,
    cordx: 0.0,
    error: ""
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 4000);
  };

  getStats(actualStats) {
    /**
     * TODO
     * SEPARATE EVERY QUESTION COUNTAGE IN A DIFERENT COUNTER ADD IT ALL TO A OBJECT
     * GET THE DATA FROM ACTUAL STATS {default=0}
     * ADD THE COUNTAGES
     * RETURN THE NEW STATS OBJECT
     */
    //STATISTICS
    const {
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
      catalogue
    } = this.state;
    /*
    stats: {
      lastOrder: 0.0,
      sellPlan: 0.0,
      pop: 0.0,
      stock: 0.0,
      exposition: 0.0,
      competitorSales: 0.0,
      sales: 0.0,
      sellPropouse: 0.0,
      deliveryPrecautions: 0.0,
      popPricing: 0.0,
      timeManagement: 0.0,
      catalogue: 0.0,
      total: 0.0 //AVG
    } //POINTAGE IN COACHING
    */
    let newStats = {};
    newStats.lastOrder = lastOrder ? actualStats.lastOrder + 1 : actualStats.lastOrder;
    newStats.sellPlan = sellPlan ? actualStats.sellPlan + 1 : actualStats.sellPlan;
    newStats.pop = pop ? actualStats.pop + 1 : actualStats.pop;
    newStats.stock = stock ? actualStats.stock + 1 : actualStats.stock;
    newStats.exposition = exposition ? actualStats.exposition + 1 : actualStats.exposition;
    newStats.competitorSales = competitorSales ? actualStats.competitorSales + 1 : actualStats.competitorSales;
    newStats.sales = sales ? actualStats.sales + 1 : actualStats.sales;
    newStats.sellPropouse = sellPropouse ? actualStats.sellPropouse + 1 : actualStats.sellPropouse;
    newStats.deliveryPrecautions = deliveryPrecautions ? actualStats.deliveryPrecautions + 1 : actualStats.deliveryPrecautions;
    newStats.popPricing = popPricing ? actualStats.popPricing + 1 : actualStats.popPricing;
    newStats.timeManagement = timeManagement ? actualStats.timeManagement + 1 : actualStats.timeManagement;
    newStats.catalogue = catalogue ? actualStats.catalogue + 1 : actualStats.catalogue;

    return newStats;
  }

  handleCoachingSubmit = async () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to end pass the type by query
     */

    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = this.props.location.state;

    const {
      clientId,
      clientName,
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
      relationship,
      cordy,
      cordx
    } = this.state;

    const data = {
      supervisor,
      sucursal,
      seller,
      route,
      clientId,
      clientName,
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
      relationship,
      cordy,
      cordx
    };

    if (clientName === "") {
      return this.renderError(
        `El campo de nombre del cliente no puede ser vacio`
      );
    }
    /**
     * THS STATS IN A OBJECT AND RE INSERT IT INTO THE LOCATION STATE
     */
    this.props.location.state.stats = this.getStats(this.props.location.state.stats);
      
    this.setState({ loadingSend: true });

    try {
      await api.post("/coaching", data);
      return this.props.history.push("/fin", this.props.location.state);
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Coaching"
      );
    } finally {
      this.setState({
        loadingLogIn: false
      });
    }
  };

  componentDidMount() {
    try {
      this.setState({
        clientCountage: this.props.location.state.clientCountage
      });
    } catch (error) {
      this.props.history.push("/");
    }

    /**
     * CONFIGURING GEOLOCALIZATION 
     */
    if (!("geolocation" in navigator)) {
      this.renderError("Geolocalización no activada");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        cordy: position.coords.latitude,
        cordx: position.coords.longitude
      });
    },
    () => {
      this.renderError("Geolocalización no activada");
      return
    },
    {
      enableHighAccuracy: true
    });
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
            {this.state.error !== "" ? (
              <div
                className="alert alert-danger"
                role="alert"
                style={{ marginBottom: "1.6rem" }}
              >
                {this.state.error}
              </div>
            ) : null}
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
