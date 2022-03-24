import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Input from "../../components/Input";
import Switch from "../../components/Switch";
import SwitchToggleButtons from "../../components/SwitchToggleButtons";
import CheckInput from "../../components/CheckInput";
import FormContainer from "../../components/FormContainer";
import Header from "../../components/Header";
import Auth from "../../components/Auth";
import api from "../../services/api";

import "./coaching.css";

function Coaching() {
  const {state: locationState} = useLocation();
  const navigate = useNavigate();

  const [clientCountage, setClientCountage] = useState(0);
  const [clientId, setClientId] = useState(0);
  const [clientName, setClientName] = useState("");
  const [seller, setSeller] = useState('');
  const [route, setRoute] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);
  const [lastOrder, setLastOrder] = useState(false);
  const [sellPlan, setSellPlan] = useState(false);
  const [pop, setPop] = useState(false);
  const [stock, setStock] = useState(false);
  const [exposition, setExposition] = useState(false);
  const [competitorSales, setCompetitorSales] = useState(false);
  const [sales, setSales] = useState(false);
  const [sellPropouse, setSellPropouse] = useState(false);
  const [deliveryPrecautions, setDeliveryPrecautions] = useState(false);
  const [popPricing, setPopPricing] = useState(false);
  const [timeManagement, setTimeManagement] = useState(false);
  const [catalogue, setCatalogue] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [cordy, setCordy] = useState(0.0);
  const [cordx, setCordx] = useState(0.0);
  const [error, setError] = useState("");


  const getStats = ({
    lastOrder: lastOrderStats,
    sellPlan: sellPlanStats,
    pop: popStats,
    stock: stockStats,
    exposition: expositionStats,
    competitorSales: competitorSalesStats,
    sales: salesStats,
    sellPropouse: sellPropouseStats,
    deliveryPrecautions: deliveryPrecautionsStats,
    popPricing: popPricingStats,
    timeManagement: timeManagementStats,
    catalogue: catalogueStats
  }) => ({
      lastOrder: lastOrder ? lastOrderStats + 1 : lastOrderStats,
      sellPlan: sellPlan ? sellPlanStats + 1 : sellPlanStats,
      pop: pop ? popStats + 1 : popStats,
      stock: stock ? stockStats + 1 : stockStats,
      exposition: exposition ? expositionStats + 1 : expositionStats,
      competitorSales: competitorSales ? competitorSalesStats + 1 : competitorSalesStats,
      sales: sales ? salesStats + 1 : salesStats,
      sellPropouse: sellPropouse ? sellPropouseStats + 1 : sellPropouseStats,
      deliveryPrecautions: deliveryPrecautions ? deliveryPrecautionsStats + 1 : deliveryPrecautionsStats,
      popPricing: popPricing ? popPricingStats + 1 : popPricingStats,
      timeManagement: timeManagement ? timeManagementStats + 1 : timeManagementStats,
      catalogue: catalogue ? catalogueStats + 1 : catalogueStats
    })

  const submit = async () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to end pass the type by query
     */

    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");

    const data = {
      supervisor,
      sucursal,
      seller,
      route,
      clientId,
      clientName,
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
      catalogue,
      relationship,
      cordy,
      cordx
    };

    if (clientName === "") {
      return renderError(
        `El campo de nombre del cliente no puede ser vacio`
      );
    }
    /**
     * THS STATS IN A OBJECT AND RE INSERT IT INTO THE LOCATION STATE
     */
    locationState.stats = getStats(locationState.stats);
      
    setLoadingSend(true);

    try {
      await api.post("/coaching", data);
      return navigate("/fin", {state: locationState});
    } catch (error) {
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Coaching"
      );
    } finally {
      setLoadingSend(false);
    }

  };

  // reder error label
  const renderError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 10000);
  };

  // get geolocation when api already responded
  useEffect(() => {
    try {
      // request api
      navigator.geolocation.getCurrentPosition((position) => {
        setCordy(position.coords.latitude)
        setCordx(position.coords.longitude)
      },
      () => {
        this.renderError("Geolocalización no activada");
        return
      },
      {
        enableHighAccuracy: true
      });
    } catch (error) {
      // catch => render error
      renderError(
        error.response !== undefined
        ? error.response.data.error
        : "Error no identificado en al geoposición"
        );
      } 
      
  }, []);

  // componentDidMount
  useEffect(() => {
    try {
      setClientCountage(locationState.clientCountage);
      setRoute(locationState.route);
      setSeller(locationState.seller);
    } catch (error) {
      setClientCountage('Error!')
      renderError('Falla al buscar datos del sistema! Intente volver al menu principal y continuarla.')
    }
  }, []);
  

  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main id="coaching">
          <h2>
            Cliente Numero: <strong>{clientCountage}</strong>
          </h2>
          <hr />
          {error !== "" ? (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ marginBottom: "1.6rem" }}
            >
              {error}
            </div>
          ) : null}
          <Input
            label="Nombre del Cliente"
            type="text"
            name="client-name"
            id="client-name"
            onChange={(e) => setClientId(e.target.value)}
          />
          <CheckInput
            label="Codigo del Cliente"
            type="number"
            info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
            pattern="\d*"
            name="client-id"
            id="client-id"
            onChange={(e) => setClientName(e.target.value)}
          />

          <Switch
            label="¿Indaga sobre el último pedido?"
            name="last-order"
            id="last-order"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setLastOrder(e.target.checked)}
          />
          <Switch
            label="¿Planifica el pedido antes de ingresar al PDV?"
            name="sell-plan"
            id="sell-plan"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setSellPlan(e.target.checked)}
          />
          <Switch
            label="¿POP?"
            name="pop"
            id="pop"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setPop(e.target.checked)}
          />
          <Switch
            label="¿Verifica el stock en todas las áreas del PDV?"
            name="stock"
            id="stock"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setStock(e.target.checked)}
          />

          <Switch
            label="¿Trabaja en una mayor exposición de los productos?"
            name="exposition"
            id="exposition"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setExposition(e.target.checked)}
          />
          <Switch
            label="¿Indaga y verifica la situación y las acciones de la competencia?"
            name="competitor-sales"
            id="competitor-sales"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) =>
              setCompetitorSales(e.target.checked)
            }
          />
          <Switch
            label="¿Comunica las acciones comerciales vigentes?"
            name="sales"
            id="sales"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setSales(e.target.checked)}
          />
          <Switch
            label="¿Realiza la propuesta de ventas, ofreciendo todos los productos?"
            name="sell-propouse"
            id="sell-propouse"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) =>
              setSellPropouse(e.target.checked)
            }
          />
          <Switch
            label="¿Toma todos los recaudos necesarios para facilitar la entrega? (pedido, dinero, horario, etc.)"
            name="delivery-precautions"
            id="delivery-precautions"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) =>
              setDeliveryPrecautions(e.target.checked)
            }
          />
          <Switch
            label="¿Renueva, coloca y pone precios al POP? Siguiendo criterios del PDV"
            name="pop-pricing"
            id="pop-pricing"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setPopPricing(e.target.checked)}
          />
          <Switch
            label="¿Administra el tiempo de permanencia en el PDV?"
            name="time-management"
            id="time-management"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) =>
              setTimeManagement(e.target.checked)
            }
          />
          <Switch
            label="Uso de Catálogo"
            name="catalogue"
            id="catalogue"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setCatalogue(e.target.checked)}
          />
          <SwitchToggleButtons
            label="Relación con el cliente:"
            options={[
              { label: "Muy buena", value: "Muy buena", name: "very-good" },
              { label: "Buena", value: "Buena", name: "good" },
              { label: "Regular", value: "Regular", name: "regular" },
              { label: "Mala", value: "Mala", name: "bad" }
            ]}
            labelStyle={{
              fontSize: "1.8rem"
            }}
            name="relationship"
            onChange={(e) => setRelationship(e.target.value)}
          />

          <hr />
          <button
            disabled={loadingSend}
            onClick={submit}
            id="coaching-button"
            className="btn btn-primary btn-lg submit-button"
            style={{ marginTop: "2rem" }}
          >
            {loadingSend ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : (
              <>Enviar Evaluación</>
            )}
          </button>
        </main>
      </FormContainer>
    </>
  );
}

export default Coaching;  

/*

  getStats(actualStats) {
    /**
     * TODO
     * SEPARATE EVERY QUESTION COUNTAGE IN A DIFERENT COUNTER ADD IT ALL TO A OBJECT
     * GET THE DATA FROM ACTUAL STATS {default=0}
     * ADD THE COUNTAGES
     * RETURN THE NEW STATS OBJECT
     *//*
    //STATISTICS
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
    } = this.state;
    /*
    stats: {
      lastOrder: 0.0,
      sellPlan: 0.0,
      pop: 0.0,
      stock: 0.0,
      exposition: 0.0,
      competitorSales: 0.0,
      sales: 0.0,
      sellPropouse: 0.0,
      deliveryPrecautions: 0.0,
      popPricing: 0.0,
      timeManagement: 0.0,
      catalogue: 0.0,
      total: 0.0 //AVG
    } //POINTAGE IN COACHING
    *//*
    let newStats = {};
    newStats.lastOrder = lastOrder ? actualStats.lastOrder + 1 : actualStats.lastOrder;
    newStats.sellPlan = sellPlan ? actualStats.sellPlan + 1 : actualStats.sellPlan;
    newStats.pop = pop ? actualStats.pop + 1 : actualStats.pop;
    newStats.stock = stock ? actualStats.stock + 1 : actualStats.stock;
    newStats.exposition = exposition ? actualStats.exposition + 1 : actualStats.exposition;
    newStats.competitorSales = competitorSales ? actualStats.competitorSales + 1 : actualStats.competitorSales;
    newStats.sales = sales ? actualStats.sales + 1 : actualStats.sales;
    newStats.sellPropouse = sellPropouse ? actualStats.sellPropouse + 1 : actualStats.sellPropouse;
    newStats.deliveryPrecautions = deliveryPrecautions ? actualStats.deliveryPrecautions + 1 : actualStats.deliveryPrecautions;
    newStats.popPricing = popPricing ? actualStats.popPricing + 1 : actualStats.popPricing;
    newStats.timeManagement = timeManagement ? actualStats.timeManagement + 1 : actualStats.timeManagement;
    newStats.catalogue = catalogue ? actualStats.catalogue + 1 : actualStats.catalogue;

    return newStats;
  }

  handleCoachingSubmit = async () => {
  };

  componentDidMount() {
    try {
      this.setState({
        clientCountage: this.props.location.state.clientCountage
      });
    } catch (error) {
      this.props.history.push("/");
    }

    /**
     * CONFIGURING GEOLOCALIZATION 
     *//*
    if (!("geolocation" in navigator)) {
      this.renderError("Geolocalización no activada");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        cordy: position.coords.latitude,
        cordx: position.coords.longitude
      });
    },
    () => {
      this.renderError("Geolocalización no activada");
      return
    },
    {
      enableHighAccuracy: true
    });
  }

  render() {
    const { clientCountage } = this.state;
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="coaching">
            <h2>
              Cliente Numero: <strong>{clientCountage}</strong>
            </h2>
            <hr />
            {this.state.error !== "" ? (
              <div
                className="alert alert-danger"
                role="alert"
                style={{ marginBottom: "1.6rem" }}
              >
                {this.state.error}
              </div>
            ) : null}
            <Input
              label="Nombre del Cliente"
              type="text"
              name="client-name"
              id="client-name"
              onChange={(e) => this.setState({ clientName: e.target.value })}
            />
            <CheckInput
              label="Codigo del Cliente"
              type="number"
              info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
              pattern="\d*"
              name="client-id"
              id="client-id"
              onChange={(e) => this.setState({ clientId: e.target.value })}
            />

            <Switch
              label="¿Indaga sobre el último pedido?"
              name="last-order"
              id="last-order"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ lastOrder: e.target.checked })}
            />
            <Switch
              label="¿Planifica el pedido antes de ingresar al PDV?"
              name="sell-plan"
              id="sell-plan"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ sellPlan: e.target.checked })}
            />
            <Switch
              label="¿POP?"
              name="pop"
              id="pop"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ pop: e.target.checked })}
            />
            <Switch
              label="¿Verifica el stock en todas las áreas del PDV?"
              name="stock"
              id="stock"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ stock: e.target.checked })}
            />

            <Switch
              label="¿Trabaja en una mayor exposición de los productos?"
              name="exposition"
              id="exposition"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ exposition: e.target.checked })}
            />
            <Switch
              label="¿Indaga y verifica la situación y las acciones de la competencia?"
              name="competitor-sales"
              id="competitor-sales"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ competitorSales: e.target.checked })
              }
            />
            <Switch
              label="¿Comunica las acciones comerciales vigentes?"
              name="sales"
              id="sales"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ sales: e.target.checked })}
            />
            <Switch
              label="¿Realiza la propuesta de ventas, ofreciendo todos los productos?"
              name="sell-propouse"
              id="sell-propouse"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ sellPropouse: e.target.checked })
              }
            />
            <Switch
              label="¿Toma todos los recaudos necesarios para facilitar la entrega? (pedido, dinero, horario, etc.)"
              name="delivery-precautions"
              id="delivery-precautions"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ deliveryPrecautions: e.target.checked })
              }
            />
            <Switch
              label="¿Renueva, coloca y pone precios al POP? Siguiendo criterios del PDV"
              name="pop-pricing"
              id="pop-pricing"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ popPricing: e.target.checked })}
            />
            <Switch
              label="¿Administra el tiempo de permanencia en el PDV?"
              name="time-management"
              id="time-management"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) =>
                this.setState({ timeManagement: e.target.checked })
              }
            />
            <Switch
              label="Uso de Catálogo"
              name="catalogue"
              id="catalogue"
              labelStyle={{
                fontSize: "1.8rem"
              }}
              onChange={(e) => this.setState({ catalogue: e.target.checked })}
            />
            <SwitchToggleButtons
              label="Relación con el cliente:"
              options={[
                { label: "Muy buena", value: "Muy buena", name: "very-good" },
                { label: "Buena", value: "Buena", name: "good" },
                { label: "Regular", value: "Regular", name: "regular" },
                { label: "Mala", value: "Mala", name: "bad" }
              ]}
              labelStyle={{
                fontSize: "1.8rem"
              }}
              name="relationship"
              onChange={(e) => this.setState({ relationship: e.target.value })}
            />

            <hr />
            <button
              disabled={this.state.loadingSend}
              onClick={this.handleCoachingSubmit}
              id="coaching-button"
              className="btn btn-primary btn-lg submit-button"
              style={{ marginTop: "2rem" }}
            >
              {this.state.loadingSend ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>Enviar Evaluación</>
              )}
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
*/
