import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { PieChart, Pie, Legend, Cell, Tooltip } from 'recharts';

import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./statistics.css";

const RADIAN = Math.PI / 180;

export default class Statistics extends Component {
  state = {
    data: [
      { name: 'Group A', value: 400, color: '#0275dbbb' },
      { name: 'Group B', value: 300, color: '#5cb85cbf' },
      { name: 'Group C', value: 300, color: '#d9534fbf' },
      { name: 'Group D', value: 200, color: '#f0ad4ebf' },
    ]
  };

  getTotalData = () => {
    const { data } = this.state;
    const countage = data.map( el => el.value ).reduce((accumulator, value) => (accumulator + value));
    console.log(countage);
    return countage;

  }
  
  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 1500);
  };


  CustomTooltip = (props) => {
    if (props.active && props.payload && props.payload.length) {
      const percentage = Math.round((props.payload[0].value / this.getTotalData() + Number.EPSILON) * 10000) / 100;
      return (
        <div className="custom-tooltip" style={{ background: '#E5E5E8EE'}}>
          <p className="label">{`${props.payload[0].name}: ${percentage}%`}</p>
        </div>
      );
    }
  
    return null;
  };

  render() {
    const { CustomTooltip } = this;
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
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center'

              }} 
            >
            
              <PieChart width={400} height={400}>
              
                <Pie
                  data={this.state.data}
                  cx="50%"
                  cy="50%"
                  outerRadius={128}
                  dataKey="value"
                  blendStroke="true"
                  isAnimationActive={false}
                >
                
                  {this.state.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color}/>
                  ))}
                
                </Pie>
                
                
                <Tooltip content={<CustomTooltip/>}/>
                <Legend />

                
              </PieChart>
            </div>
          </main>
        </FormContainer>
      </>
    );
  }
}
