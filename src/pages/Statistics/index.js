import React, { Component } from "react";

import { Chart } from "react-google-charts";


import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import StyledPieChart from "../../components/StyledPieChart";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./statistics.css";

export default class Statistics extends Component {
  state = {
    surveyBySupervisor: [
      ['Supervisor', 'Cuantidad de Relevamientos'],
      ['Gaston Flores', 11],
      ['Manuel Andrian', 2],
      ['Ruben Garay', 2],
      ['Gustavo Meza', 2],
      ['Juan Branchi', 1],
      ['Douglas Camargo', 1],
  ],
    surveyBySeller: [
      ['Preventista', 'Cuantidad de Relevamientos'],
      ['Facundo Regalado', 4],
      ['Bellen Escalante', 3],
      ['Ariel Lezcano', 3],
      ['Gonzalo Gomez', 2],
    ]
    
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
            <Chart
              width={'100%'}
              height="40rem"
              chartType="ColumnChart"
              loader={<div>Loading Chart</div>}
              data={[
                ['Producto', 'Hay Producto?', 'Esta Afichado?', 'Esta Precificado'],
                ['Secco', 0.100, 0.75, 0.25],
                ['Sierra de los Padres', 0.97, 0.48, 0.74],
                ['Nevares', 0.35, 0.47, 0.89],
                ['Vitalissima', 0.78, 0.99, 0.23],
                ['Quentos', 0.98, 0.47, 0.56],
                ['Estrella Parana', 0.35, 0.45, 0.99],
              ]}
              options={{
                titleTextStyle: {
                    fontSize: 12,
                    fontFamily: 'Roboto lt'
                },
                legend: { 
                  alignment:'center', 
                  position: 'top', 
                  maxLines: 3,
                  textStyle: {
                    fontSize: 9,
                  }
                },

                
                
                
                title: 'Relevamientos de Productos Redcom',
                vAxis: {
                  format: 'percent',
                  textStyle: {
                    fontSize: 8,
                  }
                },
                hAxis: {
                  textStyle: {
                    fontSize: 9,
                  },
                },
                
                chartArea: { left: 24, top: 48, right: 18, bottom: 24 },
              }}
              // For tests
              rootProps={{ 'data-testid': '1' }}
            />
            
            <StyledPieChart label="Quantidad de Relevamientos de cada supervisor:" data={this.state.surveyBySupervisor} />
            <StyledPieChart label="Quantidad de Relevamientos de cada preventista:" data={this.state.surveyBySeller} />
          </main>
        </FormContainer>
      </>
    );
  }
}
