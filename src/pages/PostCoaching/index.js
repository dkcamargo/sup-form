import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Auth from "../../components/Auth";
import Textarea from "../../components/Textarea";
import Header from "../../components/Header";
import Switch from "../../components/Switch";
import api from "../../services/api";

import "./post_coaching.css";
import {PercentageAlert} from "./post_coaching.js";
import FormContainer from "../../components/FormContainer";

export default class PostCoaching extends Component {
  state = {
    loadingSend: false,
    comments: true,
    commentsText: "",
    strongPoints: "",
    weakPoints: "",
    cordy: 0.0,
    cordx: 0.0,
    error: "",
    finalStats: []
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 4000);
  };

  handlePostCoachingSubmit = async () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to caoching 1 pass the type by query
     */
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = this.props.location.state;

    const {
      comments,
      strongPoints,
      weakPoints,
      cordx,
      cordy,
      finalStats
    } = this.state;

    const commentsText = !comments
      ? "Sin Comentarios"
      : this.state.commentsText;

    const data = {
      supervisor,
      sucursal,
      seller,
      route,
      commentsText,
      strongPoints,
      weakPoints,
      lastOrder: finalStats.lastOrder,
      sellPlan: finalStats.sellPlan,
      pop: finalStats.pop,
      stock: finalStats.stock,
      exposition: finalStats.exposition,
      competitorSales: finalStats.competitorSales,
      sales: finalStats.sales,
      sellPropouse: finalStats.sellPropouse,
      deliveryPrecautions: finalStats.deliveryPrecautions,
      popPricing: finalStats.popPricing,
      timeManagement: finalStats.timeManagement,
      catalogue: finalStats.catalogue,
      total: finalStats.total,
      cordx,
      cordy
    };

    this.setState({ loadingSend: true });
    try {
      await api.post("/post-coaching", data);
      return this.props.history.push("/fin", this.props.location.state);
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Post Coaching"
      );
    } finally {
      this.setState({
        loadingLogIn: false
      });
    }

    return this.props.history.push("/fin", this.props.location.state);
  };

  getColorByPercentage(percentage) {
    let red;
    let green
    /**
     * PARSING TO WORK 0 => 100
     */
    percentage = percentage * 100;

    /**\
     * IF THERE'S MORE THEN 50
     * THIS IS THE CONDITION FOR FLOWING THRU THE YELLOW
     * 0% 50% WE INCREASE THE GREEN VALUE
     * 0% R255 G0 RED
     * 50% R255 G255 = YELLOW
     * 
     * AFTER THAT WE HAVE TO DECREASE THE RED VALUE
     * 100% R0 G255 = GREEN
     */
    if(percentage - 50 <= 0) {
      red = 255;
      green = ((percentage) * 255 ) / 50;
    } else {
      green = 255;
      red = 255 - ((percentage - 50 ) * 255 ) / 50;
    }

    /**
     * ROUNDING CUZ WE ARE WORKING WITH INTEGERS
     */
    red = Math.round(red + Number.EPSILON);
    green = Math.round(green + Number.EPSILON);

    /**
     * COLOR = TRUE COLOR BUT 50% DARKER
     * BACKGROUND = TRUE COLOR WITH BUT 0.3 OPACITY
     * 
     * a little bit of blue bc it looks noice
     */
    return {
      color: `rgb(${red - (red / 2)},${green - (green / 2)}, 50)`,
      backgroundColor: `rgba(${red},${green}, 50, 0.3)`
    };
  }
  
  componentDidMount() {
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


    

    try {
      const { finalStats } = this.props.location.state;

      const statsData = [
        {colors: this.getColorByPercentage(finalStats.lastOrder), data: finalStats.lastOrder, label: "¿Indaga sobre el último pedido?"},
        {colors: this.getColorByPercentage(finalStats.sellPlan), data: finalStats.sellPlan, label: "¿Planifica el pedido antes de ingresar al PDV?"},
        {colors: this.getColorByPercentage(finalStats.pop), data: finalStats.pop, label: "¿POP?"},
        {colors: this.getColorByPercentage(finalStats.stock), data: finalStats.stock, label: "¿Verifica el stock en todas las áreas del PDV?"},
        {colors: this.getColorByPercentage(finalStats.exposition), data: finalStats.exposition, label: "¿Trabaja en una mayor exposición de los productos?"},
        {colors: this.getColorByPercentage(finalStats.competitorSales), data: finalStats.competitorSales, label: "¿Indaga y verifica la situación y las acciones de la competencia?"},
        {colors: this.getColorByPercentage(finalStats.sales), data: finalStats.sales, label: "¿Comunica las acciones comerciales vigentes?"},
        {colors: this.getColorByPercentage(finalStats.sellPropouse), data: finalStats.sellPropouse, label: "¿Realiza la propuesta de ventas, ofreciendo todos los productos?"},
        {colors: this.getColorByPercentage(finalStats.deliveryPrecautions), data: finalStats.deliveryPrecautions, label: "¿Toma todos los recaudos necesarios para facilitar la entrega? (pedido, dinero, horario, etc.)"},
        {colors: this.getColorByPercentage(finalStats.popPricing), data: finalStats.popPricing, label: "¿Renueva, coloca y pone precios al POP? Siguiendo criterios del PDV"},
        {colors: this.getColorByPercentage(finalStats.timeManagement), data: finalStats.timeManagement, label: "¿Administra el tiempo de permanencia en el PDV?"},
        {colors: this.getColorByPercentage(finalStats.catalogue), data: finalStats.catalogue, label: "Uso de Catálogo"},
        {colors: this.getColorByPercentage(finalStats.total), data: finalStats.total, label: "Puntaje final:"},
      ]
      this.setState({
        finalStats: statsData
      });
    } catch (error) {
      this.props.history.push("/preventista");
    }
  }

  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="post-coaching">
            <h2>Despues de terminar la ruta</h2>
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
            {
              this.state.finalStats.map(stat => {
                return(
                  <PercentageAlert
                  colors={stat.colors}
                  >
                      <div
                        style={{maxWidth: '80%'}}
                      >{stat.label}</div>
                      <div>
                        {Math.round((stat.data + Number.EPSILON) * 10000) /
                          100}
                        %
                      </div>
                  </PercentageAlert>
                )
              })
            }
            
            <Switch
              label="Comentarios?"
              name="comments"
              id="comments"
              value={true}
              checked={this.state.comments}
              onChange={(e) => {
                this.setState({ comments: e.target.checked });
              }}
            />
            {this.state.comments ? (
              <Textarea
                label="Comentarios:"
                name="comments-text"
                onChange={(e) => {
                  this.setState({ commentsText: e.target.value });
                }}
              />
            ) : (
              <></>
            )}

            <Textarea
              label="Puntos Fuertes:"
              name="strong-points"
              onChange={(e) => {
                this.setState({ strongPoints: e.target.value });
              }}
            />

            <Textarea
              label="Puntos a Desarrollar:"
              name="weak-points"
              onChange={(e) => {
                this.setState({ weakPoints: e.target.value });
              }}
            />

            <button
              disabled={this.state.loadingSend}
              onClick={this.handlePostCoachingSubmit}
              id="post-coaching-button"
              className="btn btn-primary btn-lg submit-button"
            >
              {this.state.loadingSend ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>Enviar</>
              )}
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
