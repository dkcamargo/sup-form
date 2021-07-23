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
    cordx: 0.0
  };

  handlePostCoachingSubmit = () => {
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

    api.post("/post-coaching", data);

    return this.props.history.push("/fin", this.props.location.state);
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        cordy: position.coords.latitude,
        cordx: position.coords.longitude
      });
    });
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
