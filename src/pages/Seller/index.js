import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import api from "../../services/api";

import "./seller.css";

export default class Seller extends Component {
  state = {
    selectedSeller: "",
    selectedRoute: "",
    evaluationType: "",
    selectedSellerRoutes: [],
    sellers: [],
    error: "",
    loadingSend: false
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 1500);
  };

  handleSellerSelection = async (selectedSellerValue) => {
    // get the routes from api
    try {
      const sucursal = window.localStorage.getItem("sucursal");

      const response = await api.get(
        `/routes/${sucursal}/${selectedSellerValue}`
      );
      this.setState({
        selectedSellerRoutes: response.data.map((row) => {
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

  handleSellerSubmit = async (event) => {
    const { evaluationType, selectedSeller, selectedRoute } = this.state;

    if (
      selectedSeller === "" ||
      selectedRoute === "" ||
      evaluationType === ""
    ) {
      return this.renderError("Tenés que elegir alguna opción");
    }

    /***
     * CONFIGURING PROGRESSES ID AUTOINCREMENT
     */
    //get the progresses array form lstorage
    const storedProgresses = JSON.parse(
      window.localStorage.getItem("progress")
    );
    // by default is one
    var thisProgressId = 1;
    // if lstorage is not empty get the destinated id for this submition=> id+1
    if (storedProgresses !== null && storedProgresses.length !== 0) {
      // get last progress saved id
      const lastId = storedProgresses[storedProgresses.length - 1].id;
      // set new progress id to autoincrement
      thisProgressId = lastId + 1;
    }

    if (evaluationType === "relevamiento") {
      this.setState({ loadingSend: true });
      try {
        // get tables datas
        const tableData = await api.get(
          `/products/${window.localStorage.getItem("sucursal")}`
        );

        window.localStorage.setItem(
          "tableData",
          JSON.stringify(tableData.data)
        );
      } catch (error) {
        console.log(error);
        this.renderError(
          error.response !== undefined
            ? error.response.data.error
            : "Error no identificado al cargar datos de relevamiento"
        );
        return;
      } finally {
        this.setState({
          loadingLogIn: false
        });
      }
    }

    // redirect and send variables to the next page
    return this.props.history.push(
      `/${evaluationType === "relevamiento" ? "relevamiento" : "pre-coaching"}`,
      {
        formType: evaluationType,
        clientCountage: 1,
        seller: this.state.selectedSeller,
        sellerName: this.state.sellers.find(
          (seller) => seller.value === this.state.selectedSeller
        ).label,
        route: this.state.selectedRoute,
        id: thisProgressId,
        stats: 0
      }
    );
  };

  handleContinue = () => {
    return this.props.history.push("/continuar");
  };

  handleLogOut = () => {
    window.localStorage.clear();
    return this.props.history.push("/");
  };

  getSellers = async () => {
    try {
      const supervisor = window.localStorage.getItem("supervisor");
      const sucursal = window.localStorage.getItem("sucursal");
      const response = await api.get(`/sellers/${sucursal}/${supervisor}`);
      this.setState({
        sellers: response.data.map((row) => {
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
  componentDidMount() {
    this.getSellers();
  }

  constructor(props) {
    super(props);

    this.state.selectedSeller = "";
    this.state.sellers = [];
  }
  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="seller">
            <h2>Elección de Ruta</h2>
            <hr />
            <Select
              options={this.state.sellers}
              loadOption="Cargando"
              label="Vendedor a Supervisar"
              name="prevetista"
              id="prevetista"
              onChange={(e) => {
                this.setState({
                  selectedSeller: e.target.value,
                  selectedSellerRoutes: []
                });
                this.handleSellerSelection(e.target.value);
              }}
            />
            <Select
              options={this.state.selectedSellerRoutes}
              loadOption={
                this.state.selectedSeller !== "" &&
                this.state.selectedSellerRoutes !== []
                  ? "Cargando"
                  : "Elegí un preventista primero"
              }
              label="Ruta a supervisionar"
              name="ruta"
              id="ruta"
              onChange={(e) => this.setState({ selectedRoute: e.target.value })}
            />

            <div className="evaluation-type">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="evaluation-type"
                  id="survey-radio"
                  value="relevamiento"
                  onChange={(e) =>
                    this.setState({ evaluationType: e.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="relevamiento">
                  Relevamiento
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="evaluation-type"
                  id="coaching-radio"
                  value="coaching"
                  onChange={(e) =>
                    this.setState({ evaluationType: e.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="coaching">
                  Coaching
                </label>
              </div>
            </div>

            {this.state.error !== "" ? (
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            ) : null}
            <button
              disabled={this.state.loadingSend}
              onClick={this.handleSellerSubmit}
              id="begin-button"
              className="btn btn-primary btn-lg submit-button seller-button"
            >
              {this.state.loadingSend ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>Empezar</>
              )}
            </button>

            <div className="or">
              <hr />
              <p>o entonces</p>
              <hr />
            </div>
            <button
              onClick={this.handleContinue}
              id="continue-button"
              className="btn btn-secondary btn-lg submit-button seller-button"
            >
              Continuar
            </button>
            <button
              onClick={this.handleLogOut}
              id="continue-button"
              className="btn btn-danger btn-lg submit-button seller-button"
            >
              Log Out
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
