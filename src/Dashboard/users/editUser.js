import React from "react";
import axios from "axios";
import { Spin, Input, Select, notification } from "antd";
import { Row, Col, Button } from "antd";
import { getCookie, setCookies } from "../../contants/cookies";
const { Option } = Select;

export default class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  componentDidMount() {
    const user = JSON.parse(getCookie("user"));
    this.setState({ loading: false, user });
  }

  handleClick = () => {
    const { user } = this.state;
    const userKeys = Object.keys(user);
    let verified = true;

    userKeys.map((elem) => {
      if (user[elem].toString().length === 0) {
        verified = false;
      }
    });
    if (verified) {
      axios
        .post(`http://localhost:3030/user/update/${user._id}`, user)
        .then((updatedUser) => {
          setCookies("user", JSON.stringify(updatedUser.data.user));
          notification.success({
            message: "Update",
            description: "User Updated succesfully",
          });
        })
        .catch((err) =>
          notification.error({
            message: "Error",
            description: "there are some errors. please try again later",
          })
        );
    } else {
      notification.error({
        message: "Error",
        description: "There are required Field",
      });
    }
  };

  handleChange = (field, value) => {
    const { user } = this.state;
    user[field] = value;
    this.setState({ user });
  };

  render() {
    const { loading, user } = this.state;

    if (loading) {
      return <Spin />;
    }
    return (
      <div>
        <h1>Manage profile</h1>
        <Row gutter={[18, 18]} style={{ marginTop: 22 }}>
          <Col xs={12} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: "inline-block" }}>
              {" "}
              <p style={{ color: "red" }}>*</p>
            </div>
            <div style={{ display: "inline-block" }}>First Name</div>
            <Input
              onChange={(ev) => this.handleChange("firstName", ev.target.value)}
              placeholder="First Name"
              value={user.firstName}
            />
            {user.firstName.length === 0 && (
              <div
                style={{
                  display: "inline-block",
                  color: "red",
                  fontSize: "0.8rem",
                }}
              >
                First Name is required
              </div>
            )}
          </Col>

          <Col xs={12} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: "inline-block" }}>
              {" "}
              <p style={{ color: "red" }}>*</p>
            </div>
            <div style={{ display: "inline-block" }}>Last Name</div>
            <Input
              onChange={(ev) => this.handleChange("lastName", ev.target.value)}
              placeholder="Last Name"
              value={user.lastName}
            />
            {user.lastName.length === 0 && (
              <div
                style={{
                  display: "inline-block",
                  color: "red",
                  fontSize: "0.8rem",
                }}
              >
                Last Name is required
              </div>
            )}
          </Col>

          <Col xs={12} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: "inline-block" }}>
              {" "}
              <p style={{ color: "red" }}>*</p>
            </div>
            <div style={{ display: "inline-block" }}>Email</div>
            <Input
              onChange={(ev) => this.handleChange("email", ev.target.value)}
              placeholder="Email"
              value={user.email}
            />
            {user.email.length === 0 && (
              <div
                style={{
                  display: "inline-block",
                  color: "red",
                  fontSize: "0.8rem",
                }}
              >
                Email is required
              </div>
            )}
          </Col>
        </Row>

        <Row gutter={[18, 18]}>
          <Col xs={12} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: "inline-block" }}>
              {" "}
              <p style={{ color: "red" }}>*</p>
            </div>
            <div style={{ display: "inline-block" }}>City</div>
            <Input
              onChange={(ev) => this.handleChange("city", ev.target.value)}
              placeholder="City"
              value={user.city}
            />
            {user.city.length === 0 && (
              <div
                style={{
                  display: "inline-block",
                  color: "red",
                  fontSize: "0.8rem",
                }}
              >
                City is required
              </div>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xl={8}>
            <div style={{ display: "inline-block" }}>
              {" "}
              <p style={{ color: "red" }}>*</p>
            </div>
            <div style={{ display: "inline-block" }}>Gender</div>
            <Select
              onChange={(ev) => this.handleChange("gender", ev)}
              value={user.gender}
              style={{ width: "100%" }}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
            {user.gender.length === 0 && (
              <div
                style={{
                  display: "inline-block",
                  color: "red",
                  fontSize: "0.8rem",
                }}
              >
                Gender is required
              </div>
            )}
          </Col>
        </Row>

        <Row style={{ marginTop: 22 }}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button
              style={{ float: "right" }}
              type="primary"
              onClick={this.handleClick}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
