import React from "react";
import "../Authentication/auth.css";
import Axios from "axios";
import { setCookies } from "../contants/cookies";
import { Spin, Select } from "antd";
import { Input } from "antd";

import { Link } from "react-router-dom";

export default class login extends React.Component {
  state = {
    loading: true,
    email: "",
    password: "",
    city: "",
    firstName: "",
    lastName: "",
    gender: "",
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
    console.log(this.state);
    Axios.post("http://localhost:3030/register/user", this.state)
      .then((data) => {
        this.props.history.push("/login");
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (this.state.loading) {
      return <Spin />;
    }
    return (
      <div
        // style={{ width: '100%', height: '100%',backgroundColor: '#1b1b1b',
        // color: '#FFF',
        // fontSize: '12px',
        // lineHeight: 1 }}
        className="body"
      >
        <div className="background-wrap">
          <div className="background"></div>
        </div>
        <form
          id="accesspanel "
          style={{ height: 520, overflow: "auto" }}
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
            <p>
              <Input
                type="text"
                onChange={(ev) =>
                  this.handleChange("firstName", ev.target.value)
                }
                name="username"
                value={this.state.firstName}
                id="email"
                placeholder="First Name"
              />
            </p>
            <p>
              <Input
                type="text"
                value={this.state.lastName}
                onChange={(ev) =>
                  this.handleChange("lastName", ev.target.value)
                }
                name="password"
                id="password"
                placeholder="Last Name"
              />
            </p>
            <p>
              <Input
                type="text"
                onChange={(ev) => this.handleChange("city", ev.target.value)}
                name="username"
                value={this.state.city}
                id="email"
                placeholder="City"
              />
            </p>
            <p>
              <Select
                style={{ width: "100%", backgroundColor: "grey" }}
                onChange={(ev) => this.handleChange("gender", ev)}
                value={this.state.gender}
              >
                <Select.Option Select value="male">
                  Male
                </Select.Option>
                <Select.Option value="female">Female</Select.Option>
              </Select>
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
              name="register"
              id="go"
              value="Register"
            />
          </p>
          <p className="p-container" style={{ textAlign: "center" }}>
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    );
  }
}
