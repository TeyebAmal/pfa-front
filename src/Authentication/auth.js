import React from "react";
import "./auth.css";
import Axios from "axios";
import { setCookies } from "../contants/cookies";
import { Spin, notification, Input } from "antd";
import { Link } from "react-router-dom";

export default class login extends React.Component {
  state = {
    loading: true,
    email: "",
    password: "",
  };

  componentDidMount() {
    Axios.post("http://localhost:3030/auth/verify-token", {
      token: localStorage.getItem("token"),
    })
      .then((data) => {
        window.location.href = "http://localhost:3006";
      })
      .catch((err) => this.setState({ loading: false }));
  }

  handleChange = (state, value) => {
    this.setState({ [state]: value });
  };

  handleSubmit = () => {
    Axios.post("http://localhost:3030/auth/user", this.state)
      .then((data) => {
        setCookies("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);
        window.location.href = "http://localhost:3006/chat";
      })
      .catch((err) =>
        notification.error({
          message: "Error",
          description: "Email or password incorrect ",
        })
      );
  };

  render() {
    if (this.state.loading) {
      return <Spin />;
    }
    return (
      <div
        className="body"
      >
        <div className="background-wrap">
          <div className="background"></div>
        </div>

        <form
          id="accesspanel"
          style={{ height: 350 }}
          onSubmit={this.handleSubmit}
        >
          <h1 id="litheader">DIAGNOSIS</h1>
          <div className="inset">
            <p>
              <Input
                type="text"
                onChange={(ev) => this.handleChange("email", ev.target.value)}
                name="username"
                id="email"
                placeholder="Email address"
              />
            </p>
            <p>
              <Input
                type="password"
                onChange={(ev) =>
                  this.handleChange("password", ev.target.value)
                }
                name="password"
                id="password"
                placeholder="Access code"
              />
            </p>

            <Input
              className="loginLoginValue"
              type="hidden"
              name="service"
              value="login"
            />
          </div>
          <p className="p-container">
            <Input
              type="button"
              onClick={this.handleSubmit}
              name="Login"
              id="go"
              value="Login"
            />
          </p>
          <p className="p-container" style={{ textAlign: "center" }}>
            <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    );
  }
}
