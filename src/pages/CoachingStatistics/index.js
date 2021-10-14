import React, { Component } from "react";
import Moment from 'react-moment'

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import api from "../../services/api";

import {LateDateAlert} from "./survey_statistics.js";

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
      const sliceComaZero = string => {
        return (string[string.length-3] === '0' ? 
          string.slice(0, string.length-4) + '%' : string
        )
      }
      response.data.forEach(element => {
        element.coaching.date = new Date(element.coaching.date)
        element.coaching.pop = sliceComaZero(element.coaching.pop)
        element.coaching.coaching = sliceComaZero(element.coaching.coaching)
        element.coaching.exibition = sliceComaZero(element.coaching.exibition)
      });

      this.setState({coachings: response.data});
      console.log(response.data)
      
    } catch (error) {
      this.renderError(
      error.response !== undefined
        ? error.response.data.error
        : "Error no identificado al cargar datos"
      );
    }
  };

  getDateAlertColor = (date) => {
    const coachingDate = date;
    const today = new Date()

    const differenceInTime = today.getTime() - coachingDate.getTime();
  
    // To calculate the no. of days between two dates
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 30) {
      return '#dc3545'
    }
    else if (differenceInDays > 15) {
      return '#d29d00'
    } else {
      return '#198754'
    }
  }


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
                      this.setState({coachings: []})
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
              <table id="table">
                <thead>
                  <tr className="table-row">
                    <th className="table-header">Preventista</th>
                    <th className="table-header">Pop</th>
                    <th className="table-header">Coaching</th>
                    <th className="table-header">Exhibicion</th>
                    <th className="table-header date">Fecha</th>
                  </tr>
                </thead>
                <tbody id="tbody">
                  {coachings.map(({seller, coaching}) => {
                    return (
                      <tr className="table-row">
                        <td className="table-data text-data">{seller}</td>
                        <td className="table-data numeric-data">{coaching.pop}</td>
                        <td className="table-data numeric-data">{coaching.coaching}</td>
                        <td className="table-data numeric-data">{coaching.exibition}</td>
                        <LateDateAlert color={this.getDateAlertColor(coaching.date)}>
                          <Moment add={{ hours: 3 }} format='DD/MM'>{coaching.date}</Moment>
                        </LateDateAlert>
                      </tr>
                    )
                  })}
                </tbody>
            </table>
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
