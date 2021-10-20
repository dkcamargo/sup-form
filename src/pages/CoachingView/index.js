import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Moment from 'react-moment'
import moment from 'moment'
import 'moment/locale/es'

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

import Auth from "../../components/Auth";
import Header from "../../components/Header";
import api from "../../services/api";

import "./coaching_view.css";
import {PercentageAlert} from "./coaching_view";
import FormContainer from "../../components/FormContainer";

export default class CoachingView extends Component {
  state = {
    comments: true,
    commentsText: "",
    strongPoints: "",
    weakPoints: "",
    error: "",
    finalStats: [],
    sellerName: "",
    date: ""
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 4000);
  };

  download = () => {
    // const input = ;
    window.scrollTo(0,0)
    html2canvas(document.getElementById('pdf-wrap'))
      .then((canvas) => {

        const imgData = canvas.toDataURL("image/jpeg");

        const pdf = new jsPDF({
          orientation: "portrait", // landscape or portrait
          unit: "mm",
          format: "a4",
        });
        const imgProps = pdf.getImageProperties(imgData);
        const margin = 0.15;

        const pdfWidth = pdf.internal.pageSize.width * (1 - margin);
        const pdfHeight = pdf.internal.pageSize.height * (1 - margin);

        const x = pdf.internal.pageSize.width * (margin * 1.75);
        const y = pdf.internal.pageSize.height * (margin / 2);

        const widthRatio = pdfWidth / imgProps.width;
        const heightRatio = pdfHeight / imgProps.height;
        const ratio = Math.min(widthRatio, heightRatio);

        const w = imgProps.width * ratio;
        const h = imgProps.height * ratio;

        pdf.addImage(imgData, "JPEG", x, y, w, h);

        pdf.save(`coaching_${this.state.sellerName.toLowerCase().replace(' ', '_')}_${moment(this.state.date).add(3, 'hours').format('DD/MM/YY')}`);
      });
  }

  getColorByPercentage(percentage) {
    let red;
    let green
    /**
     * PARSING TO WORK 0 => 100
     */
    percentage = percentage * 100;

    /**\
     * IF THERE'S MORE THEN 50
     * THIS IS THE CONDITION FOR FLOWING THRU THE YELLOW
     * 0% 50% WE INCREASE THE GREEN VALUE
     * 0% R255 G0 RED
     * 50% R255 G255 = YELLOW
     * 
     * AFTER THAT WE HAVE TO DECREASE THE RED VALUE
     * 100% R0 G255 = GREEN
     */
    if(percentage - 50 <= 0) {
      red = 255;
      green = ((percentage) * 255 ) / 50;
    } else {
      green = 255;
      red = 255 - ((percentage - 50 ) * 255 ) / 50;
    }

    /**
     * ROUNDING CUZ WE ARE WORKING WITH INTEGERS
     */
    red = Math.round(red + Number.EPSILON);
    green = Math.round(green + Number.EPSILON);

    /**
     * COLOR = TRUE COLOR BUT 50% DARKER
     * BACKGROUND = TRUE COLOR WITH BUT 0.3 OPACITY
     * 
     * a little bit of blue bc it looks noice
     */
    return {
      color: `rgb(${red - (red / 2)},${green - (green / 2)}, 50)`,
      backgroundColor: `rgba(${red},${green}, 50, 0.3)`
    };
  }

  handleGoBack = () => {
    const {
      sucursal,
      sellerId
    } = this.props.match.params;
    return this.props.history.push(`/coachings/${sucursal}/${sellerId}`);
  }
  
  getData = async (sucursal, sellerId, coachingId) => {

    try {

    const response = await api.get(`/coaching-history/${sucursal}/${sellerId}/${coachingId}`);
    const { 
      comment,
      strongPoints,
      weakPoints,
      date
    } = response.data.coaching;
    console.log(response.data)
    const coaching = response.data.coaching;
    const sellerName = response.data.sellerName;
    this.setState({
      sellerName: sellerName,
      date: new Date(date),
      comment: comment,
      strongPoints: strongPoints,
      weakPoints: weakPoints
    })
      
    const statsData = [
        {colors: this.getColorByPercentage(coaching.lastOrder), data: coaching.lastOrder, label: "¿Indaga sobre el último pedido?"},
        {colors: this.getColorByPercentage(coaching.sellPlan), data: coaching.sellPlan, label: "¿Planifica el pedido antes de ingresar al PDV?"},
        {colors: this.getColorByPercentage(coaching.popStat), data: coaching.popStat, label: "¿POP?"},
        {colors: this.getColorByPercentage(coaching.stock), data: coaching.stock, label: "¿Verifica el stock en todas las áreas del PDV?"},
        {colors: this.getColorByPercentage(coaching.exposition), data: coaching.exposition, label: "¿Trabaja en una mayor exposición de los productos?"},
        {colors: this.getColorByPercentage(coaching.competitorSales), data: coaching.competitorSales, label: "¿Indaga y verifica la situación y las acciones de la competencia?"},
        {colors: this.getColorByPercentage(coaching.sales), data: coaching.sales, label: "¿Comunica las acciones comerciales vigentes?"},
        {colors: this.getColorByPercentage(coaching.sellPropouse), data: coaching.sellPropouse, label: "¿Realiza la propuesta de ventas, ofreciendo todos los productos?"},
        {colors: this.getColorByPercentage(coaching.deliveryPrecautions), data: coaching.deliveryPrecautions, label: "¿Toma todos los recaudos necesarios para facilitar la entrega? (pedido, dinero, horario, etc.)"},
        {colors: this.getColorByPercentage(coaching.popPricing), data: coaching.popPricing, label: "¿Renueva, coloca y pone precios al POP? Siguiendo criterios del PDV"},
        {colors: this.getColorByPercentage(coaching.timeManagement), data: coaching.timeManagement, label: "¿Administra el tiempo de permanencia en el PDV?"},
        {colors: this.getColorByPercentage(coaching.catalogue), data: coaching.catalogue, label: "Uso de Catálogo"},
        {colors: this.getColorByPercentage(coaching.total), data: coaching.total, label: "Puntaje final:"},
      ]
      this.setState({
        finalStats: statsData
      });

    } catch (error) {
      console.error(error)
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al buscar datos"
        );
    }
  }

  componentDidMount() {
    this.setState({sellerId: this.props.match.params.sellerId});
    this.setState({coachingId: this.props.match.params.coachingId});
    this.getData(this.props.match.params.sucursal, this.props.match.params.sellerId, this.props.match.params.coachingId)
  }

  render() {
    const { 
      sellerId,
      finalStats,
      sellerName,
      date,
      coachingId
    } = this.state;
    return (
      <div id="view-coaching-wrap">
        <Header />
        <Auth />
        <FormContainer>
          <main id="view-coaching">
          <div id="pdf-wrap">
            <div id="history-title">
              <h3>
                {finalStats.length !== 0? `${sellerName}`: `Historial de Coaching preventista ${sellerId}`}
              </h3>
              <h2>
                {finalStats.length !== 0?  
                  <>
                    <Moment  locale="es" add={{ hours: 3 }} format='DD MMMM YYYY'>{date}</Moment>
                  </> : 
                  <>
                    Coaching {coachingId}
                  </>}
              </h2>
            </div>
              <hr />
              {this.state.error !== "" ? (
                <div
                  className="alert alert-danger"
                  role="alert"
                  style={{ marginBottom: "1.6rem" }}
                >
                  {this.state.error}
                </div>
              ) : null}
              {this.state.finalStats.length !== 0?
                <>
                  {
                    this.state.finalStats.map((stat, index) => {
                      return(
                        <PercentageAlert
                        colors={stat.colors}
                        key={index}
                        >
                            <div
                              style={{maxWidth: '80%'}}
                            >{stat.label}</div>
                            <div>
                              {Math.round((stat.data + Number.EPSILON) * 10000) /
                                100}
                              %
                            </div>
                        </PercentageAlert>
                      )
                    })
                  }
                  
                  <div className="form-group">
                    <label style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }} htmlFor="comments-text">
                      Comentarios:
                    </label>
                    <div
                      className={`form-control comments`}
                      style={{ minHeight: "3rem" }}
                      type="text"
                      aria-disabled
                      id="comments-text"
                    >
                      {this.state.comment !== ""? this.state.comment: "Sin comentarios!"}
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }} htmlFor="strong-points">
                      Puntos Fuertes:
                    </label>
                    <div
                      className={`form-control comments`}
                      style={{ minHeight: "3rem" }}
                      type="text"
                      aria-disabled
                      id="strong-points"
                    >
                      {this.state.strongPoints !== ""? this.state.strongPoints: "Sin comentarios!"}
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }} htmlFor="weak-points">
                      Puntos a Desarrollar:
                    </label>
                    <div
                      className={`form-control comments`}
                      style={{ minHeight: "3rem" }}
                      type="text"
                      aria-disabled
                      id="weak-points"
                    >
                      {this.state.weakPoints !== ""? this.state.weakPoints: "Sin comentarios!"}
                    </div>
                  </div>
                </>:
                <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                  Cargando datos de los coachings...<AiOutlineLoading3Quarters className="icon-spin" />
                </div>
              }
            </div>
            {this.state.finalStats.length !== 0?
              <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button className="btn btn-outline-danger" onClick={this.handleGoBack}>
                  Volver
                </button>
                <button className="btn btn-outline-success" onClick={this.download}>
                  Download
                </button>
              </div>
            :
              <button className="btn btn-outline-danger" onClick={this.handleGoBack}>
                Volver
              </button>
            }
          </main>
        </FormContainer>
      </div>
    );
  }
}
