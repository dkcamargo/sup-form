import React, { useEffect, useState } from "react";
import Moment from 'react-moment'
import 'moment/locale/es'
import { Link, useParams } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import api from "../../services/api";

import "./coaching_history.css";


function CoachingHistory() {
  const {
    sucursal,
    sellerId
  } = useParams();

  const [sellerName, setSellerName] = useState("");
  const [error, setError] = useState("");
  const [coachings, setCoachings] = useState([]);  

  useEffect(async () => {
      try {
        const response = await api.get(`/coaching-history/${sucursal}/${sellerId}`);
  
        setCoachings(response.data.coachings);
        setSellerName(response.data.sellerName);        
      } catch (error) {
        renderError(
          error.response !== undefined
            ? error.response.data.error
            : "Error no identificado al cargar datos"
        );
      }
  }, [])

  // reder error label
  const renderError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 2500);
  };
  
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


          {error !== "" ? (
            <>
              <hr />
              <div
                className="alert alert-danger"
                role="alert"
                style={{ marginBottom: "1.6rem" }}
              >
                {error}
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
                  {coachings.map((coaching, index) => {
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
          <Link className="btn btn-outline-danger" to="/coachings">
            Volver
          </Link>
        </main>
      </FormContainer>
    </>
  );

}

export default CoachingHistory;
