import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'

import Auth from "../../components/Auth";
import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";
import api from "../../services/api";


import "./continue.css";

function Continue() {
  const navigator = useNavigate();
  
  const [progresses, setProgresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false)
  const [error, setError] = useState('');

  // render a error label
  const renderError = (errorMessage) => {
    /**
     * RENDER AN ERROR MESSAGE FOR  1500ms AND THEN UNREDER IT
     */
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 5000);
  };
  
  const setTableData = async () => {
    setLoadingSend(true);
    try {
      // get tables datas
      const tableData = await api.get(
        `/products/${window.localStorage.getItem("sucursal")}`
      );

      await window.localStorage.setItem(
        "tableData",
        JSON.stringify(tableData.data)
      );
    } catch (error) {
      console.log(error);
      renderError(
        error.response !== undefined
        ? error.response.data.error
        : "Error no identificado al cargar datos de relevamiento"
      );
    } finally {
      setLoadingSend(false);
    }
  }
  
  const continueToForm = async (progressId) => {
    // get the info of the selected progress
    const {
      id,
      form_type: formType,
      client_countage: clientCountage,
      seller_id: sellerId,
      route_id: routeId,
      seller_name: sellerName,
      stats: apiStats
    } = progresses.find((progress) => progress.id === progressId);

    let stats = apiStats;

    if (formType === 'coaching') {
      stats = {
        id: apiStats.id,
        lastOrder: apiStats.last_order,
        sellPlan: apiStats.sell_plan,
        pop: apiStats.pop,
        stock: apiStats.stock,
        exposition: apiStats.exposition,
        competitorSales: apiStats.competitor_sales,
        sales: apiStats.sales,
        sellPropouse: apiStats.sell_propouse,
        deliveryPrecautions: apiStats.delivery_precautions,
        popPricing: apiStats.pop_pricing,
        timeManagement: apiStats.time_management,
        catalogue: apiStats.catalogue
      };
    }
    
    if (formType === "relevamiento") await setTableData() 

    return navigator(`/${formType}`, { state: {
      formType: formType,
      clientCountage: Number(clientCountage) + 1,
      seller: sellerId,
      route: routeId,
      id: id,
      sellerName,
      threadId: apiStats.thread_id,
      stats: stats
    }});

  };
  
  const goToMain = () => {
    return navigator('/')
  };
    
  // "componentDidMout"
  useEffect(()=>{
    const getData = async () => {
      setLoadingData(true);
      try {
        const response = await api.get(`/continue/${window.localStorage.getItem('sucursal')}/${window.localStorage.getItem('supervisor')}`);
        console.log(response.data)
        setProgresses(response.data);
      } catch {
        renderError('Error al cargar datos del servidor.');
      } finally {
        setLoadingData(false);
      }
    };

    getData();
  }, [])
  
  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main className="continue">
          {!loadingData?
          <>
            {progresses !== null && progresses.length !== 0 ? (
              <>
                <div className="title">
                  <h2>Elegí la ruta que querés continuar:</h2>
                  {loadingSend ? (
                    <AiOutlineLoading3Quarters className="icon-spin loading" />
                  ) : (
                    <></>
                  )}
                </div>
                <hr />
                <div className="progresses">
                  {progresses.reverse().map((progress, index) => (
                    <div className="card" key={index}>
                      <div className="card-header">
                        Ruta: <strong>{progress.route}</strong>
                      </div>  
                      <div className="card-body">
                        <p className="card-text">
                          Vendedor: <strong>{progress.seller_name}</strong>
                        </p>
                        <p className="card-text">
                          Ultimo Cliente:{" "}
                          <strong>{progress.client_countage}</strong>
                        </p>
                        <p className="card-text">
                          Tipo de Formulario:{" "}
                          {progress.form_type.charAt(0).toUpperCase() +
                            progress.form_type.slice(1)}
                        </p>
                        <div className="d-grid gap-2">
                          <button
                            onClick={() => continueToForm(progress.id)}
                            className="btn btn-primary btn-lg"
                            disabled={loadingSend}
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

            {error !== "" ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : null}

            <button
              onClick={goToMain}
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

export default Continue;
