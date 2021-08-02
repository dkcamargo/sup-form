import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";
import api from "../../services/api";

import "./home.css";

export default class Home extends Component {
  state = {
    sucursales: [
      { value: 1, label: "Corrientes" },
      { value: 2, label: "Resistencia" },
      { value: 3, label: "Posadas" }
    ],
    loadingLogIn: false,
    users: [],
    userId: "",
    password: "",
    sucursal: "",
    error: "",
    cordy: 0.0,
    cordx: 0.0
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 2500);
  };

  getOpttions = async () => {
    try {
      const response = await api.get("/users");

      this.setState({
        users: response.data.map((row) => {
          return { value: row.id, label: row.name };
        })
      });
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al cargar datos"
      );
    }
  };

  handleLogin = async () => {
    // return this.props.history.push("/preventista");
    // eslint-disable-next-line
    const { userId, password, sucursal, cordy, cordx } = this.state;
    if (userId === "" || password === "" || sucursal === "") {
      return this.renderError("No podés dejar los campos vacios!");
    }
    try {
      this.setState({ loadingLogIn: true });
      await api.post("/login", {
        userId,
        password,
        sucursal,
        cordy,
        cordx
      });
      this.setState({ loadingLogIn: false });
      //load session cookie
      window.localStorage.setItem("logged", true);
      window.localStorage.setItem("supervisor", userId);
      window.localStorage.setItem("sucursal", sucursal);
      // redirect now
      this.props.history.push("/preventista");
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el LogIn"
      );
      this.setState({
        loadingLogIn: false
      });
    }
  };

  // call axios get the supervisores data
  componentDidMount() {
    if (!("geolocation" in navigator)) {
      this.renderError("Geolocalización no activada");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        cordy: position.coords.latitude,
        cordx: position.coords.longitude
      });
    });

    this.getOpttions();
    console.log(process.env.NODE_ENV);
  }

  render() {
    return (
      <>
        <Header />
        <FormContainer>
          <main className="home">
            <h2>LogIn</h2>
            <hr />
            <Select
              options={this.state.users}
              loadOption="Cargando"
              label="Supervisor"
              name="supervisor"
              id="supervisor"
              onChange={(e) => this.setState({ userId: e.target.value })}
            />
            <Input
              label="Contraseña"
              type="password"
              name="password"
              id="password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <Select
              options={this.state.sucursales}
              label="Sucursal"
              name="sucursal"
              id="sucursal"
              onChange={(e) => this.setState({ sucursal: e.target.value })}
            />
            {this.state.error !== "" ? (
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            ) : null}
            <button
              disabled={this.state.loadingLogIn}
              onClick={this.handleLogin}
              id="login-button"
              className="btn btn-primary btn-lg submit-button"
            >
              {this.state.loadingLogIn ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>LogIn</>
              )}
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
