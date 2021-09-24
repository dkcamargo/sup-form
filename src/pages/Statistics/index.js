import React, { Component } from "react";


import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import StyledPieChart from "../../components/StyledPieChart";
import StyledBarChart from "../../components/StyledBarChart";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./statistics.css";

export default class Statistics extends Component {
  state = {
    roll: false,
    surveyBySupervisor: [],
    surveyBySeller: [],
    logisticProblems: [],
    redcom: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    soda: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    water: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    wine: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    sucursal: 1
  };

  getData = async () => {
    console.log(this.state.sucursal)
    const sucursal = this.state.sucursal;
    const supervisorResponse = await api.get(`/survey-data/supervisors/${sucursal}`);
    console.log(supervisorResponse.data)
    this.setState({surveyBySupervisor: supervisorResponse.data});


    const sellerResponse = await api.get(`/survey-data/sellers/${sucursal}`);
    console.log(sellerResponse.data)
    this.setState({surveyBySeller: sellerResponse.data});


    const logisticResponse = await api.get(`/survey-data/logistic/${sucursal}`);
    console.log(logisticResponse.data)
    this.setState({logisticProblems: logisticResponse.data});

    const productsResponse = await api.get(`/survey-data/products/${sucursal}`);
    console.log(productsResponse.data)

    this.setState(prevState => ({
      water: {
        ...prevState.water,           // copy all other key-value pairs of food object
        data: productsResponse.data.water
      },
      redcom: {
        ...prevState.redcom,           // copy all other key-value pairs of food object
        data: productsResponse.data.redcom
      },
      soda: {
        ...prevState.soda,           // copy all other key-value pairs of food object
        data: productsResponse.data.soda
      },
      wine: {
        ...prevState.wine,           // copy all other key-value pairs of food object
        data: productsResponse.data.wine
      }

    }))
  };
  
  clearStates = () => {
    this.setState({surveyBySupervisor: []});

    this.setState({surveyBySeller: []});


    this.setState({logisticProblems: []});


    this.setState(prevState => ({
      water: {
        ...prevState.water,           // copy all other key-value pairs of food object
        data: []
      },
      redcom: {
        ...prevState.redcom,           // copy all other key-value pairs of food object
        data: []
      },
      soda: {
        ...prevState.soda,           // copy all other key-value pairs of food object
        data: []
      },
      wine: {
        ...prevState.wine,           // copy all other key-value pairs of food object
        data: []
      }
    }))
    return 
  }
  
  componentDidMount() {

    this.setState({
      sucursal: window.localStorage.getItem('sucursal')
    });

    const roll = window.localStorage.getItem("roll");
    this.setState({
      roll: roll === 'admin'
    })

    this.getData()
  };
  
  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="statistics">
            <Nav active="statistics"/>
            <h2>Estadisticas</h2>

            {this.state.roll?
              <>
                <div className="form-group">
                  <label
                    htmlFor="filter-type"
                    style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }}
                  >
                    Sucursal
                  </label>
                  <select 
                    onChange={e => {
                      console.log(e.target.value)
                      this.setState({sucursal: e.target.value})
                      this.clearStates();
                      this.getData();
                    }} 
                    className="form-select" 
                    id="filter-type"
                  >
                    <option default value={1}>Corrientes</option>
                    <option value={2}>Resistencia</option>
                    <option value={3}>Posadas</option>
                  </select>
                </div>
              </>
            :<></>}
            {this.state.redcom.data.length !== 0?
              <StyledPieChart label="Quantidad de Relevamientos de cada supervisor:" data={this.state.surveyBySupervisor} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
            {this.state.redcom.data.length !== 0?
              <StyledPieChart label="Quantidad de Relevamientos de cada preventista:" data={this.state.surveyBySeller} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
            
            {this.state.redcom.data.length !== 0?
              <StyledPieChart label="Quantidad de PDV con reclamos de logistica:" data={this.state.logisticProblems} colors={["#DC3912", "#3366CC"]} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
            
            

            {this.state.redcom.data.length !== 0?
            <>
              <h3 style={{marginTop: '2.4rem', marginLeft: '1.2rem'}}>Filtros de Relevamiento</h3>
              <div className="input-group mb-3" style={{marginBottom: '2.4rem'}}>
                <label className="input-group-text" htmlFor="filter-type">Tipo de Filtro</label>
                <select defaultValue="" className="form-select" id="filter-type">
                  <option value="" disabled={true}>Elegí un tipo de filtro...</option>
                  <option value="1">Por Supervisor</option>
                  <option value="2">Por Preventista</option>
                  <option value="3">Por Ruta</option>
                </select>
              </div>
              <div className="input-group mb-3" style={{marginBottom: '2.4rem'}}>
                <label className="input-group-text" htmlFor="filter-value">Valor del Filtro</label>
                <select className="form-select" id="filter-value">
                  <option value="0" hidden>
                    Elegí una opción
                  </option>
                  <option value="" disabled={true}>
                    Cargando...
                  </option>
                </select>
              </div>
              <div className="input-group mb-3" style={{marginBottom: '2.4rem'}}>
                <label className="input-group-text" htmlFor="filter-value">Intervalo</label>
                <input className="form-control" type="date" id="filter-date" />
                <input className="form-control" type="date" id="filter-date" />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="button">Filtrar</button>
              </div>
            </>
            :<></>}
            
            {this.state.redcom.data.length !== 0?
              <StyledBarChart label="Relevamiento de productos Redcom:" data={this.state.redcom.data} headers={this.state.redcom.headers} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }


            {this.state.redcom.data.length !== 0?
              <StyledBarChart label="Relevamiento de competencia de gaseosas:" data={this.state.soda.data} headers={this.state.soda.headers} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }


            {this.state.redcom.data.length !== 0?
              <StyledBarChart label="Relevamiento de competencia de aguas:" data={this.state.water.data} headers={this.state.water.headers} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }


            {this.state.redcom.data.length !== 0?
              <StyledBarChart label="Relevamiento de competencia de vinos:" data={this.state.wine.data} headers={this.state.wine.headers} />
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos del grafico...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
            
          </main>
        </FormContainer>
      </>
    );
  }
}
