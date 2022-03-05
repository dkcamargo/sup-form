import React, { useState, useEffect  } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import Header from "../../components/Header";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import api from '../../services/api';

import "./end.css";

function End() {

  const {state: locationState} = useLocation();
  const navigate = useNavigate();

  const [lastOne, setLastOne] = useState(false);

  const formType = locationState.formType;
  const surveyClientCountage = 30;
  const coachingClientCountage = 12;

  /**
   * GET ALL THE STATISTICS PERCENTAGES
   * @param {obj for the countage of the coaching statistics} stats
   * @param {divisor for taking the average} divisor 
   * @returns object with percentage for each question
   */
  const getFinalStats = (stats, formsSubmited, questionsQuantity) => {
      const {
        lastOrder,
        sellPlan,
        pop,
        stock,
        exposition,
        competitorSales,
        sales,
        sellPropouse,
        deliveryPrecautions,
        popPricing, 
        timeManagement,
        catalogue
      } = stats;

      let total = 0;
      for(var stat in stats) {
        total = total + stats[stat]
      }
      return {
        lastOrder: lastOrder / formsSubmited,
        sellPlan: sellPlan / formsSubmited,
        popStat: pop / formsSubmited,
        stock: stock / formsSubmited,
        exposition: exposition / formsSubmited,
        competitorSales: competitorSales / formsSubmited,
        sales: sales / formsSubmited,
        sellPropouse: sellPropouse / formsSubmited,
        deliveryPrecautions: deliveryPrecautions / formsSubmited,
        popPricing: popPricing / formsSubmited,
        timeManagement: timeManagement / formsSubmited,
        catalogue: catalogue / formsSubmited,
        total: total / (formsSubmited * questionsQuantity)
      }
  };
  

  const deleteOldCoachingProgress = () => {
    const { clientCountage, id } = locationState;

    if (formType === "coaching") {
      if (`${clientCountage}` === `${coachingClientCountage}`) {
        return api.delete(`/continue/${id}`);
      }
    }
  };

  const deleteOldSurveyProgress = () => {
    const { clientCountage, id } = locationState;

    if (formType === "relevamiento") {
      if (`${clientCountage}` === `${surveyClientCountage}`) {
        return api.delete(`/continue/${id}`);
      }
    } 
  };

  const redirectToPostCoaching = () => {
    const {
      clientCountage,
      seller,
      route,
      id,
      sellerName,
      stats
    } = locationState;

    return navigate('/post-coaching', {state: {
      formType: formType,
      clientCountage: Number(coachingClientCountage),
      seller: seller,
      route: route,
      id: id,
      sellerName: sellerName,
      postCoaching: true,
      finalStats: getFinalStats(stats, clientCountage, 12)
    }});
  };
  
  const saveThisProgress = () => {
    const {
      id,
      clientCountage,
      formType,
      stats
    } = locationState;

    if (formType === 'relevamiento') {
      return api.put(`/continue/${id}`, {countage: clientCountage});
    } else {
      return api.put(`/continue/${id}`, {countage: clientCountage, stats: stats});
    }
  };

  const goToNextForm = (e) => {
    // send all info as parameters creating a recurtion
    const {
      formType,
      clientCountage,
      seller,
      route,
      id,
      sellerName,
      stats
    } = locationState;

    return navigate(`/${formType}`, { state: {
      formType: formType,
      clientCountage: Number(clientCountage) + 1,
      seller: seller,
      route: route,
      id: id,
      sellerName: sellerName,
      stats
    }});
  };

  const goToMain = (e) => {
    // go back to the seller selection leaving the lstorage as it is
    window.localStorage.removeItem('tableData');
    return navigate('/');
  };

  // "componentDidMount"
  useEffect(() => {
    if(formType === 'relevamiento') setLastOne(locationState.clientCountage === 30);
    if (formType === 'coaching') setLastOne(locationState.clientCountage === 12);

    console.log(locationState);

    if(formType === 'relevamiento') deleteOldSurveyProgress();
    if (formType === 'coaching') {
      if(locationState.postCoaching) deleteOldCoachingProgress();
      else redirectToPostCoaching();
    };

    saveThisProgress();
  
  }, []);
  
  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main className="end">
          <h2>Fin</h2>
          <div
            className={
              (formType !== 'coaching' && !lastOne)
                ? "end-button-wrap"
                : "end-button-wrap end-button-wrap-ended"
            }
          >
            {formType !== 'coaching' || lastOne?
              <button
                onClick={goToMain}
                id="continue-button"
                className={
                  !lastOne
                    ? "btn btn-secondary  btn-lg end-button"
                    : "btn btn-success  btn-lg end-button end-button-ended"
                }
              >
                Selección de ruta
              </button>
            : null}
            {!lastOne ? (
              <button
                onClick={goToNextForm}
                id="begin-button"
                className="btn btn-primary  btn-lg end-button"
              >
                Proximo cliente
              </button>
            ) : null}
          </div>
        </main>
      </FormContainer>
    </>
  );
}

export default End;
