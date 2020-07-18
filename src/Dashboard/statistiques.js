import React from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Spin } from "antd";

export default class Stat extends React.Component {
  state = {
    data: {
      labels: [],
      datasets: [
        {
          label: "Diagnosis",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [],
        },
      ],
    },
    loading: true,
  };

  componentDidMount() {
    console.log(this.props.match.params.id);
    const { data } = this.state;
    axios
      .get(`http://localhost:3030/stat/stat/${this.props.match.params.id}`)
      .then((stats) => {
        const { Diagnosis } = stats.data.job;
        console.log(Diagnosis);
        let labels = [];
        let datas = [];
        for (let i = 0; i < Diagnosis.length; i++) {
          const elem = Diagnosis[i];
          console.log(elem);
          labels.push(elem.common_name);
          const probability = elem.probability * 100;
          datas.push(probability);
        }
        console.log(labels, datas);
        data.labels = labels;
        data.datasets[0].data = datas;
        console.log(data);
        this.setState({ loading: false, data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { loading, data } = this.state;
    if (loading) {
      return <Spin />;
    }
    return (
      <Bar
        data={data}
        width={100}
        height={50}
        options={{
          maintainAspectRatio: false,
        }}
      />
    );
  }
}
