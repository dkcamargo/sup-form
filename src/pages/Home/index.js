import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./seller.css";

function Home() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedSellerRoutes, setSelectedSellerRoutes] = useState([]);
  const [evaluationType, setEvaluationType] = useState("");
  const [error, setError] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);

  const navigate = useNavigate();


  const continueForm = () => {
    /**
     * REDIRECT TO CONTINUE ROUTE ../Continue/index
     */
    return navigate('/continuar');
  };

  const logOut = () => {
    /**
     * CLEAR THE LS AND GO BACK TO LOGING PAGE
     * IT DELETES ALL YOUR PROGRESSES
     */
    window.localStorage.clear();
    return navigate('/login');
  };

  const startForm = async () => {

    // handling unfinished form
    if (
      selectedSeller === "" ||
      selectedRoute === "" ||
      evaluationType === ""
    ) {
      return renderError("Tenés que elegir alguna opción");
    }

    await getTableDataFromApi();
    console.log('Done getTableDataFromApi!');
    
    const thisProgressId = await configureProgressID();

    //if error return and don't redirect
    if (!thisProgressId) {
      renderError('Error al cargar progreso en el servidor');
      return
    };
    console.log('Done configureProgressID!');

    if (evaluationType === "relevamiento") {
      redirectAsSurvey(thisProgressId);
    } else {
      redirectAsCoaching(thisProgressId);
    }
    return;
  }
  
  // redirect to survey form
  const redirectAsSurvey = (thisProgressId) => {
    return navigate('relevamiento', { state: {
      formType: evaluationType, 
      clientCountage: 1, 
      seller: selectedSeller,
      sellerName: sellers.find((seller) => seller.value === selectedSeller).label,
      route: selectedRoute,
      id: thisProgressId, //ID FOR UNDERSTANDING THE PROGRESSES AND AFTER DELETING EM WHEN FINISHED
    }});
  };

  const redirectAsCoaching = (thisProgressId) => {
    return navigate('pre-coaching', { state: {
      formType: evaluationType, 
      clientCountage: 1, 
      seller: selectedSeller,
      sellerName:sellers.find((seller) => seller.value === selectedSeller).label,
      route: selectedRoute,
      id: thisProgressId, //ID FOR UNDERSTANDING THE PROGRESSES AND AFTER DELETING EM WHEN FINISHED
      stats: {
        lastOrder: 0.0,
        sellPlan: 0.0,
        pop: 0.0,
        stock: 0.0,
        exposition: 0.0,
        competitorSales: 0.0,
        sales: 0.0,
        sellPropouse: 0.0,
        deliveryPrecautions: 0.0,
        popPricing: 0.0,
        timeManagement: 0.0,
        catalogue: 0.0
      }
    }});
  };
  
  // render a error label
  const renderError = (errorMessage) => {
    /**
     * RENDER AN ERROR MESSAGE FOR  1500ms AND THEN UNREDER IT
     */
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 1500);
  };

  const configureProgressID = async () => {
    setLoadingSend(true);
    let progerssID = -1
    try {
        /***
         * CONFIGURING PROGRESSES ID 
         */
        //get the progresses array form api
        const response = await api.post(`/continue`, {
          "supervisor": window.localStorage.getItem("supervisor"),
          "route": selectedRoute,
          "formType": evaluationType
        });
        progerssID = response.data.id;

    } catch (error) {
      console.log(error);
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al cargar datos de relevamiento"
      );
      /**
       * RETURN 1 SO IT DONT REDIRECT TO THE NEXT PAGE
       */
    } finally {
      /**
       * UNSET THE LOADING ASPECT
       */
      setLoadingSend(false);
      return progerssID;
      }
  };

  // get products data from API
  const getTableDataFromApi = async () => {
    /**
     * CONFIGURING THE PRODUCTS IN THE FORM BY SUCURSAL
     * ONLY IF ITS SURVEY BECAUSE COACHING DOES NOT NEED THE PRODUCTS
     */
    if (evaluationType === "relevamiento") {
      /**
       * DISABLING THE BUTTON TILL THE NEXT PAGE DATA ARE RECIVED
       */
      setLoadingSend(true);
      try {
        /**
         * GET ALL THE PRODUCTS FOR EACH TABLE FROM API
         */
        const tableData = await api.get(`/products/${window.localStorage.getItem("sucursal")}`);

        /**\
         * SET THE PRODUCTS FOR EACH TABLE IN LS
         */
        window.localStorage.setItem(
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
        /**
         * RETURN SO IT DONT REDIRECT TO THE NEXT PAGE
         */
        return;
      } finally {
        /**
         * UNSET THE LOADING ASPECT
         */
        setLoadingSend(false);
      }
    }
  };

  // get the routes from api
  const getRoutesFromApiBySeller = async (selectedSeller) => {
      try {
        const sucursal = window.localStorage.getItem("sucursal");
  
        const response = await api.get(
          `/routes/${sucursal}/${selectedSeller}`
        );

        setSelectedSellerRoutes(response.data.map((row) => ({ value: row.id, label: row.name })));
        console.log(response.data.map((row) => ({ value: row.id, label: row.name })));
        
    
      } catch (error) {
        renderError(
          error.response !== undefined
            ? error.response.data.error
            : "Error no identificado al cargar datos"
        );
      }
  };
  
  
  // "componentDidMount"
  useEffect(() => {
    const getSellersFromApi = async () => {
      try {
        const supervisor = window.localStorage.getItem("supervisor");
        const sucursal = window.localStorage.getItem("sucursal");
        const response = await api.get(`/sellers/${sucursal}/${supervisor}`);
        /**
         * SET THE SELECT OPTIONS
         */
        setSellers(response.data.map((row) => ({ value: row.id, label: row.name })));
        console.log(response.data.map((row) => ({ value: row.id, label: row.name })))
      } catch (error) {
        renderError(
          error.response !== undefined
            ? error.response.data.error
            : "Error no identificado al cargar datos"
        );
      }
    }
    getSellersFromApi();
  }, []);
  

  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main id="seller">
          <Nav active="form"/>
          <h2>Elección de Ruta</h2>
          <hr />



          <Select
            options={sellers}
            loadOption="Cargando"
            label="Vendedor a Supervisar"
            name="prevetista"
            id="prevetista"
            onChange={(e) => {
              setSelectedSeller(e.target.value);
              getRoutesFromApiBySeller(e.target.value);
            }}
          />



          <Select
            options={selectedSellerRoutes}
            loadOption={
              selectedSeller !== "" &&
              selectedSellerRoutes !== []
                ? "Cargando"
                : "Elegí un preventista primero"
            }
            label="Ruta a supervisionar"
            name="ruta"
            id="ruta"
            onChange={(e) => {
              setSelectedRoute(e.target.value);
            }}
          />



          <div className="evaluation-type">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="evaluation-type"
                id="survey-radio"
                value="relevamiento"
                onChange={(e) =>
                  // TODO
                  setEvaluationType(e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="relevamiento">
                Relevamiento
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="evaluation-type"
                id="coaching-radio"
                value="coaching"
                onChange={(e) =>
                  // TODO
                  setEvaluationType(e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="coaching">
                Coaching
              </label>
            </div>
          </div>




          {error !== "" ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}





          <button
            disabled={loadingSend}
            onClick={startForm}
            id="begin-button"
            className="btn btn-primary btn-lg submit-button seller-button"
          >
            {loadingSend ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : ( 
              <>Empezar</>
            )}
          </button>

          <div className="or">
            <hr />
            <p>o entonces</p>
            <hr />
          </div>

          <button
            onClick={continueForm}
            id="continue-button"
            className="btn btn-secondary btn-lg submit-button seller-button"
          >
            Continuar
          </button>

          <button
            onClick={logOut}
            id="continue-button"
            className="btn btn-danger btn-lg submit-button seller-button"
          >
            Log Out
          </button>  
          
        </main>
      </FormContainer>
    </>
  );
}

export default Home;