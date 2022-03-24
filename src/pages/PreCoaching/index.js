import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Auth from "../../components/Auth";
import Header from "../../components/Header";
import Switch from "../../components/Switch";
import api from "../../services/api";

import "./pre_coaching.css";
import FormContainer from "../../components/FormContainer";


function PreCoaching() {
  const {state: locationState} = useLocation();
  const navigate = useNavigate();


  const [loadingSend, setLoadingSend] = useState(false);
  const [uniformPop, setUniformPop] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(false);
  const [price, setPrice] = useState(false);
  const [posters, setPosters] = useState(false);
  const [plan, setPlan] = useState(false);
  const [sales, setSales] = useState(false);
  const [helmet, setHelmet] = useState(false);
  const [noCellphone, setNoCellphone] = useState(false);
  const [laws, setLaws] = useState(false);
  const [cordy, setCordy] = useState(0.0);
  const [cordx, setCordx] = useState(0.0);
  const [error, setError] = useState("");

  const submit = async () => {
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = locationState;

    const data = {
      sucursal,
      supervisor,
      seller,
      route,
      uniformPop,
      dailyGoal,
      price,
      posters,
      plan,
      sales,
      helmet,
      noCellphone,
      laws,
      cordx,
      cordy
    };

    setLoadingSend(true);
    try {
      await api.post("/pre-coaching", data);
      return navigate('/coaching', {state: locationState})
    } catch (error) {
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Pre Coaching"
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
    }, 2500);
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
  
  return (
    <>
      <Header />
      <Auth />
      <FormContainer>
        <main id="pre-coaching">
          <h2>Antes de iniciar la ruta</h2>
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
          <Switch
            label="¿Tiene el uniforme correspondiente, el kit básico y suficiente material POP?"
            name="uniform-pop"
            id="uniform-pop"
            labelStyle={{
              fontSize: "1.6rem"
            }}
            onChange={(e) => setUniformPop(e.target.checked)}
          />

          <Switch
            label="¿Conoce el avance de las marcas y los objetivos del día, planificados para los principales calibres?"
            name="daily-goal"
            id="daily-goal"
            labelStyle={{
              fontSize: "1.6rem"
            }}
            onChange={(e) => setDailyGoal(e.target.checked)}
          />

          <Switch
            label="¿Conoce los precios de los 6 principales productos que vende?"
            name="price"
            id="price"
            labelStyle={{
              fontSize: "1.6rem"
            }}
            onChange={(e) => setPrice(e.target.checked)}
          />

          <Switch
            label="¿Conoce el estado de los afiches en la ruta?"
            name="posters"
            id="posters"
            labelStyle={{
              fontSize: "1.6rem"
            }}
            onChange={(e) => setPosters(e.target.checked)}
          />

          <Switch
            label="¿Planifica la ruta del día?"
            name="plan"
            id="plan"
            labelStyle={{
              fontSize: "1.6rem"
            }}
            onChange={(e) => setPlan(e.target.checked)}
          />

          <Switch
            label="¿Conoce las acciones del día y sus respectivos precios?"
            name="sales"
            id="sales"
            labelStyle={{
              fontSize: "1.6rem"
            }}
            onChange={(e) => setSales(e.target.checked)}
          />

          <h2>Seguridad Vial</h2>
          <hr />

          <Switch
            label="Utiliza Casco?"
            name="helmet"
            id="helmet"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setHelmet(e.target.checked)}
          />

          <Switch
            label="¿Conduce sin utilizar el celular?"
            name="no-cellphone"
            id="no-cellphone"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setNoCellphone(e.target.checked)}
          />

          <Switch
            label="¿Respeta las leyes de transito?"
            name="laws"
            id="laws"
            labelStyle={{
              fontSize: "1.8rem"
            }}
            onChange={(e) => setLaws(e.target.checked)}
          />

          <button
            disabled={loadingSend}
            onClick={submit}
            id="pre-coaching-button"
            className="btn btn-primary btn-lg submit-button"
          >
            {loadingSend ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : (
              <>Enviar</>
            )}
          </button>
        </main>
      </FormContainer>
    </>
  );

}

export default PreCoaching; 
/*

export default class PreCoaching extends Component {
  state = {
    loadingSend: false,
    uniformPop: false,
    dailyGoal: false,
    price: false,
    posters: false,
    plan: false,
    sales: false,
    helmet: false,
    noCellphone: false,
    laws: false,
    cordy: 0.0,
    cordx: 0.0,
    error: ""
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 4000);
  };

  handlePreCoachingSubmit = async () => {
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = this.props.location.state;
    const {
      uniformPop,
      dailyGoal,
      price,
      posters,
      plan,
      sales,
      helmet,
      noCellphone,
      laws,
      cordx,
      cordy
    } = this.state;

    const data = {
      sucursal,
      supervisor,
      seller,
      route,
      uniformPop,
      dailyGoal,
      price,
      posters,
      plan,
      sales,
      helmet,
      noCellphone,
      laws,
      cordx,
      cordy
    };

    this.setState({ loadingSend: true });
    try {
      await api.post("/pre-coaching", data);
      return this.props.history.push("/coaching", this.props.location.state);
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Pre Coaching"
      );
    } finally {
      this.setState({
        loadingLogIn: false
      });
    }
  };

  componentDidMount() {
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
  }
}
*/