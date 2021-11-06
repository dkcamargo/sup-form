import React, { Component } from "react";

import 'dotenv'
import Header from "../../components/Header";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import api from '../../services/api';

import "./end.css";

export default class Seller extends Component {
  state = {
    lastOne: false,
    surveyClientCountage: 1,
    coachingClientCountage: 1,
    formType: ""
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
    return this.props.history.push("/");
  };

  saveProgress = () => {
    const {
      id,
      clientCountage,
      formType,
      stats
    } = this.props.location.state;

    if (formType === 'relevamiento') {
      api.put(`/continue/${id}`, {countage: clientCountage});
    } else {
      api.put(`/continue/${id}`, {countage: clientCountage, stats: stats});
    }
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
    console.log(this.state.coachingClientCountage);
    
    try {
      const { clientCountage, formType } = this.props.location.state;
      const { surveyClientCountage, coachingClientCountage } = this.state;
      
      this.setState({formType: formType});
      if (formType === "relevamiento") {
        if (`${clientCountage}` === `${surveyClientCountage}`) {
          //deleting because it finished
          api.delete(`/continue/${this.props.location.state.id}`);
          //setting last one ui
          this.setState({ lastOne: true });
          return
        }
      } else if (formType === "coaching") {
        if (`${clientCountage}` === `${coachingClientCountage}`) {
          
          if (this.props.location.state.postCoaching) {
            //deleting because it finished
            api.delete(`/continue/${this.props.location.state.id}`);
            //setting last one ui
            this.setState({ lastOne: true });
            return
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

      //if did not finished save progress
      this.saveProgress();
    } catch (error) {
      console.log(error);
      this.props.history.push("/");
      return;
    }
  }

  constructor(props) {
    super(props)

    this.state.coachingClientCountage = 3;
    this.state.surveyClientCountage =  2;
    this.state.lastOne = false;
  }
  // recovers actual client from localStorage if 30(survey) or 12(coaching)
  // conditional rendering the NextClient btn
  render() {
    const { lastOne, formType } = this.state;
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
              : null}
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
