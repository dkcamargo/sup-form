import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Auth from "../../components/Auth";
import Textarea from "../../components/Textarea";
import Header from "../../components/Header";
import Switch from "../../components/Switch";
import api from "../../services/api";

import "./post_coaching.css";
import {PercentageAlert} from "./post_coaching.js";
import FormContainer from "../../components/FormContainer";

function PostCoaching() {

  
  const {state: locationState} = useLocation();
  const navigate = useNavigate();
  
  const [loadingSend, setLoadingSend] = useState(false);
  const [comments, setComments] = useState(true);
  const [commentsText, setCommentsText] = useState("");
  const [strongPoints, setStrongPoints] = useState("");
  const [weakPoints, setWeakPoints] = useState("");
  const [cordy, setCordy] = useState(0.0);
  const [cordx, setCordx] = useState(0.0);
  const [error, setError] = useState("");
  const [finalStats, setFinalStats] = useState([]);

  const submit = async () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to caoching 1 pass the type by query
     */
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route, threadId } = locationState;


    const commentsText = !comments ? "Sin Comentarios" : commentsText;

    console.log(locationState);

    const data = {
      threadId,
      supervisor,
      sucursal,
      seller,
      route,
      commentsText,
      strongPoints,
      weakPoints,
      lastOrder: locationState.finalStats.lastOrder,
      sellPlan: locationState.finalStats.sellPlan,
      pop: locationState.finalStats.popStat,
      stock: locationState.finalStats.stock,
      exposition: locationState.finalStats.exposition,
      competitorSales: locationState.finalStats.competitorSales,
      sales: locationState.finalStats.sales,
      sellPropouse: locationState.finalStats.sellPropouse,
      deliveryPrecautions: locationState.finalStats.deliveryPrecautions,
      popPricing: locationState.finalStats.popPricing,
      timeManagement: locationState.finalStats.timeManagement,
      catalogue: locationState.finalStats.catalogue,
      total: locationState.finalStats.total,
      cordx,
      cordy
    };

    setLoadingSend(true);
    try {
      await api.post("/post-coaching", data);
      return navigate("/fin", {state: locationState});
    } catch (error) {
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Post Coaching, Verificar señal de internet."
      );
    } finally {
      setLoadingSend(false);
    }
  };

  const getColorByPercentage = percentage => {
    let red;
    let green
    /**
     * PARSING TO WORK 0 => 100
     */
    percentage = percentage * 100;

    /*
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

  // reder error label
  const renderError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 2500);
  };

  // get geolocation when api already responded
  useEffect(() => {
    try {
      // request api
      navigator.geolocation.getCurrentPosition((position) => {
        setCordy(position.coords.latitude)
        setCordx(position.coords.longitude)
      },
      () => {
        this.renderError("Geolocalización no activada");
        return
      },
      {
        enableHighAccuracy: true
      });
    } catch (error) {
      // catch => render error
      renderError(
        error.response !== undefined
        ? error.response.data.error
        : "Error no identificado en al geoposición"
      );
    } 
  }, []);
    
  // componentDidMount
  useEffect(() => {
    console.log(locationState);
    try {
      const { finalStats } = locationState;

      const statsData = [
        {colors: getColorByPercentage(finalStats.lastOrder), data: finalStats.lastOrder, label: "¿Indaga sobre el último pedido?"},
        {colors: getColorByPercentage(finalStats.sellPlan), data: finalStats.sellPlan, label: "¿Planifica el pedido antes de ingresar al PDV?"},
        {colors: getColorByPercentage(finalStats.popStat), data: finalStats.popStat, label: "¿POP?"},
        {colors: getColorByPercentage(finalStats.stock), data: finalStats.stock, label: "¿Verifica el stock en todas las áreas del PDV?"},
        {colors: getColorByPercentage(finalStats.exposition), data: finalStats.exposition, label: "¿Trabaja en una mayor exposición de los productos?"},
        {colors: getColorByPercentage(finalStats.competitorSales), data: finalStats.competitorSales, label: "¿Indaga y verifica la situación y las acciones de la competencia?"},
        {colors: getColorByPercentage(finalStats.sales), data: finalStats.sales, label: "¿Comunica las acciones comerciales vigentes?"},
        {colors: getColorByPercentage(finalStats.sellPropouse), data: finalStats.sellPropouse, label: "¿Realiza la propuesta de ventas, ofreciendo todos los productos?"},
        {colors: getColorByPercentage(finalStats.deliveryPrecautions), data: finalStats.deliveryPrecautions, label: "¿Toma todos los recaudos necesarios para facilitar la entrega? (pedido, dinero, horario, etc.)"},
        {colors: getColorByPercentage(finalStats.popPricing), data: finalStats.popPricing, label: "¿Renueva, coloca y pone precios al POP? Siguiendo criterios del PDV"},
        {colors: getColorByPercentage(finalStats.timeManagement), data: finalStats.timeManagement, label: "¿Administra el tiempo de permanencia en el PDV?"},
        {colors: getColorByPercentage(finalStats.catalogue), data: finalStats.catalogue, label: "Uso de Catálogo"},
        {colors: getColorByPercentage(finalStats.total), data: finalStats.total, label: "Puntaje final:"},
      ]
      setFinalStats(statsData)
    } catch (error) {
      setFinalStats([]);
      renderError('Falla al buscar datos del sistema! Intente volver al menu principal y continuarla.');
    }
  }, []);

  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main id="post-coaching">
          <h2>Despues de terminar la ruta</h2>
          <hr />
          {error !== "" ? (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ marginBottom: "1.6rem" }}
            >
              {error}
            </div>
          ) : null}
          {
            finalStats.map((stat, index) => {
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
          
          <Switch
            label="Comentarios?"
            name="comments"
            id="comments"
            value={true}
            checked={comments}
            onChange={(e) => {
              setComments(e.target.checked);
            }}
          />
          {comments ? (
            <Textarea
              label="Comentarios:"
              name="comments-text"
              onChange={(e) => {
                setCommentsText(e.target.value);
              }}
            />
          ) : (
            <></>
          )}

          <Textarea
            label="Puntos Fuertes:"
            name="strong-points"
            onChange={(e) => {
              setStrongPoints(e.target.value);
            }}
          />

          <Textarea
            label="Puntos a Desarrollar:"
            name="weak-points"
            onChange={(e) => {
              setWeakPoints(e.target.value);
            }}
          />

          <button
            disabled={loadingSend}
            onClick={submit}
            id="post-coaching-button"
            className="btn btn-primary btn-lg submit-button"
          >
            {loadingSend ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : (
              <>Enviar</>
            )}
          </button>
        </main>
      </FormContainer>
    </>
  );
}

export default PostCoaching;  
