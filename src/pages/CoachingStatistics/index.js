import React, { Component } from "react";


import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import StyledPieChart from "../../components/StyledPieChart";
import CheckSelect from "../../components/CheckSelect";
import StyledBarChart from "../../components/StyledBarChart";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./survey_statistics.css";

export default class CoachingStatistics extends Component {
  state = {
    error: "",
    sucursal: "",
    coachings: []
  };


  renderError = (errorMessage) => {
    /**
     * RENDER AN ERROR MESSAGE FOR  1500ms AND THEN UNREDER IT
     */
    
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 5000);
  };

  
  getData = async (sucursal) => {

    this.setState({sucursal: sucursal});
    try {
      const response = await api.get(`/coaching-data/${sucursal}`);
      
      console.log(response.data)
      this.setState({coachings: response.data});
      
    } catch (error) {
      this.renderError(
      error.response !== undefined
        ? error.response.data.error
        : "Error no identificado al cargar datos"
      );
    }
  };


  componentDidMount() {
    const roll = window.localStorage.getItem("roll");
    this.setState({
      roll: roll === 'admin'
    })
    this.getData(window.localStorage.getItem('sucursal'))
  };


  constructor(props) {
    super(props)

    this.state.sucursal = window.localStorage.getItem('sucursal');
  }
  
  render() {
    const { coachings } = this.state;
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="coaching-statistics">
            <Nav active="coachings"/>

            <h2>Coachings</h2>

            {this.state.error !== "" ? (
              <>
                <hr />
                <div
                  className="alert alert-danger"
                  role="alert"
                  style={{ marginBottom: "1.6rem" }}
                >
                  {this.state.error}
                </div>
              </>
            ) : null}
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
                      this.clearStates();
                      this.getData(e.target.value);
                    }} 
                    className="form-select" 
                    id="filter-type"
                  >
                    <option value="1">Corrientes</option>
                    <option value="2">Resistencia</option>
                    <option value="3">Posadas</option>
                  </select>
                </div>
              </>
            :<></>}
            {coachings.length !== 0?
              <ul>
                {coachings.map(({seller, coaching}) => {
                  return (
                    <li style={{display: 'flex', justifyContent: 'space-between'}}>
                      <p>{seller}</p>
                      <p>{coaching.pop}</p>
                      <p>{coaching.coaching}</p>
                      <p>{coaching.exibition}</p>
                    </li>
                  )
                })}
            </ul>
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos de los coachings...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
          </main>
        </FormContainer>
      </>
    );
  }
}
