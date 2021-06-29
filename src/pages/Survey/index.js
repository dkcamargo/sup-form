import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import api from "../../services/api";

import "./survey.css";

export default class Survey extends Component {
  state = {
    clientCountage: 0,
    clientId: 0
  };
  
  handleSurveySubmit() {
    return
  };

  componentDidMount() {
    this.setState({clientCountage: this.props.match.params.id});
  }
  render() {
    const { clientCountage } = this.state;
    return (
      <div className="survey-wrap">
        <Header />
        {/* <Auth /> */}
        <main id="main">
          <h2>Cliente Numero: <strong>{clientCountage}</strong></h2>
          <hr />
          <Input
            label="Codigo del Cliente"
            type="number"
            pattern="\d*"
            name="client-id"
            id="client-id"
            onChange={(e) => this.setState({ clientId: e.target.value })}
          />


          <div className="accordion evaluation-form" id="survey-form">
            <div 
              className="accordion-item"
            >
              <h3 className="accordion-header evaluation-header" id="survey-header">
                <button 
                  className="accordion-button" 
                  type="button"
                  data-bs-toggle="collapse" 
                  data-bs-target="#survey-collapse" 
                  aria-expanded="true" 
                  aria-controls="survey-collapse"
                >
                  Relevamiento
                </button>
              </h3>
              <div 
                id="survey-collapse" 
                className="accordion-collapse collapse show" 
                aria-labelledby="survey-header" 
                data-bs-parent="#survey-form"
              >
                <div className="accordion-body">
                  <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </div>
              </div>
            </div>
          </div>

          {/*  
            botão fechado: button className => add collapsed
            corpo fechado: accordion-collapse => add collapse
            botão aberto: button className => remove collapsed
            corpo aberto: accordion-collapse => add collapse show
          */}
          <div className="accordion evaluation-form" id="coaching-form">
            <div 
              className="accordion-item"
            >
              <h3 className="accordion-header evaluation-header" id="coaching-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button"
                  data-bs-toggle="collapse" 
                  data-bs-target="#coaching-collapse" 
                  aria-expanded="false" 
                  aria-controls="coaching-collapse"
                >
                  Coaching
                </button>
              </h3>
              <div 
                id="coaching-collapse" 
                className="accordion-collapse collapse" 
                aria-labelledby="coaching-header" 
                data-bs-parent="#survey-form"
              >
                <div className="accordion-body">
                  <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </div>
              </div>
            </div>
          </div>


          
          <button
            disabled={this.state.loadingLogIn}
            onClick={this.handleSendSrvey}
            id="login-button"
            className="btn btn-primary btn-lg"
          >
            {this.state.loadingLogIn ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : (
              <>Enviar Evaluación</>
            )}
          </button>
        </main>
      </div>
    );
  }
}
