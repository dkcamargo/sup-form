import React, { useState, useEffect } from "react";
import Moment from 'react-moment'
import 'moment/locale/es'
import * as moment from 'moment'

import { Link } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import api from "../../services/api";

import {LateDateAlert} from "./coaching_statistics.js";

import "./coaching_statistics.css";


function CoachingStatistics() {

  const [error, setError] = useState("");
  const [sucursal, setSucursal] = useState(window.localStorage.getItem('sucursal'));
  const [coachings, setCoachings] = useState([]);
  const [copySuccess, setCopySuccess] = useState('Copiar!');

  const roll = window.localStorage.getItem("roll") === 'admin';

  useEffect(async () => {
    console.log('useEffectSucursal', sucursal)
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

      setCoachings(response.data);
      console.log(response.data)
    } catch (error) {
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al cargar datos"
      );
    }
  }, [sucursal])
  
  
  // reder error label
  const renderError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 2500);
  };

  const copyToClipboard = (e) => {
    setCopySuccess('Copiar!');

    let tableString = '\tCoaching\n\tPreventista\tPop\tExhibicion\tCoaching\tFecha\n';

    coachings.forEach(({id, name, coaching}) => {
      const date = new Date(coaching.date)
      const stringDate = moment(date).format('DD/MM/YYYY')

      tableString = tableString.concat(

        `${id}\t${name}\t${
          coaching.pop.replace(',', '.')
        }\t${
          coaching.exibition.replace(',', '.')
        }\t${
          coaching.coaching.replace(',', '.')
        }\t${
          stringDate
        }\n`
      )
      return
    });
    
    navigator.clipboard.writeText(tableString)
    
    
    setCopySuccess('Copiado!');
    setTimeout(() => {
      setCopySuccess('Copiar!');
    }, 1000);
  };

  
  const detectMobile = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
  };

  const getDateAlertColor = (date) => {
    const coachingDate = date;
    const today = new Date()

    const differenceInTime = today.getTime() - coachingDate.getTime();
  
    // To calculate the no. of days between two dates
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 30) {
      return '#dc3545'
    } else {
      return '#198754'
    }
  };
  
  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main id="coaching-statistics">
          <Nav active="coachings"/>

          <h2>Coachings</h2>


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
          {roll?
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
                    setCoachings([]);
                    setSucursal(e.target.value);
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
            <>
              {!detectMobile()?
                <button id="copy-btn" className="btn btn-outline-primary" onClick={copyToClipboard}>
                  {copySuccess} <MdContentCopy size={12}/>
                </button> 
              :<></>}
              <table id="coachings-table">
                <thead>
                  <tr className="table-row">
                    <th className="table-header">Preventista</th>
                    <th className="table-header" style={{justifySelf: 'center'}}>Coaching</th>
                    <th className="table-header" style={{justifySelf: 'center'}}>Pop</th>
                    <th className="table-header" style={{justifySelf: 'center'}}>Exhibicion</th>
                    <th className="table-header date">Fecha</th>
                  </tr>
                </thead>
                <tbody id="tbody">
                  {coachings.map(({name, id, coaching}, index) => {
                    return (
                      <Link key={index} to={`/coachings/${sucursal}/${id}`}>
                        <tr className="table-row">
                          <td className="table-data text-data">{name}</td>
                          <td className="table-data numeric-data">{coaching.coaching}</td>
                          <td className="table-data numeric-data">{coaching.pop}</td>
                          <td className="table-data numeric-data">{coaching.exibition}</td>
                          <LateDateAlert color={getDateAlertColor(coaching.date)}>
                            <Moment add={{ hours: 3 }} format='DD/MM'>{coaching.date}</Moment>
                          </LateDateAlert>
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
        </main>
      </FormContainer>
    </>
  );
}

export default CoachingStatistics;
