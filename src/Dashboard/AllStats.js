import React from "react";
import axios from "axios";
import { Spin } from "antd";
import Actions from "../contants/Actions";
import { Table } from "antd";
import { getCookie } from "../contants/cookies";

export default class Stat extends React.Component {
  state = {
    form: [],
    loading: true,
  };

  componentDidMount() {
    const user = JSON.parse(getCookie("user"));
    axios
      .get(`http://localhost:3030/stat/statByUserId/${user._id}`)
      .then((stats) => {
        console.log(stats.data.job);
        this.setState({ form: stats.data.job, loading: false });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { loading, form } = this.state;

    const columns = [
      {
        title: "Name",
        render: (text, record) => <p>{record.Diagnosis[0].common_name}</p>,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Actions
            showUpdate
            showDelete={false}
            selectUrl={`/stat/${record._id}`}
          />
        ),
      },
    ];
    if (loading) {
      return <Spin />;
    }
    return (
      <div>
        <h1 style={{ marginBottom: 15 }}>Statistics </h1>
        <Table
          rowKey={"_id"}
          loading={loading}
          dataSource={form}
          columns={columns}
        />
      </div>
    );
  }
}
