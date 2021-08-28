import React, { Component } from 'react'
import { Chart } from "react-google-charts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


// import "./styled_pie_chart.css";


export default class StyledPieChart extends Component {
    state = {
        chartData: {},
        title: "",
        size: 0
    };

    parseToDataFormat = (headers, dataArray) => {
        let dataFormatArray = [
            /**
           * header data
           * label, TooltipObjects
           */
            [
                'Producto',
                'Hay Producto?', { role: "tooltip", type: "string", p:{ html: true }},
                'Esta Afichado?', { role: "tooltip", type: "string", p:{ html: true }},
                'Esta Precificado', { role: "tooltip", type: "string", p:{ html: true }}
            ],
        ];
    
        const TooltipHtml = (product, title, percentage) => (
            `<div style="padding: 0.8rem;color: black; display:flex; flex-direction:column; align-items: flex-start; justify-content: center">`+
                `<h3 style="white-space: nowrap;font-weight: bold;">${product}</h3>`+
                `<p style="white-space: nowrap"> ${title} <strong style="font-family: 'Roboto'">${Math.round((percentage + Number.EPSILON) * 10000) / 100}%</strong></p> `+
            `</div>`
        )
    
        const ParseToArray = (headers, rootArray) => {
            console.log(headers)
            console.log(rootArray)
            return [
                rootArray[0],
                rootArray[1],
                TooltipHtml(rootArray[0],headers[0],rootArray[1]),
                rootArray[2],
                TooltipHtml(rootArray[0],headers[1],rootArray[2]),
                rootArray[3],
                TooltipHtml(rootArray[0],headers[2],rootArray[3])
            ]   
        }
    
        dataArray.forEach(data => {
            console.log(data)
            console.log(headers)
            return dataFormatArray.push(ParseToArray(headers, data));
        })
        
        return dataFormatArray
      };

    constructor(props) {
        super(props)

        this.state.chartData = props.data;
        this.state.title = props.label;
        this.state.chartHeaders = props.headers;
    };
    
    render() {
        const {
            chartData,
            chartHeaders,
            title,
        } = this.state;
        
        return (
            <div>
                <Chart
                    width={'100%'}
                    height="40rem"
                    chartType="ColumnChart"
                    loader={<div> <AiOutlineLoading3Quarters className="icon-spin" /> Cargando...</div>}
                    data={this.parseToDataFormat(chartHeaders, chartData)}
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
                        title: title,
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
                        // This must be also set to render the tooltip with html (vs svg)
                        tooltip: { isHtml: true, trigger: "visible" }
                    }}
                    // For tests
                    rootProps={{ 'data-testid': '1' }}
                    />
            </div>
        )
    }
}
