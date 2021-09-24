import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
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
    loadingSend: false,
    roll: false
  };

  renderError = (errorMessage) => {
    /**
     * RENDER AN ERROR MESSAGE FOR  1500ms AND THEN UNREDER IT
     */
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

  /**
   * WHEN STARTING A FORM RETRIVING DATA AND CONDITIONALLY REDIRECTING
   * @param {click event} event 
   * @returns 
   */
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



    /**
     * CONFIGURING THE PRODUCTS IN THE FORM BY SUCURSAL
     * ONLY IF ITS SURVEY BECAUSE COACHING DOES NOT NEED THE PRODUCTS
     */
    if (evaluationType === "relevamiento") {
      /**
       * DISABLING THE BUTTON TILL THE NEXT PAGE DATA ARE RECIVED
       */
      this.setState({ loadingSend: true });
      try {
        /**
         * GET ALL THE PRODUCTS FOR EACH TABLE FROM API
         */
        const tableData = await api.get(
          `/products/${window.localStorage.getItem("sucursal")}`
        );
        /**\
         * SET THE PRODUCTS FOR EACH TABLE IN LS
         */
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
        /**
         * RETURN SO IT DONT REDIRECT TO THE NEXT PAGE
         */
        return;
      } finally {
        /**
         * UNSET THE LOADING ASPECT
         */
        this.setState({
          loadingLogIn: false
        });
      }
    }

    /**
     * 
     *  redirect and send variables to the next page
     */ 
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
        id: thisProgressId, //ID FOR UNDERSTANDING THE PROGRESSES AND AFTER DELETING EM WHEN FINISHED
        //STATISTICS
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
          catalogue: 0.0
      }
    });
  };

  handleContinue = () => {
    /**
     * REDIRECT TO CONTINUE ROUTE ../Continue/index
     */
    return this.props.history.push("/continuar");
  };

  handleLogOut = () => {
    /**
     * CLEAR THE LS AND GO BACK TO LOGING PAGE
     * IT DELETES ALL YOUR PROGRESSES
     */
    window.localStorage.clear();
    return this.props.history.push("/");
  };

  getSellers = async () => {
    /**
     * GET ALL SELLERS BY SUPERVISOR AND SUCURSAL FROM API
     * 
     */
    try {
      const supervisor = window.localStorage.getItem("supervisor");
      const sucursal = window.localStorage.getItem("sucursal");
      const response = await api.get(`/sellers/${sucursal}/${supervisor}`);
      /**
       * SET THE SELECT OPTIONS
       */
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
    /**
     * GET THE SELLERS
     */
    this.getSellers();
    const roll = window.localStorage.getItem("roll");
    this.setState({
      roll: roll === 'admin' || roll === 'jefe'
    })
  }

  constructor(props) {
    super(props);
    /**
     * DEFINE A FIRSTLY DATA FOR THE SELECTS OPTIONS
     */
    this.state.selectedSeller = "";
    this.state.sellers = [];
  }
  render() {
    /**
     * JSX BABY
     */
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="seller">
            {
              this.state.roll?
                <Nav active="form"/>
              :<></>
            }
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
