import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Select from "../../components/Select";
import Input from "../../components/Input";
import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";
import api from "../../services/api";

import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {

  const [sucursales, setSucursales] = useState([])
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
        renderError("Geolocalización no activada");
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
        const response = await api.get("/login-data");
        
        setUsers(response.data.supervisors.map((row) => ({ value: row.id, label: row.name })));
        setSucursales(response.data.branches.map((row) => ({ value: row.id, label: row.name })));
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