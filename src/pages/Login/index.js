import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";
import api from "../../services/api";
import { useGeolocation } from 'react-use';

import "./login.css";
import { useNavigate } from "react-router-dom";
/*
export default class Login extends Component {
  state = {
    sucursales: [
      { value: 1, label: "Corrientes" },
      { value: 2, label: "Resistencia" },
      { value: 3, label: "Posadas" }
    ],
    loadingLogIn: false,
    users: [],
    userId: "",
    password: "",
    sucursal: "",
    error: "",
    cordy: 0.0,
    cordx: 0.0
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 2500);
  };

  getOpttions = async () => {
    try {
      const response = await api.get("/users");

      this.setState({
        users: response.data.map((row) => {
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

  handleLogin = async () => {
    // return this.props.history.push("/preventista");
    // eslint-disable-next-line
    const { userId, password, sucursal, cordy, cordx } = this.state;
    if (userId === "" || password === "" || sucursal === "") {
      return this.renderError("No podés dejar los campos vacios!");
    }
    try {
      this.setState({ loadingLogIn: true });
      const response = await api.post("/login", {
        userId,
        password,
        sucursal,
        cordy,
        cordx
      });

      const userData = response.data.user;

      this.setState({ loadingLogIn: false });
      //load session cookie
      window.localStorage.setItem("logged", true);
      window.localStorage.setItem("supervisor", userId);
      window.localStorage.setItem("sucursal", sucursal);
      window.localStorage.setItem("roll", userData.roll);
      // redirect now
      this.props.history.push("/");
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el LogIn"
      );
      this.setState({
        loadingLogIn: false
      });
    }
  };

  // call axios get the supervisores data
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

    this.getOpttions();
  }

  render() {
    return (
      <>
        <Header />
        <FormContainer>
          <main className="home">
            <h2>LogIn</h2>
            <hr />
            <Select
              options={this.state.users}
              loadOption="Cargando"
              label="Supervisor"
              name="supervisor"
              id="supervisor"
              onChange={(e) => this.setState({ userId: e.target.value })}
            />
            <Input
              label="Contraseña"
              type="password"
              name="password"
              id="password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <Select
              options={this.state.sucursales}
              label="Sucursal"
              name="sucursal"
              id="sucursal"
              onChange={(e) => this.setState({ sucursal: e.target.value })}
            />
            {this.state.error !== "" ? (
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            ) : null}
            <button
              disabled={this.state.loadingLogIn}
              onClick={this.handleLogin}
              id="login-button"
              className="btn btn-primary btn-lg submit-button"
            >
              {this.state.loadingLogIn ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>LogIn</>
              )}
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
*/

function Login() {
  const sucursales = [
    { value: 1, label: "Corrientes" },
    { value: 2, label: "Resistencia" },
    { value: 3, label: "Posadas" }
  ];

  const [loadingLogIn, setLoadingLogIn ] = useState(false);
  const [users, setUsers ] = useState([]);
  const [userId, setUserId ] = useState("");
  const [password, setPassword ] = useState("");
  const [sucursal, setSucursal ] = useState("");
  const [error, setError ] = useState("");
  const [cordy, setCordy ] = useState(0.0);
  const [cordx, setCordx ] = useState(0.0);

  const navigate = useNavigate();
  
  // handle login
  const login = async () => {
    // eslint-disable-next-line
    if (userId === "" || password === "" || sucursal === "") {
      return renderError("No podés dejar los campos vacios!");
    }
    
    try {
      setLoadingLogIn(true);
      const response = await api.post("/login", {
        userId,
        password,
        sucursal,
        cordy,
        cordx
      });

      const userData = response.data.user;

      setLoadingLogIn(false);
      //load session cookie
      window.localStorage.setItem("logged", true);
      window.localStorage.setItem("supervisor", userId);
      window.localStorage.setItem("sucursal", sucursal);
      window.localStorage.setItem("roll", userData.roll);
      // redirect now
      navigate("/");
    } catch (error) {
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el LogIn"
      );
      setLoadingLogIn(false);
    }
  }

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
      
  }, [users]);

  // "componentDidMount"
  useEffect(() => {
    const getUsersData = async () => {
      
      try {
        // request api
        const response = await api.get("/users");
        setUsers(response.data.map((row) => ({ value: row.id, label: row.name })));
      } catch (error) {
        // catch => render error
        renderError(
          error.response !== undefined
            ? error.response.data.error
            : "Error no identificado buscar datos de usuarios"
        );
      }    
    }
    
    getUsersData();
  }, []);

  return (
    <>
      <Header />
      <FormContainer>
        <main className="home">
          <h2>LogIn</h2>
          <hr />

          <Select
            options={users}
            loadOption="Cargando"
            label="Supervisor"
            name="supervisor"
            id="supervisor"
            onChange={(e) => (setUserId(e.target.value))}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            id="password"
            onChange={(e) => (setPassword(e.target.value))}
          />

          <Select
            options={sucursales}
            label="Sucursal"
            name="sucursal"
            id="sucursal"
            onChange={(e) => (setSucursal(e.target.value))}
          />

          {error !== "" ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          <button
            // disabled={this.state.loadingLogIn}
            onClick={login}
            id="login-button"
            className="btn btn-primary btn-lg submit-button"
          >
            {loadingLogIn ? (
              <AiOutlineLoading3Quarters className="icon-spin" />
            ) : (
              <>LogIn</>
            )}
          </button>
        </main>
      </FormContainer>
    </>
  );
}

export default Login;