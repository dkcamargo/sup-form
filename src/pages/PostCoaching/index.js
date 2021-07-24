import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Auth from "../../components/Auth";
import Textarea from "../../components/Textarea";
import Header from "../../components/Header";
import Switch from "../../components/Switch";
import api from "../../services/api";

import "./post_coaching.css";
import FormContainer from "../../components/FormContainer";

export default class PostCoaching extends Component {
  state = {
    loadingSend: false,
    comments: true,
    commentsText: "",
    strongPoints: "",
    weakPoints: "",
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

  handlePostCoachingSubmit = async () => {
    /**
     * send data to api and
     * save number seller route and type in localstorage
     * redirect to caoching 1 pass the type by query
     */
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = this.props.location.state;

    const { comments, strongPoints, weakPoints, cordx, cordy } = this.state;

    const commentsText = !comments
      ? "Sin Comentarios"
      : this.state.commentsText;

    const data = {
      supervisor,
      sucursal,
      seller,
      route,
      commentsText,
      strongPoints,
      weakPoints,
      cordx,
      cordy
    };

    this.setState({ loadingSend: true });
    try {
      await api.post("/post-coaching", data);
      this.setState({ loadingSend: false });
      return this.props.history.push("/fin", this.props.location.state);
    } catch (error) {
      this.renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Post Coaching"
      );
      this.setState({
        loadingLogIn: false
      });
    }

    return this.props.history.push("/fin", this.props.location.state);
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        cordy: position.coords.latitude,
        cordx: position.coords.longitude
      });
    });

    try {
      const { seller, route } = this.props.location.state;
    } catch (error) {
      this.props.history.push("/preventista");
    }
  }
  render() {
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="post-coaching">
            <h2>Despues de terminar la ruta</h2>
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
            <Switch
              label="Comentarios?"
              name="comments"
              id="comments"
              value={true}
              checked={this.state.comments}
              onChange={(e) => {
                this.setState({ comments: e.target.checked });
              }}
            />
            {this.state.comments ? (
              <Textarea
                label="Comentarios:"
                name="comments-text"
                onChange={(e) => {
                  this.setState({ commentsText: e.target.value });
                }}
              />
            ) : (
              <></>
            )}

            <Textarea
              label="Puntos Fuertes:"
              name="strong-points"
              onChange={(e) => {
                this.setState({ strongPoints: e.target.value });
              }}
            />

            <Textarea
              label="Puntos a Desarrollar:"
              name="weak-points"
              onChange={(e) => {
                this.setState({ weakPoints: e.target.value });
              }}
            />

            <button
              disabled={this.state.loadingSend}
              onClick={this.handlePostCoachingSubmit}
              id="post-coaching-button"
              className="btn btn-primary btn-lg submit-button"
            >
              {this.state.loadingSend ? (
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
}
