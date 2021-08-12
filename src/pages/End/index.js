import React, { Component } from "react";

import Header from "../../components/Header";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";

import "./end.css";

export default class Seller extends Component {
  state = {
    lastOne: false,
    surveyClientCountage: process.env.SURVEY_CLIENTS,
    coachingClientCountage: process.env.COACHING_CLIENTS
  };

  handleSameRoute = (e) => {
    // send all info as parameters creating a recurtion
    const {
      formType,
      clientCountage,
      seller,
      route,
      id,
      sellerName,
      stats
    } = this.props.location.state;
    return this.props.history.push(`/${formType}`, {
      formType: formType,
      clientCountage: Number(clientCountage) + 1,
      seller: seller,
      route: route,
      id: id,
      sellerName: sellerName,
      stats
    });
  };

  handleBackToRouteSelection = (e) => {
    // go back to the seller selection leaving the lstorage as it is
    window.localStorage.removeItem("tableData");
    return this.props.history.push("/preventista");
  };

  saveProgressInLocalStorage = () => {
    const {
      id,
      seller,
      route,
      clientCountage,
      formType,
      sellerName,
      stats
    } = this.props.location.state;

    // get progresses from lstorage
    const storedProgresses = JSON.parse(
      window.localStorage.getItem("progress")
    );

    var progresses;
    if (storedProgresses !== null && storedProgresses.length !== 0) {
      // if its not empty try to find this progress
      const popedProgress = storedProgresses.filter(
        (progress) => progress.id !== id
      );
      // set the progresses without the old data
      progresses = popedProgress;
    } else {
      progresses = [];
    }

    const { surveyClientCountage, coachingClientCountage } = this.state;
    // if its survey change the limit of submitions to 30
    if (formType === "relevamiento") {
      // if its not the max number of submitions
      if (clientCountage !== surveyClientCountage) {
        // append the new data to the progresses array of data
        progresses.push({
          id,
          formType,
          clientCountage,
          route,
          seller,
          sellerName,
          stats
        });
      }
    }
    if (formType === "coaching") {
      //if its coaching limit of sumitions 12
      if (clientCountage !== coachingClientCountage) {
        // append the new data to the progresses array of data
        progresses.push({
          id,
          formType,
          clientCountage,
          route,
          seller,
          sellerName,
          stats
        });
      }
    }
    // set it all to the local storage
    window.localStorage.setItem("progress", JSON.stringify(progresses));
    return;
  };

  /**
   * GET ALL THE STATISTICS PERCENTAGES
   * @param {obj for the countage of the coaching statistics} stats
   * @param {divisor for taking the average} divisor 
   * @returns object with percentage for each question
   */
  getFinalStats = (stats, formsSubmited, questionsQuantity) => {
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

  componentDidMount() {
    try {
      const { clientCountage, formType } = this.props.location.state;
      const { surveyClientCountage, coachingClientCountage } = this.state;

      if (formType === "relevamiento") {
        if (clientCountage === surveyClientCountage) {
          this.setState({ lastOne: true });
        }
      } else if (formType === "coaching") {
        if (clientCountage === coachingClientCountage) {
          if (this.props.location.state.postCoaching) {
            this.setState({ lastOne: true });
          } else {
            const {
              formType,
              seller,
              route,
              id,
              sellerName
            } = this.props.location.state;
            return this.props.history.push(`/post-coaching`, {
              formType: formType,
              clientCountage: Number(coachingClientCountage),
              seller: seller,
              route: route,
              id: id,
              sellerName: sellerName,
              postCoaching: true,
              finalStats: this.getFinalStats(this.props.location.state.stats, clientCountage, 12)
            });
          }
        }
      }

      this.saveProgressInLocalStorage();
    } catch (error) {
      console.log(error);
      this.props.history.push("/preventista");
      return;
    }
  }
  // recovers actual client from localStorage if 30(survey) or 12(coaching)
  // conditional rendering the NextClient btn
  render() {
    const { lastOne } = this.state;
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main className="end">
            <h2>Fin</h2>
            <div
              className={
                !lastOne
                  ? "end-button-wrap"
                  : "end-button-wrap end-button-wrap-ended"
              }
            >
              <button
                disabled={this.state.loadingLogIn}
                onClick={this.handleBackToRouteSelection}
                id="continue-button"
                className={
                  !lastOne
                    ? "btn btn-secondary  btn-lg end-button"
                    : "btn btn-success  btn-lg end-button end-button-ended"
                }
              >
                Selección de ruta
              </button>
              {!lastOne ? (
                <button
                  disabled={this.state.loadingLogIn}
                  onClick={this.handleSameRoute}
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
}
