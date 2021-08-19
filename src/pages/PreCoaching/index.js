import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Auth from "../../components/Auth";
import Header from "../../components/Header";
import Switch from "../../components/Switch";
import api from "../../services/api";

import "./pre_coaching.css";
import FormContainer from "../../components/FormContainer";

export default class PreCoaching extends Component {
  state = {
    loadingSend: false,
    uniformPop: false,
    dailyGoal: false,
    price: false,
    posters: false,
    plan: false,
    sales: false,
    helmet: false,
    noCellphone: false,
    laws: false,
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

  handlePreCoachingSubmit = async () => {
    /**
     * send data to api and
     * redirect to caoching 1 pass the type by query
     */
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = this.props.location.state;
    const {
      uniformPop,
      dailyGoal,
      price,
      posters,
      plan,
      sales,
      helmet,
      noCellphone,
      laws,
      cordx,
      cordy
    } = this.state;

    const data = {
      sucursal,
      supervisor,
      seller,
      route,
      uniformPop,
      dailyGoal,
      price,
      posters,
      plan,
      sales,
      helmet,
      noCellphone,
      laws,
      cordx,
      cordy
    };

    this.setState({ loadingSend: true });
    try {
      await api.post("/pre-coaching", data);
      return this.props.history.push("/coaching", this.props.location.state);
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Pre Coaching"
      );
    } finally {
      this.setState({
        loadingLogIn: false
      });
    }
  };

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
  }
  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="pre-coaching">
            <h2>Antes de iniciar la ruta</h2>
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
            <Switch
              label="¿Tiene el uniforme correspondiente, el kit básico y suficiente material POP?"
              name="uniform-pop"
              id="uniform-pop"
              labelStyle={{
                fontSize: "1.6rem"
              }}
              onChange={(e) => this.setState({ uniformPop: e.target.checked })}
            />

            <Switch
              label="¿Conoce el avance de las marcas y los objetivos del día, planificados para los principales calibres?"
              name="daily-goal"
              id="daily-goal"
              labelStyle={{
                fontSize: "1.6rem"
              }}
              onChange={(e) => this.setState({ dailyGoal: e.target.checked })}
            />

            <Switch
              label="¿Conoce los precios de los 6 principales productos que vende?"
              name="price"
              id="price"
              labelStyle={{
                fontSize: "1.6rem"
              }}
              onChange={(e) => this.setState({ price: e.target.checked })}
            />

            <Switch
              label="¿Conoce el estado de los afiches en la ruta?"
              name="posters"
              id="posters"
              labelStyle={{
                fontSize: "1.6rem"
              }}
              onChange={(e) => this.setState({ posters: e.target.checked })}
            />

            <Switch
              label="¿Planifica la ruta del día?"
              name="plan"
              id="plan"
              labelStyle={{
                fontSize: "1.6rem"
              }}
              onChange={(e) => this.setState({ plan: e.target.checked })}
            />

            <Switch
              label="¿Conoce las acciones del día y sus respectivos precios?"
              name="sales"
              id="sales"
              labelStyle={{
                fontSize: "1.6rem"
              }}
              onChange={(e) => this.setState({ sales: e.target.checked })}
            />

            <h2>Seguridad Vial</h2>
            <hr />

            <Switch
              label="Utiliza Casco?"
              name="helmet"
              id="helmet"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ helmet: e.target.checked })}
            />

            <Switch
              label="¿Conduce sin utilizar el celular?"
              name="no-cellphone"
              id="no-cellphone"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ noCellphone: e.target.checked })}
            />

            <Switch
              label="¿Respeta las leyes de transito?"
              name="laws"
              id="laws"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ laws: e.target.checked })}
            />

            <button
              disabled={this.state.loadingSend}
              onClick={this.handlePreCoachingSubmit}
              id="pre-coaching-button"
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
