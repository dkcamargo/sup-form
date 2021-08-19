import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Pie } from "react-chartjs-2";

import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./statistics.css";

export default class Statistics extends Component {
  state = {
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 1500);
  };


  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="statistics">
            <Nav active="statistics"/>
            <h2>Estatisticas</h2>
            <hr />
            <h3>Quantidad de Relevamientos:</h3>
            <div
              style={{
                position: `relative`,
                width: "95%"
              }}
            >
              <Pie
                data={{
                  labels: ['Gaston', 'Manuel', 'Gustavo'],
                  datasets: [
                    {
                      label: '#% of Votes',
                      data: [5, 5, 3],
                      backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                      ],
                      borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />

            </div>
          </main>
        </FormContainer>
      </>
    );
  }
}
