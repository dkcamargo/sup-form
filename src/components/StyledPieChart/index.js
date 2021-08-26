import React, { Component } from 'react'
import { Chart } from "react-google-charts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


import "./styled_pie_chart.css";


export default class StyledPieChart extends Component {
    state = {
        chartData: {},
        title: "",
        size: 0
    };

    constructor(props) {
        super(props)

        this.state.chartData = props.data;
        this.state.title = props.label;
        // this.state.size = props.size;
    };
    
    render() {
        const {
            chartData, 
            title,
        } = this.state;
        
        return (
            <div>
                <Chart
                    chartType="PieChart"
                    loader={<div> <AiOutlineLoading3Quarters className="icon-spin" /> Cargando...</div>}
                    data={chartData}
                    width="100%"
                    height="24rem"
                    getChartWrapper={chartWrapper => {
                        // get a reference to the chartWrapper
                        this.chartWrapper = chartWrapper
                        // Redraw when you want
                        chartWrapper.draw();;
                    }}
                    options={{
                        title: title,
                        titleTextStyle: {
                            fontSize: 12,
                            fontFamily: 'Roboto lt'
                        },
                        legend: {
                            position: 'left',
                        },
                        is3D: true,
                        chartArea: { left: 15, top: 60, right: 5, bottom: 0 },
                        
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
            </div>
        )
    }
}
