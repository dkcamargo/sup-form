import React, { Component } from "react";
import moment from 'moment'
import 'moment/locale/es'

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Auth from "../../components/Auth";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import StyledPieChart from "../../components/StyledPieChart";
import CheckSelect from "../../components/CheckSelect";
import StyledBarChart from "../../components/StyledBarChart";
import Nav from "../../components/Nav";
import api from "../../services/api";

import "./survey_statistics.css";

export default class SurveyStatistics extends Component {
  state = {
    filtered: false,
    sinData: false,
    supervisors: [],
    sucursal: "",
    initialDate: "",
    finalDate: "",
    selectedSeller: "",
    selectedRoute: "",
    selectedSupervisor: "",
    selectedSellerRoutes: [],
    sellers: [],
    roll: false,
    surveyBySupervisor: [],
    surveyBySeller: [],
    logisticProblems: [],
    visitedPdv: [],
    redcom: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
        'Exhibición'
      ],
      data: []
    },
    soda: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    water: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    wine: {
      headers: [
        'Cobertura',
        'Afiche',
        'Precificacion',
      ],
      data: []
    },
    error: ""
  };


  renderError = (errorMessage) => {
    /**
     * RENDER AN ERROR MESSAGE FOR  1500ms AND THEN UNREDER IT
     */
    
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 5000);
  };


  getData = async (sucursal) => {

    this.setState({sucursal: sucursal});
    try {
      this.setState({
        filtered: false
      });
      const response = await api.get(`/survey-data/${sucursal}`);
      const productsResponse = await api.get(
        `/survey-data/products/${sucursal}`,
        {params: {
          filter: false
        }}
      ); 

      this.setState({surveyBySupervisor: response.data.supervisor});
      this.setState({surveyBySeller: response.data.seller});
      this.setState({logisticProblems: response.data.logistic});
    
      this.setState({surveyCount: productsResponse.data.surveyCount});
      this.setState(prevState => ({
        water: {
          ...prevState.water,           // copy all other key-value pairs of food object
          data: productsResponse.data.water
        },
        redcom: {
          ...prevState.redcom,           // copy all other key-value pairs of food object
          data: productsResponse.data.redcom
        },
        soda: {
          ...prevState.soda,           // copy all other key-value pairs of food object
          data: productsResponse.data.soda
        },
        wine: {
          ...prevState.wine,           // copy all other key-value pairs of food object
          data: productsResponse.data.wine
        },
        visitedPdv: productsResponse.data.visitedPdv
      }));
    
    this.getOpttions(sucursal);
      
    } catch (error) {
      this.renderError(
      error.response !== undefined
        ? error.response.data.error
        : "Error no identificado al cargar datos"
      );
    }
  };
  
  clearStates = () => {
    this.setState({surveyCount: 0});

    this.setState({surveyBySupervisor: []});

    this.setState({surveyBySeller: []});


    this.setState({logisticProblems: []});

    this.setState({sellers: []});
    this.setState({selectedSellerRoutes: []});


    this.setState(prevState => ({
      water: {
        ...prevState.water,           // copy all other key-value pairs of food object
        data: []
      },
      redcom: {
        ...prevState.redcom,           // copy all other key-value pairs of food object
        data: []
      },
      soda: {
        ...prevState.soda,           // copy all other key-value pairs of food object
        data: []
      },
      wine: {
        ...prevState.wine,           // copy all other key-value pairs of food object
        data: []
      },
      visitedPdv: []
    }))
    return 
  };

  getOpttions = async (sucursal) => {
    /**
     * GET ALL SELLERS BY SUPERVISOR AND SUCURSAL FROM API
     * 
     */
    try {
      // const sucursal = this.state.sucursal;
      const supervisor = window.localStorage.getItem("supervisor");
      const response = await api.get(`/sellers/${sucursal}/${supervisor}`);
      const usersResponse = await api.get(`/users/${sucursal}`);
      this.setState({
        supervisors: usersResponse.data.map((row) => {
          return { value: row.id, label: row.name };
        })
      });
      console.log(usersResponse.data)
      /**
       * SET THE SELECT OPTIONS
       */
      this.setState({
        sellers: response.data.map((row) => {
          return { value: row.id, label: row.name };
        })
      });
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al cargar datos"
      );
    }
  };


  handleSellerSelection = async (selectedSellerValue) => {
    // get the routes from api
    try {
      const sucursal = this.state.sucursal;

      const response = await api.get(
        `/routes/${sucursal}/${selectedSellerValue}`
      );
      this.setState({
        selectedSellerRoutes: response.data.map((row) => {
          return { value: row.id, label: row.name };
        })
      });
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al cargar datos"
      );
    }
  };

  clearFilters = () => {
    this.setState({
      finalDate: new Date().toISOString().split("T")[0],
      initialDate: new Date('2021-08-20').toISOString().split("T")[0],
      selectedSeller: "",
      selectedRoute: "",
      selectedSupervisor: "",
      selectedSellerRoutes: []
    });
  }
  
  clearSurveyData = () => {
    this.setState(prevState => ({
      water: {
        ...prevState.water,           // copy all other key-value pairs of food object
        data: []
      },
      redcom: {
        ...prevState.redcom,           // copy all other key-value pairs of food object
        data: []
      },
      soda: {
        ...prevState.soda,           // copy all other key-value pairs of food object
        data: []
      },
      wine: {
        ...prevState.wine,           // copy all other key-value pairs of food object
        data: []
      },
      visitedPdv: []
    }));
    return
  }

  applyFilter = async () => {
    try {
      console.log(this.state)
      const sucursal = this.state.sucursal;
      
      
      // clearing charts data to get the new
      await this.clearSurveyData()
  
      
      // retrieving the charts data from the api
      const productsResponse = await api.get(
        `/survey-data/products/${sucursal}`,
        {params: {
          filter: true,
          initialDate: this.state.initialDate,
          finalDate: this.state.finalDate,
          // if the filters are enabled
          selectedSupervisor: document.getElementById('supervisor-enabled').checked ? this.state.selectedSupervisor : "",
          selectedSeller: document.getElementById('prevetista-enabled').checked ? this.state.selectedSeller : "",
          selectedRoute: document.getElementById('ruta-enabled').checked ? this.state.selectedRoute : ""
        }
      });
      console.log(productsResponse)
      if (productsResponse.data.code === 1) {
        this.setState({sinData: true})
      } else {
        this.setState({sinData: false})
      }
  
      // setting the filtered data from api
      this.setState({surveyCount: productsResponse.data.surveyCount});
      this.setState(prevState => ({
        water: {
          ...prevState.water,           // copy all other key-value pairs of food object
          data: productsResponse.data.water
        },
        redcom: {
          ...prevState.redcom,           // copy all other key-value pairs of food object
          data: productsResponse.data.redcom
        },
        soda: {
          ...prevState.soda,           // copy all other key-value pairs of food object
          data: productsResponse.data.soda
        },
        wine: {
          ...prevState.wine,           // copy all other key-value pairs of food object
          data: productsResponse.data.wine
        },
        visitedPdv: productsResponse.data.visitedPdv
      }));

      this.setState({
        filtered: true
      });
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al cargar datos"
      );
    }
  };

  download = () => {
    // const input = ;
    window.scrollTo(0,0)
    html2canvas(
      document.getElementById('pdf'),
      {
        ignoreElements: function (el) {return el.className === 'ignore-pdf';},
        dpi: 300, // Set to 300 DPI
        scale: 1 // Adjusts your resolution
      }
    )
      .then((canvas) => {

        const imgData = canvas.toDataURL("image/jpeg");

        const pdf = new jsPDF({
          orientation: "portrait", // landscape or portrait
          unit: "mm",
          format: "a4",
        });
        const imgProps = pdf.getImageProperties(imgData);
        const margin = 0.085;

        const pdfWidth = pdf.internal.pageSize.width * (1 - margin);
        const pdfHeight = pdf.internal.pageSize.height * (1 - margin);

        const x = pdf.internal.pageSize.width * (margin * 1.75);
        const y = pdf.internal.pageSize.height * (margin / 2);

        const widthRatio = pdfWidth / imgProps.width;
        const heightRatio = pdfHeight / imgProps.height;
        const ratio = Math.min(widthRatio, heightRatio);

        const w = imgProps.width * ratio;
        const h = imgProps.height * ratio;

        pdf.addImage(imgData, "JPEG", x, y, w, h);

        pdf.save(`relevamientos`);
      });
  }


  componentDidMount() {
    const roll = window.localStorage.getItem("roll");
    this.setState({
      roll: roll === 'admin'
    })
    this.getData(window.localStorage.getItem('sucursal'))
  };

  constructor(props) {
    super(props)

    this.state.sucursal = window.localStorage.getItem('sucursal');
    this.state.initialDate = new Date('2021-08-20').toISOString().split("T")[0]
    this.state.finalDate = new Date().toISOString().split("T")[0]
  }
  
  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="survey-statistics">
          <div id="pdf">
            <div className="ignore-pdf">
              <Nav active="surveys"/>
            </div>
            <h2>Estadisticas de los Relevamientos</h2>
            <div className="ignore-pdf">

            {this.state.error !== "" ? (
              <>
                <hr />
                <div
                  className="alert alert-danger"
                  role="alert"
                  style={{ marginBottom: "1.6rem" }}
                >
                  {this.state.error}
                </div>
              </>
            ) : null}
            {this.state.roll?
              <>
                <div className="form-group">
                  <label
                    htmlFor="filter-type"
                    style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }}
                    >
                    Sucursal
                  </label>
                  <select 
                    onChange={e => {
                      this.clearStates();
                      this.clearFilters();
                      this.getData(e.target.value);
                      // this.getOpttions();
                    }} 
                    className="form-select" 
                    id="filter-type"
                  >
                    <option value="1">Corrientes</option>
                    <option value="2">Resistencia</option>
                    <option value="3">Posadas</option>
                  </select>
                </div>
              </>
            :<></>}

            </div>   

            {this.state.sellers.length !== 0?
              <>
                <div className="ignore-pdf">
                  <StyledPieChart label="Cantidad de Relevamientos de cada supervisor:" data={this.state.surveyBySupervisor} />
                  <StyledPieChart label="Cantidad de Relevamientos de cada preventista:" data={this.state.surveyBySeller} />
                  <StyledPieChart label="Cantidad de PDV con reclamos de logistica:" data={this.state.logisticProblems} colors={["#DC3912", "#3366CC"]} />
                </div>      
                <>
                  <h3 style={{marginTop: '2.4rem', marginLeft: '1.2rem'}}>Filtros</h3>
                  <div id="filters">
                    <CheckSelect
                      options={this.state.supervisors}
                      loadOption="Cargando"
                      label="Supervisor"
                      name="supervisor"
                      id="supervisor"
                      onChange={(e) => {
                        this.setState({
                          selectedSupervisor: e.target.value
                        });
                      }}
                    />
                    <CheckSelect
                      options={this.state.sellers}
                      loadOption="Cargando"
                      label="Vendedor"
                      name="prevetista"
                      id="prevetista"
                      dependent="ruta"
                      onChange={(e) => {
                        this.setState({
                          selectedSeller: e.target.value,
                          selectedSellerRoutes: []
                        });
                        this.handleSellerSelection(e.target.value);
                      }}
                    />
                    <CheckSelect
                      options={this.state.selectedSellerRoutes}
                      loadOption={
                        this.state.selectedSeller !== "" &&
                        this.state.selectedSellerRoutes !== []
                          ? "Cargando"
                          : "Elegí un preventista primero"
                      }
                      
                      label="Ruta"
                      name="ruta"
                      id="ruta"
                      onChange={(e) => this.setState({ selectedRoute: e.target.value })}
                    />
                    <div className="mb-3" style={{marginBottom: '2.4rem'}}>
                      <label 
                        className="form-label" 
                        htmlFor="filter-value"
                        style={{ 
                          marginLeft: "0.4rem",
                          marginBottom: "0.8rem"
                        }}
                      >
                        Intervalo
                      </label>
                      <div className="input-group">
                        <input 
                          className="form-control" 
                          type="date" 
                          id="filter-date-first"
                          placeholder="dd-mm-yyyy"
                          style={{ minHeight: "3rem" }}
                          onChange={(e) => this.setState({ initialDate: e.target.value })}
                          required
                          min={new Date('2021-08-20').toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                        />
                        <input 
                          className="form-control" 
                          type="date" 
                          id="filter-date-second"
                          style={{ minHeight: "3rem" }}
                          onChange={(e) => this.setState({ finalDate: e.target.value })}
                          required
                          placeholder="dd-mm-yyyy"
                          min={new Date('2021-08-20').toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                          pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ignore-pdf" style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {this.state.filtered?
                      <div className="btn-group" role="group" >
                        <button className="btn btn-outline-primary" type="button" onClick={()=>{this.applyFilter()}}>Filtrar</button>
                        <button 
                          className="btn btn-outline-danger" 
                          type="button" 
                          onClick={()=>{
                            this.clearFilters();
                            this.clearSurveyData();
                            this.getData(this.state.sucursal)
                          }}
                        >
                          Remover Filtros
                        </button>
                      </div>
                    :
                      <button className="btn btn-outline-primary" type="button" onClick={()=>{this.applyFilter()}}>Filtrar</button>
                    }
                    {!this.state.sinData && this.state.redcom.data.length !== 0?
                      <button className="btn btn-outline-success" onClick={this.download}>
                        Download
                      </button>
                    :<></>}
                  </div>
                </>


                <div className="ignore-pdf">
                  <hr />
                </div>
                {this.state.redcom.data.length !== 0?
                  <>
                  {!this.state.sinData?
                    <>
                      <h3 
                        style={{
                          marginTop: '2.4rem',
                          marginLeft: '1.2rem', 
                          marginBottom: 0, 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center'
                        }}
                        >
                        Relevamientos
                        <div
                          style={{
                            fontFamily: 'Roboto',
                            fontWeight: 400,
                            width: '40%',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            paddingBlock: '0.6rem',
                            paddingInline: '0.8rem',
                            border: '1px #d5d5d8 solid',
                            borderRadius: '0.3rem'
                          }}
                        >
                          <p style={{margin: 0, fontSize: '1.2rem'}}>Número de Relevamientos</p>
                          <p style={{margin: 0}}>{this.state.surveyCount}</p>
                        </div>
                      </h3>
                      <StyledBarChart label="Relevamiento de productos Redcom:" data={this.state.redcom.data} headers={this.state.redcom.headers} />
                      <div className="ignore-pdf">
                        <StyledPieChart label="Cantidad de PDV con visita:" data={this.state.visitedPdv} colors={["#3366CC", "#DC3912"]} /> 
                        <StyledBarChart label="Relevamiento de competencia de gaseosas:" data={this.state.soda.data} headers={this.state.soda.headers} />
                        <StyledBarChart label="Relevamiento de competencia de aguas:" data={this.state.water.data} headers={this.state.water.headers} />
                        <StyledBarChart label="Relevamiento de competencia de vinos:" data={this.state.wine.data} headers={this.state.wine.headers} />
                      </div>
                    </>
                  :
                    <div id="loading-chart" className="alert alert-danger" style={{marginTop: '1.6rem'}}>
                      No hay datos para ese filtro!
                    </div>
                  }
                </>
              :
              <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                  Cargando datos de los graficos...<AiOutlineLoading3Quarters className="icon-spin" />
                </div>
              }
              </>
            :
            <div id="loading-chart" style={{alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                Cargando datos de los graficos...<AiOutlineLoading3Quarters className="icon-spin" />
              </div>
            }
          </div>
          </main>
        </FormContainer>
        </>
    );
  }
}
