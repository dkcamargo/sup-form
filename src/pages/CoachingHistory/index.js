import React, { Component } from "react";
import Moment from 'react-moment'
import 'moment/locale/es'
import { Link } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import api from "../../services/api";

import "./coaching_history.css";

export default class CoachingHistory extends Component {
  state = {
    sucursal: "",
    sellerId: "",
    sellerName: "",
    error: "",
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

  
  getData = async (sucursal, sellerId) => {

    this.setState({sucursal: sucursal});
    this.setState({sellerId: sellerId});
    try {
      const response = await api.get(`/coaching-history/${sucursal}/${sellerId}`);

      this.setState({coachings: response.data.coachings});
      this.setState({sellerName: response.data.sellerName});
      console.log(response.data)
      
    } catch (error) {
      this.renderError(
      error.response !== undefined
        ? error.response.data.error
        : "Error no identificado al cargar datos"
      );
    }
  };

  handleGoBack = () => {
    return this.props.history.push("/coachings");
  };

  componentDidMount() {
    this.getData(this.props.match.params.sucursal, this.props.match.params.sellerId)
  };

  
  render() {
    const { 
      sellerId,
      coachings,
      sucursal,
      sellerName
    } = this.state;
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="coaching-history">

          <div id="history-title">
            <h3>
              Historial de Coachings:
            </h3>
            <h2>
              {coachings.length !== 0? sellerName : `Preventista ${sellerId}`}
            </h2>
          </div>


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
            
            {coachings.length !== 0?
              <>
                <table id="history-table">
                  <thead>
                    <tr className="table-row">
                      <th className="table-header date">Fecha</th>
                      <th className="table-header">Coaching</th>
                      <th className="table-header">Pop</th>
                      <th className="table-header">Exhibicion</th>
                    </tr>
                  </thead>
                  <tbody id="tbody">
                    {coachings.reverse().map((coaching, index) => {
                      return (
                        <Link key={index} to={`/coachings/${sucursal}/${coaching.sellerId}/${coaching.coachingId}`}>
                          <tr className="table-row">
                            <td className="table-data numeric-data"><Moment locale="es" add={{ hours: 3 }} format='DD MMMM YYYY'>{coaching.date}</Moment></td>
                            <td className="table-data numeric-data">{coaching.coaching}</td>
                            <td className="table-data numeric-data">{coaching.pop}</td>
                            <td className="table-data numeric-data">{coaching.exibition}</td>
                          </tr>
                        </Link>
                      )
                    })}
                  </tbody>
              </table>
            </>
            :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos de los coachings...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
            <button className="btn btn-outline-danger" onClick={this.handleGoBack}>
              Volver
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
