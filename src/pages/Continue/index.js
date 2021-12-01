import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Auth from "../../components/Auth";
import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";
import api from "../../services/api";


import "./continue.css";

export default class Seller extends Component {
  state = {
    error: "",
    progresses: [],
    loading: true
  };
  handleContinue = async (progressId) => {
    // send all info as parameters creating a recurtion
    const { progresses } = this.state;
    // get the info of the selected progress
    const {
      formType,
      clientCountage,
      sellerId,
      routeId,
      id,
      sellerName,
      stats
    } = progresses.find((progress) => progress.id === progressId);

    if (formType === "relevamiento") {
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

    // redirect to the next client form
    return this.props.history.push(`/${formType}`, {
      formType: formType,
      clientCountage: Number(clientCountage) + 1,
      seller: sellerId,
      route: routeId,
      id: id,
      sellerName,
      stats
    });
  };

  getData = async () => {
    this.setState({
      loading: true
    });

    const response = await api.get(`/continue/${window.localStorage.getItem('sucursal')}/${window.localStorage.getItem('supervisor')}`);

    console.log(response.data)
    
    this.setState({
      progresses: response.data
    });

    this.setState({
      loading: false
    });
  };

  handleGoBack = () => {
    return this.props.history.push("/");
  };
  componentDidMount() {
    this.getData();
  }
  // render a list of buttons redirect to the selected route in the number it lasted
  render() {
    const { progresses, loading } = this.state;
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main className="continue">
            {!loading?
            <>
              {progresses !== null && progresses.length !== 0 ? (
                <>
                  <div className="title">
                    <h2>Elegí la ruta que querés continuar:</h2>
                    {this.state.loadingSend ? (
                      <AiOutlineLoading3Quarters className="icon-spin loading" />
                    ) : (
                      <></>
                    )}
                  </div>
                  <hr />
                  <div className="progresses">
                    {progresses.map((progress, index) => (
                      <div className="card" key={index}>
                        <div className="card-header">
                          Ruta: <strong>{progress.route}</strong>
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            Vendedor: <strong>{progress.seller}</strong>
                          </p>
                          <p className="card-text">
                            Ultimo Cliente:{" "}
                            <strong>{progress.clientCountage}</strong>
                          </p>
                          <p className="card-text">
                            Tipo de Formulario:{" "}
                            {progress.formType.charAt(0).toUpperCase() +
                              progress.formType.slice(1)}
                          </p>
                          <div className="d-grid gap-2">
                            <button
                              onClick={() => this.handleContinue(progress.id)}
                              className="btn btn-primary btn-lg"
                              disabled={this.state.loadingSend}
                            >
                              Continuar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2>No hay ninguna ruta para continuar!</h2>
                </>
              )}

              {this.state.error !== "" ? (
                <div className="alert alert-danger" role="alert">
                  {this.state.error}
                </div>
              ) : null}

              <button
                onClick={this.handleGoBack}
                id="back-button"
                className="btn btn-danger  btn-lg submit-button"
              >
                Volver
              </button>
            </>:
            <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center', fontSize: 28}}>
              Cargando rutas a continuar...<AiOutlineLoading3Quarters className="icon-spin" />
            </div>
            }
          </main>
        </FormContainer>
      </>
    );
  }
}
